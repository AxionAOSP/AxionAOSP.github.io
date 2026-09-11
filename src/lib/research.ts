const REPO = 'AxionAOSP/Axion_research_docs';
const BRANCH = 'main';

export interface ResearchDocMetadata {
  slug: string;
  title: string;
  tagline: string;
  readTime: string;
  fileName: string;
}

export interface ResearchDoc extends ResearchDocMetadata {
  content: string;
}

function getHeaders(): Record<string, string> {
  return {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'AxionAOSP-Website-Build',
  };
}

function parseMarkdownMetadata(fileName: string, content: string): ResearchDocMetadata {
  const slug = fileName.replace(/\.md$/, '');
  
  const lines = content.split('\n');
  let title = '';
  let tagline = '';
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('# ')) {
      title = trimmed.slice(2);
      break;
    }
  }
  
  if (!title) {
    title = slug
      .replace(/_/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2');
  }

  let insideCodeBlock = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('```')) {
      insideCodeBlock = !insideCodeBlock;
      continue;
    }
    if (insideCodeBlock) continue;
    
    if (
      trimmed &&
      !trimmed.startsWith('#') &&
      !trimmed.startsWith('-') &&
      !trimmed.startsWith('*') &&
      !trimmed.startsWith('>') &&
      !trimmed.startsWith('[') &&
      !trimmed.startsWith('!')
    ) {
      tagline = trimmed
        .replace(/[*_`]/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
      if (tagline.length > 150) {
        tagline = tagline.substring(0, 147) + '...';
      }
      break;
    }
  }

  if (!tagline) {
    tagline = `Technical research and engineering documentation regarding ${title}.`;
  }

  const wordCount = content.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  const readTime = `${minutes} min read`;

  return {
    slug,
    title,
    tagline,
    readTime,
    fileName,
  };
}

export async function getResearchDocs(): Promise<ResearchDocMetadata[]> {
  try {
    const response = await fetch(`https://api.github.com/repos/${REPO}/contents`, {
      headers: getHeaders(),
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch repo contents: ${response.statusText}`);
    }

    const items = await response.json();
    if (!Array.isArray(items)) return [];

    const mdFiles = items.filter(
      (item: any) =>
        item.type === 'file' &&
        item.name.endsWith('.md') &&
        item.name.toLowerCase() !== 'readme.md'
    );

    const docs: ResearchDocMetadata[] = [];

    for (const file of mdFiles) {
      const rawResponse = await fetch(`https://raw.githubusercontent.com/${REPO}/${BRANCH}/${file.name}`, {
        next: { revalidate: 3600 }
      });
      if (rawResponse.ok) {
        const content = await rawResponse.text();
        docs.push(parseMarkdownMetadata(file.name, content));
      }
    }

    return docs;
  } catch (error) {
    console.error('Error fetching research docs list:', error);
    return [];
  }
}

export async function getResearchDocBySlug(slug: string): Promise<ResearchDoc | null> {
  try {
    const fileName = `${slug}.md`;
    const response = await fetch(`https://raw.githubusercontent.com/${REPO}/${BRANCH}/${fileName}`, {
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      return null;
    }

    const content = await response.text();
    const metadata = parseMarkdownMetadata(fileName, content);

    return {
      ...metadata,
      content,
    };
  } catch (error) {
    console.error(`Error fetching research doc for slug ${slug}:`, error);
    return null;
  }
}
