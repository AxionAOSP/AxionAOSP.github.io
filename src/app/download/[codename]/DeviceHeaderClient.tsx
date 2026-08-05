"use client";

import { useState } from "react";
import { FileText, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface DeviceHeaderClientProps {
  guideText: string | null;
  supportGroupUrl?: string;
}

export default function DeviceHeaderClient({
  guideText,
  supportGroupUrl,
}: DeviceHeaderClientProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full space-y-6">
      <div className="pt-8 flex flex-wrap gap-4 select-none">
        {guideText && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`px-8 py-4 rounded-2xl flex items-center gap-3 font-medium transition-all duration-300 border cursor-pointer hover:scale-[1.02]
              ${
                isOpen
                  ? "bg-[var(--color-axion-accent)] text-black border-[var(--color-axion-accent)] font-bold shadow-[0_0_25px_rgba(255,100,0,0.25)] hover:bg-[var(--color-axion-accent-hover)]"
                  : "bg-white/10 hover:bg-white/20 border-white/5 text-white"
              }
            `}
          >
            <FileText className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "text-black scale-110" : "text-[var(--color-axion-accent)]"}`} />
            <span>Installation Guide</span>
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}

        {supportGroupUrl && (
          <a
            href={supportGroupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/5 rounded-2xl flex items-center gap-3 text-white font-medium transition-all hover:scale-[1.02] cursor-pointer group"
          >
            <ExternalLink className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
            Support Group
          </a>
        )}
      </div>


      <AnimatePresence initial={false}>
        {isOpen && guideText && (
          <motion.div
            key="guide-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden w-full bg-[#0a0706]/90 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            <div className="p-4 sm:p-6 md:p-8 max-h-[600px] overflow-y-auto scrollbar-thin select-text" data-lenis-prevent>
              <article className="prose prose-invert max-w-none prose-headings:text-white prose-headings:font-bold prose-a:text-[var(--color-axion-accent)] hover:prose-a:text-[var(--color-axion-accent-hover)] hover:prose-a:underline prose-strong:text-white prose-p:text-zinc-200 prose-p:leading-relaxed prose-li:text-zinc-200 prose-li:leading-relaxed prose-code:text-white prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-black/60 prose-pre:border prose-pre:border-white/5 prose-pre:max-w-full prose-pre:overflow-x-auto">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {guideText}
                </ReactMarkdown>
              </article>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
