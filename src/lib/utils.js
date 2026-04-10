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
  const skillsMap = {};

  for (const [path, zipEntry] of Object.entries(contents.files)) {
    if (zipEntry.dir) continue;

    // Normalize path separators to forward slashes
    const normalizedPath = path.replace(/\\/g, '/');
    const parts = normalizedPath.split('/');
    
    let skillName, relativePath;

    if (parts.length > 1) {
      skillName = parts[0];
      relativePath = parts.slice(1).join('/');
    } else {
      skillName = '默认技能';
      relativePath = normalizedPath;
    }

    if (!skillsMap[skillName]) {
      skillsMap[skillName] = {
        name: skillName,
        files: {},
        metadata: null,
        readme: '',
        rawZip: zip
      };
    }

    skillsMap[skillName].files[relativePath] = zipEntry;

    if (relativePath === 'SKILL.md') {
      const content = await zipEntry.async('string');
      const parsed = parseSkillMd(content);
      skillsMap[skillName].metadata = parsed.metadata;
      skillsMap[skillName].readme = parsed.content;
    }
  }

  return Object.values(skillsMap).filter(s => s.metadata);
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
