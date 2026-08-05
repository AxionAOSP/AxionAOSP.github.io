import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog | Axion OS",
  description: "View the latest source changes for Axion OS.",
};

export const revalidate = 3600; // revalidate every hour

export default async function ChangelogPage() {
  let changelogText = "";
  let error = false;

  try {
    const repoRes = await fetch("https://api.github.com/repos/AxionAOSP/axion_changelogs", { next: { revalidate: 3600 } });
    if (!repoRes.ok) throw new Error("Failed to fetch repository details");
    const repoData = await repoRes.json();
    const defaultBranch = repoData.default_branch || "main";

    const rawRes = await fetch(`https://raw.githubusercontent.com/AxionAOSP/axion_changelogs/${defaultBranch}/README.md`, { next: { revalidate: 3600 } });
    if (!rawRes.ok) throw new Error("Failed to fetch raw changelog content");
    changelogText = await rawRes.text();
  } catch (e) {
    console.error("Error fetching changelog:", e);
    error = true;
  }

  return (
    <main className="min-h-screen pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--color-axion-accent)]/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-axion-accent)] font-medium mb-2">Updates</p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
            Source Changelog
          </h1>
          <p className="text-base text-white/60 max-w-2xl mx-auto leading-relaxed">
            Direct from the official source repository. Keep up with the latest features, fixes, and improvements.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.5)] p-8 md:p-12">
          {error ? (
            <div className="py-24 text-center text-red-400 font-medium">
              <p className="text-lg">Failed to fetch the changelog.</p>
              <p className="text-sm text-white/40 mt-2">Please try again later.</p>
            </div>
          ) : (
            <article className="prose prose-invert max-w-none prose-headings:text-white prose-headings:font-bold prose-a:text-[var(--color-axion-accent)] hover:prose-a:text-[var(--color-axion-accent-hover)] hover:prose-a:underline prose-strong:text-white prose-p:text-white/70 prose-p:leading-relaxed prose-li:text-white/70 prose-li:leading-relaxed prose-code:text-[var(--color-axion-accent)] prose-code:bg-[var(--color-axion-accent)]/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-black/60 prose-pre:border prose-pre:border-white/10">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {changelogText}
              </ReactMarkdown>
            </article>
          )}
        </div>
      </div>
    </main>
  );
}
