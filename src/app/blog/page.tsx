import { ArrowRight, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export default function BlogPage() {
  const posts = getAllPosts();
  
  // For simplicity, the first post is featured, the rest are regular
  const featuredPost = posts.length > 0 ? posts[0] : null;
  const regularPosts = posts.length > 1 ? posts.slice(1) : [];

  return (
    <main className="min-h-screen bg-[var(--color-axion-bg)] pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
            The Axion Blog.
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Development updates, deep dives into our engineering research, and community news.
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <Link href={`/blog/${featuredPost.slug}`} className="block group mb-20">
            <article className="relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300">
              <div className="flex flex-col lg:flex-row">
                <div className="relative w-full lg:w-3/5 aspect-video lg:aspect-auto min-h-[300px]">
                  <Image
                    src={featuredPost.banner}
                    alt={featuredPost.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:bg-gradient-to-r" />
                </div>
                
                <div className="p-8 lg:p-12 flex flex-col justify-center lg:w-2/5">
                  <div className="flex items-center gap-4 text-sm text-[var(--color-axion-accent-secondary)] mb-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {new Date(featuredPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1.5 text-white/40">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime}
                    </span>
                  </div>
                  
                  <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 group-hover:text-[var(--color-axion-accent-secondary)] transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-lg text-white/60 mb-8 line-clamp-3">
                    {featuredPost.summary}
                  </p>
                  
                  <div className="flex items-center gap-2 text-white font-medium mt-auto group-hover:text-[var(--color-axion-accent-secondary)] transition-colors">
                    Read Full Story <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </article>
          </Link>
        )}

        {/* Regular Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <article className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 h-full flex flex-col">
                <div className="relative w-full aspect-video">
                  <Image
                    src={post.banner}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                </div>
                
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-sm text-[var(--color-axion-accent-secondary)] mb-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[var(--color-axion-accent-secondary)] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-white/60 mb-6 line-clamp-3">
                    {post.summary}
                  </p>
                  
                  <div className="flex items-center gap-2 text-white/80 font-medium text-sm mt-auto group-hover:text-[var(--color-axion-accent-secondary)] transition-colors">
                    Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}
