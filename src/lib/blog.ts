import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getAssetUrl } from './utils';

const postsDirectory = path.join(process.cwd(), 'src/content/blog');

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  author: {
    name: string;
    username: string;
    icon: string;
  };
  date: string;
  readTime: string;
  summary: string;
  banner: string;
  content: string;
};

export function getPostSlugs() {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs.readdirSync(postsDirectory).filter(file => file.endsWith('.md'));
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const realSlug = slug.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, `${realSlug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug: realSlug,
      id: data.id || realSlug,
      title: data.title || '',
      tagline: data.tagline || '',
      author: {
        name: data.author?.name || 'Unknown',
        username: data.author?.username || 'unknown',
        icon: data.author?.icon ? getAssetUrl(data.author.icon) : '',
      },
      date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
      readTime: data.readTime || '',
      summary: data.summary || '',
      banner: data.banner ? getAssetUrl(data.banner) : '',
      content: content.replaceAll('/blog/res/img', getAssetUrl('/blog/res/img')),
    };
  } catch (error) {
    return null;
  }
}

export function getAllPosts(): BlogPost[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is BlogPost => post !== null)
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}
