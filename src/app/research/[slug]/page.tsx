import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { getResearchDocBySlug, getResearchDocs } from "@/lib/research";

export const revalidate = 3600;

export async function generateStaticParams() {
  const docs = await getResearchDocs();
  return docs.map((doc) => ({
    slug: doc.slug,
  }));
}

const GithubIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default async function ResearchDocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = await getResearchDocBySlug(slug);

  if (!doc) {
    notFound();
  }

  const contentWithoutMainHeader = doc.content.replace(/^#\s+.+$/m, '').trim();

  return (
    <main className="min-h-screen bg-[var(--color-axion-bg)] pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[var(--color-axion-accent-secondary)]/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        
        <div className="mb-12">
          <Link 
            href="/research" 
            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Research
          </Link>
        </div>
        
        <header className="mb-16 border-b border-white/10 pb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
            {doc.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-white/50">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[var(--color-axion-accent-secondary)]" />
              <span>{doc.readTime}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <GithubIcon className="w-4 h-4 text-[var(--color-axion-accent-secondary)]" />
              <span>AxionAOSP/Axion_research_docs</span>
            </div>
          </div>
        </header>

        <article className="prose prose-invert prose-lg max-w-none 
          prose-headings:text-white 
          prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-white/5 prose-h2:pb-2
          prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-4
          prose-p:text-white/70 prose-p:leading-relaxed prose-p:mb-6
          prose-strong:text-white prose-strong:font-semibold
          prose-a:text-[var(--color-axion-accent-secondary)] hover:prose-a:text-[var(--color-axion-accent)] prose-a:transition-colors
          prose-code:text-[var(--color-axion-accent-secondary)] prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-2xl prose-pre:p-6 prose-pre:my-8
          prose-pre:code:bg-transparent prose-pre:code:p-0 prose-pre:code:rounded-none prose-pre:code:text-white/90 prose-pre:code:text-sm
          prose-img:rounded-2xl prose-img:border prose-img:border-white/10 prose-img:my-8
          prose-table:w-full prose-table:my-8 prose-table:border-collapse
          prose-th:text-white prose-th:font-semibold prose-th:border-b prose-th:border-white/20 prose-th:p-4 prose-th:text-left
          prose-td:text-white/70 prose-td:border-b prose-td:border-white/10 prose-td:p-4
          prose-hr:border-white/10 prose-hr:my-12
          prose-blockquote:border-l-4 prose-blockquote:border-[var(--color-axion-accent-secondary)] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-white/60"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {contentWithoutMainHeader}
          </ReactMarkdown>
        </article>

        <footer className="mt-20 border-t border-white/10 pt-10 text-center">
          <p className="text-white/40 text-sm mb-4">
            Our research documentation is open-source. If you have any feedback, technical insights, or corrections to contribute, we welcome your input on GitHub!
          </p>
          <a 
            href={`https://github.com/AxionAOSP/Axion_research_docs/blob/main/${doc.fileName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-axion-accent-secondary)] hover:underline"
          >
            <GithubIcon className="w-4 h-4" /> View full source code on GitHub
          </a>
        </footer>
      </div>
    </main>
  );
}
