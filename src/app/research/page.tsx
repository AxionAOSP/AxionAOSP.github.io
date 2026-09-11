import { ArrowRight, BookOpen, Clock, FileText } from "lucide-react";
import Link from "next/link";
import { getResearchDocs } from "@/lib/research";

export const revalidate = 3600;

export default async function ResearchPage() {
  const docs = await getResearchDocs();

  return (
    <main className="min-h-screen bg-[var(--color-axion-bg)] pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[var(--color-axion-accent-secondary)]/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
            Axion Research.
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Technical deep dives, system design documents, and engineering research detailing the architecture and performance of Axion OS.
          </p>
        </div>

        {docs.length === 0 ? (
          <div className="text-center bg-white/5 border border-white/10 rounded-3xl p-16 max-w-2xl mx-auto">
            <BookOpen className="w-12 h-12 text-[var(--color-axion-accent-secondary)] mx-auto mb-4 opacity-60" />
            <h3 className="text-xl font-bold text-white mb-2">No Research Docs Found</h3>
            <p className="text-white/60">
              We couldn't load the research papers right now. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {docs.map((doc) => (
              <Link key={doc.slug} href={`/research/${doc.slug}`} className="group block">
                <article className="h-full bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-sm text-[var(--color-axion-accent-secondary)] mb-6 bg-white/5 w-fit px-4 py-2 rounded-full border border-white/5">
                      <FileText className="w-4 h-4" />
                      <span>Research Paper</span>
                      <span className="text-white/20">•</span>
                      <span className="flex items-center gap-1 text-white/50">
                        <Clock className="w-3.5 h-3.5" />
                        {doc.readTime}
                      </span>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-[var(--color-axion-accent-secondary)] transition-colors line-clamp-2">
                      {doc.title}
                    </h2>
                    
                    <p className="text-white/60 text-base leading-relaxed mb-8 line-clamp-3">
                      {doc.tagline}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-white font-medium group-hover:text-[var(--color-axion-accent-secondary)] transition-colors mt-auto text-sm">
                    Read Document <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-20 text-center">
          <p className="text-sm text-white/40">
            All documents are live-fetched and parsed from our open-source research hub on{" "}
            <a 
              href="https://github.com/AxionAOSP/Axion_research_docs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[var(--color-axion-accent-secondary)] hover:underline"
            >
              GitHub
            </a>.
          </p>
        </div>

      </div>
    </main>
  );
}
