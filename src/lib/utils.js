import JSZip from 'jszip';
import yaml from 'js-yaml';
import { marked } from 'marked';

/**
 * Processes a uploaded skills.zip file.
 * Groups files by top-level directory and identifies SKILL.md.
 */
export async function processZip(file) {
  const zip = new JSZip();
  const contents = await zip.loadAsync(file);
  const skillsMap = {}; // key: parentFolder path (normalized)
  const skillRoots = [];

  const allFiles = Object.entries(contents.files)
    .filter(([_, entry]) => !entry.dir)
    .map(([path, entry]) => ({
      path: path.replace(/\\/g, '/'),
      entry
    }));

  // Pass 1: Identify skill roots by searching for SKILL.md
  for (const fileRecord of allFiles) {
    const normalizedPath = fileRecord.path;
    
    if (normalizedPath === 'SKILL.md' || normalizedPath.endsWith('/SKILL.md')) {
      const parentPath = normalizedPath.includes('/') 
        ? normalizedPath.substring(0, normalizedPath.lastIndexOf('/') + 1)
        : '';
        
      skillRoots.push(parentPath);
      
      const pathParts = parentPath.split('/').filter(Boolean);
      const skillName = pathParts.length > 0 ? pathParts[pathParts.length - 1] : '默认技能';
      
      const content = await fileRecord.entry.async('string');
      const parsed = parseSkillMd(content);
      
      skillsMap[parentPath] = {
        name: skillName,
        files: {},
        metadata: parsed.metadata,
        readme: parsed.content,
        rawZip: zip
      };
    }
  }

  // Pass 2: Assign files to the deepest matching skill root
  for (const fileRecord of allFiles) {
    const normalizedPath = fileRecord.path;
    
    let bestRoot = null;
    for (const root of skillRoots) {
      if (normalizedPath.startsWith(root)) {
        if (!bestRoot || root.length > bestRoot.length) {
          bestRoot = root;
        }
      }
    }
    
    if (bestRoot) {
      const relativePathInSkill = normalizedPath.substring(bestRoot.length);
      skillsMap[bestRoot].files[relativePathInSkill] = fileRecord.entry;
    }
  }

  return Object.values(skillsMap);
}

/**
 * Parses SKILL.md content to extract YAML frontmatter and Markdown body.
 */
function parseSkillMd(content) {
  const match = content.match(/^---([\s\S]*?)---([\s\S]*)$/);
  if (match) {
    try {
      const metadata = yaml.load(match[1]);
      return { metadata, content: match[2].trim() };
    } catch (e) {
      console.error('Failed to parse YAML frontmatter', e);
    }
  }
  return { metadata: { name: 'Unknown' }, content };
}

/**
 * Exports a single skill folder as a new ZIP file.
 */
export async function exportSkill(skill) {
  const newZip = new JSZip();
  
  for (const [relativePath, zipEntry] of Object.entries(skill.files)) {
    const content = await zipEntry.async('blob');
    newZip.file(relativePath, content);
  }

  const blob = await newZip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${skill.metadata.name || skill.name}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Renders markdown to HTML.
 */
export function renderMarkdown(content) {
  return marked.parse(content);
}
