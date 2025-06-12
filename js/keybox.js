function fileSelected() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  const uploadBtn = document.getElementById('uploadBtn');
  const convertBtn = document.getElementById('convertBtn');
  const status = document.getElementById('status');

  if (file) {
    uploadBtn.textContent = file.name;
    convertBtn.disabled = false;
    convertBtn.classList.remove("disabled");
    status.style.opacity = 0;
    status.textContent = '';
  }
}

function convertToPkcs8Pem(pem) {
  const forge = window.forge;
  try {
    let pkcs8Pem;

    if (pem.includes("RSA PRIVATE KEY")) {
      const privateKey = forge.pki.privateKeyFromPem(pem);
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
      const algorithmIdentifier = forge.asn1.create(forge.asn1.Class.UNIVERSAL, forge.asn1.Type.SEQUENCE, true, [
        forge.asn1.create(forge.asn1.Class.UNIVERSAL, forge.asn1.Type.OID, false, idEcPublicKey),
        forge.asn1.create(forge.asn1.Class.UNIVERSAL, forge.asn1.Type.OID, false, prime256v1),
      ]);
      const pkcs8Asn1 = forge.asn1.create(forge.asn1.Class.UNIVERSAL, forge.asn1.Type.SEQUENCE, true, [
        forge.asn1.create(forge.asn1.Class.UNIVERSAL, forge.asn1.Type.INTEGER, false, String.fromCharCode(0x00)),
        algorithmIdentifier,
        forge.asn1.create(forge.asn1.Class.UNIVERSAL, forge.asn1.Type.OCTETSTRING, false, forge.asn1.toDer(ecPrivateKey).getBytes())
      ]);
      pkcs8Pem = forge.pki.privateKeyInfoToPem(pkcs8Asn1)
        .replace("-----BEGIN PRIVATE KEY-----", "-----BEGIN EC PRIVATE KEY-----")
        .replace("-----END PRIVATE KEY-----", "-----END EC PRIVATE KEY-----");
    } else {
      throw new Error("Unsupported key format.");
    }
    return pkcs8Pem;
  } catch (err) {
    console.error("PKCS#8 conversion error:", err);
    return null;
  }
}

async function processFile() {
  const fileInput = document.getElementById('fileInput');
  const status = document.getElementById('status');

  if (!fileInput.files.length) {
    status.textContent = "Please select a keybox.xml file.";
    status.style.opacity = 1;
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const parser = new DOMParser();
    const serializer = new XMLSerializer();
    const xmlText = e.target.result;
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");

    const keys = xmlDoc.getElementsByTagName("Key");

    for (let key of keys) {
      const algorithm = key.getAttribute("algorithm");
      const privateKeyElem = key.getElementsByTagName("PrivateKey")[0];
      if (privateKeyElem && privateKeyElem.textContent) {
        const pemText = privateKeyElem.textContent.trim();
        if (
          pemText.includes("RSA PRIVATE KEY") ||
          pemText.includes("EC PRIVATE KEY")
        ) {
          const pkcs8Pem = convertToPkcs8Pem(pemText);
          if (pkcs8Pem) {
            console.log(`Converted ${algorithm} key to PKCS#8`);
            privateKeyElem.setAttribute("format", "pem");
            privateKeyElem.textContent = pkcs8Pem;
          } else {
            console.warn(`Could not convert ${algorithm} key`);
          }
        }
      }
    }

    const updatedXml = serializer.serializeToString(xmlDoc);
    const blob = new Blob([updatedXml], { type: "application/xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "keybox_pkcs8_priv.xml";
    a.click();

    status.textContent = "Keybox Updated. Download triggered.";
    status.style.opacity = 1;
  };

  reader.readAsText(file);
}
