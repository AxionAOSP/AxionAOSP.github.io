import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { getPostBySlug, getPostSlugs } from "@/lib/blog";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({
    slug: slug.replace(/\.md$/, ''),
  }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  let content = post.content;
  if (process.env.NODE_ENV === "production") {
    content = content.replaceAll('="/blog/', '="/axion/blog/');
    content = content.replaceAll('(/blog/', '(/axion/blog/');
  }

  return (
    <main className="min-h-screen bg-[var(--color-axion-bg)] pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[var(--color-axion-accent-secondary)]/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-3xl mx-auto relative z-10">
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
        
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-white/50">
            {post.author?.name && (
              <div className="flex items-center gap-3">
                {post.author.icon && (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white/10">
                    <Image
                      src={post.author.icon}
                      alt={post.author.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <span className="font-medium text-white/80">{post.author.name}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[var(--color-axion-accent-secondary)]" />
              {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            
            {post.readTime && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[var(--color-axion-accent-secondary)]" />
                {post.readTime}
              </div>
            )}
          </div>
        </header>

        {post.banner && (
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-16 border border-white/10 shadow-2xl">
            <Image
              src={post.banner}
              alt={post.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        <article className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-[var(--color-axion-accent-secondary)] hover:prose-a:text-[var(--color-axion-accent)] prose-a:transition-colors prose-img:rounded-2xl prose-img:border prose-img:border-white/10">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {content}
          </ReactMarkdown>
        </article>
      </div>
    </main>
  );
}
