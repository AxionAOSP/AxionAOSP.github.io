"use client";

import { useState, useRef, DragEvent } from "react";
import forge from "node-forge";
import { Upload, Download, FileText, CheckCircle, AlertTriangle, ShieldCheck } from "lucide-react";

export default function KeyboxPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [conversionSuccess, setConversionSuccess] = useState(false);
  const [convertedXml, setConvertedXml] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setFile(null);
    setConversionSuccess(false);
    setConvertedXml(null);
    setErrorMsg(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      loadAndProcessFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith(".xml")) {
        loadAndProcessFile(droppedFile);
      } else {
        setErrorMsg("Invalid file format. Please upload an XML file.");
      }
    }
  };

  const convertToPkcs8Pem = (pem: string): string | null => {
    try {
      let pkcs8Pem = "";

      if (pem.includes("RSA PRIVATE KEY")) {
        const privateKey = forge.pki.privateKeyFromPem(pem) as forge.pki.rsa.PrivateKey;
        const rsaAsn1 = forge.pki.privateKeyToAsn1(privateKey);
        const pkcs8 = forge.pki.wrapRsaPrivateKey(rsaAsn1);
        pkcs8Pem = forge.pki.privateKeyInfoToPem(pkcs8)
          .replace("-----BEGIN PRIVATE KEY-----", "-----BEGIN RSA PRIVATE KEY-----")
          .replace("-----END PRIVATE KEY-----", "-----END RSA PRIVATE KEY-----");
      } else if (pem.includes("EC PRIVATE KEY")) {
        const der = forge.pki.pemToDer(pem);
        const ecPrivateKey = forge.asn1.fromDer(der);
        const idEcPublicKey = forge.asn1.oidToDer("1.2.840.10045.2.1").getBytes();
        const prime256v1 = forge.asn1.oidToDer("1.2.840.10045.3.1.7").getBytes();
        
        const asn1 = forge.asn1 as any;
        const algorithmIdentifier = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, idEcPublicKey),
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, prime256v1),
        ]);
        const pkcs8Asn1 = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, String.fromCharCode(0x00)),
          algorithmIdentifier,
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, asn1.toDer(ecPrivateKey).getBytes())
        ]);
        pkcs8Pem = forge.pki.privateKeyInfoToPem(pkcs8Asn1)
          .replace("-----BEGIN PRIVATE KEY-----", "-----BEGIN EC PRIVATE KEY-----")
          .replace("-----END PRIVATE KEY-----", "-----END EC PRIVATE KEY-----");
      } else {
        throw new Error("Unsupported key format.");
      }
      return pkcs8Pem;
    } catch (err) {
      return null;
    }
  };

  const loadAndProcessFile = (selectedFile: File) => {
    setFile(selectedFile);
    setErrorMsg(null);
    setConversionSuccess(false);
    setConvertedXml(null);

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const xmlText = e.target?.result as string;
        if (!xmlText) throw new Error("Could not read file text contents.");

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "application/xml");

        const parserError = xmlDoc.getElementsByTagName("parsererror");
        if (parserError.length > 0) {
          throw new Error("XML syntax compilation error. Verify your file.");
        }

        const keys = xmlDoc.getElementsByTagName("Key");
        if (keys.length === 0) {
          throw new Error("Invalid Keybox file: No <Key> element branches detected.");
        }

        let convertedCount = 0;

        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const privateKeyElem = key.getElementsByTagName("PrivateKey")[0];
          
          if (privateKeyElem && privateKeyElem.textContent) {
            const pemText = privateKeyElem.textContent.trim();
            if (
              pemText.includes("RSA PRIVATE KEY") ||
              pemText.includes("EC PRIVATE KEY")
            ) {
              const pkcs8Pem = convertToPkcs8Pem(pemText);
              
              if (pkcs8Pem) {
                privateKeyElem.setAttribute("format", "pem");
                privateKeyElem.textContent = pkcs8Pem;
                convertedCount++;
              }
            }
          }
        }

        if (convertedCount === 0) {
          throw new Error("No private keys eligible for PKCS#8 formatting were found.");
        }

        const serializer = new XMLSerializer();
        const updatedXml = serializer.serializeToString(xmlDoc);
        
        setConvertedXml(updatedXml);
        setConversionSuccess(true);
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to process keybox XML.");
      }
    };

    reader.onerror = () => {
      setErrorMsg("Failed to read file.");
    };

    reader.readAsText(selectedFile);
  };

  const triggerDownload = () => {
    if (!convertedXml) return;
    try {
      const blob = new Blob([convertedXml], { type: "application/xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "keybox_pkcs8_priv.xml";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setErrorMsg("Failed to trigger download file: " + err.message);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-axion-bg)] pt-32 pb-24 px-6 relative overflow-hidden select-none">
      <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-[var(--color-axion-accent)]/5 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[700px] h-[700px] bg-purple-950/10 blur-[180px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-axion-accent)] font-bold mb-4">Secured Cryptography</p>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white mb-6 leading-none">
            Keybox Updater.
          </h1>
          <p className="text-lg text-white/60 font-light max-w-xl mx-auto leading-relaxed">
            Convert private keys inside <code>keybox.xml</code> to <code>PKCS#8</code> PEM format client-side so they work seamlessly with Axion Keybox Spoofing.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !file && fileInputRef.current?.click()}
            className={`relative py-14 px-8 rounded-3xl border-2 border-dashed flex flex-col justify-center items-center text-center cursor-pointer transition-all duration-500 min-h-[260px]
              ${
                isDragging
                  ? "bg-[var(--color-axion-accent)]/10 border-[var(--color-axion-accent)] shadow-[0_0_30px_rgba(255,100,0,0.15)]"
                  : file
                  ? "bg-white/[0.02] border-white/20 cursor-default"
                  : "bg-white/[0.01] border-white/10 hover:border-[var(--color-axion-accent)] hover:bg-white/[0.02]"
              }
            `}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xml"
              className="hidden"
            />

            {file ? (
              <div className="space-y-5 w-full">
                <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto text-green-400">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="min-w-0 px-4">
                  <h3 className="text-white font-bold text-lg truncate max-w-xs mx-auto" title={file.name}>
                    {file.name}
                  </h3>
                  <p className="text-white/40 text-xs font-mono mt-1">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
                {conversionSuccess && (
                  <div className="flex items-center gap-1.5 justify-center text-green-400 text-sm font-semibold select-none">
                    <CheckCircle className="w-4 h-4 shrink-0" /> Conversion Successful
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    resetState();
                  }}
                  className="px-5 py-2 text-xs font-bold text-white/40 hover:text-white bg-white/5 hover:bg-white/10 rounded-full border border-white/5 transition-all"
                >
                  Clear File
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[var(--color-axion-accent)]/10 border border-[var(--color-axion-accent)]/20 flex items-center justify-center mx-auto text-[var(--color-axion-accent)]">
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-snug">Upload keybox.xml</h3>
                  <p className="text-white/40 text-sm mt-1">Drag and drop file here, or click to browse</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              disabled={!file}
              onClick={resetState}
              className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider rounded-2xl border transition-all select-none
                ${
                  file
                    ? "bg-white/5 hover:bg-white/10 border-white/10 text-white cursor-pointer"
                    : "bg-white/[0.01] border-white/5 text-white/20 cursor-not-allowed"
                }
              `}
            >
              Reset
            </button>

            <button
              disabled={!conversionSuccess}
              onClick={triggerDownload}
              className={`flex-[2] py-4 text-sm font-black uppercase tracking-widest rounded-2xl flex justify-center items-center gap-3 transition-all select-none
                ${
                  conversionSuccess
                    ? "bg-[var(--color-axion-accent)] hover:bg-[var(--color-axion-accent-hover)] text-[#100B09] shadow-[0_0_20px_rgba(255,100,0,0.2)] hover:shadow-[0_0_45px_rgba(255,100,0,0.45)] hover:scale-[1.02] cursor-pointer"
                    : "bg-white/[0.01] border border-white/5 text-white/20 cursor-not-allowed"
                }
              `}
            >
              <Download className="w-4 h-4 shrink-0" /> Download Converted Keybox
            </button>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex gap-3 items-center text-sm font-semibold select-none animate-shake">
              <AlertTriangle className="w-5 h-5 shrink-0" /> {errorMsg}
            </div>
          )}

          <div className="p-6 rounded-3xl bg-white/[0.01] border border-white/5 flex gap-4 items-start select-none">
            <ShieldCheck className="w-6 h-6 text-green-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-white font-bold text-xs">100% Client-Side Encryption</h4>
              <p className="text-white/40 text-[11px] leading-relaxed font-light">
                For your security, your keybox files are loaded and processed entirely inside your local browser sandbox. **No files or private keys are ever uploaded or transmitted to any remote servers.**
              </p>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
