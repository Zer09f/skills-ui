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
  // Relaxed regex to handle leading whitespace/BOM and trailing content
  const match = content.match(/^\s*---([\s\S]*?)---\s*([\s\S]*)$/);
  if (match) {
    try {
      const metadata = yaml.load(match[1]);
      return { metadata: metadata || {}, content: match[2].trim() };
    } catch (e) {
      console.error('Failed to parse YAML frontmatter', e);
    }
  }
  return { metadata: { name: 'Unknown' }, content };
}


/**
 * Generates SKILL.md content from metadata and readme.
 */
export function generateSkillMd(metadata, readme) {
  try {
    const yamlString = yaml.dump(metadata, { indent: 2, lineWidth: -1 });
    return `---\n${yamlString}---\n\n${readme}`;
  } catch (e) {
    console.error('Failed to generate SKILL.md', e);
    return readme;
  }
}

/**
 * Analyzes health of a skill.
 */
export function analyzeSkillHealth(skill, t) {
  const issues = [];
  let score = 100;

  const metadata = skill.metadata || {};
  const readme = skill.readme || '';

  if (!metadata.name || metadata.name === 'Unknown') {
    issues.push({ level: 'error', message: t('issueName') });
    score -= 30;
  }
  if (!metadata.description) {
    issues.push({ level: 'warning', message: t('issueDesc') });
    score -= 20;
  }
  if (readme.length < 100) {
    issues.push({ level: 'info', message: t('issueReadme') });
    score -= 10;
  }
  if (!metadata.version) {
    issues.push({ level: 'info', message: t('issueVersion') });
    score -= 5;
  }

  return {
    score: Math.max(0, score),
    issues,
    status: score > 80 ? 'healthy' : score > 50 ? 'warning' : 'critical'
  };
}


/**
 * Infers category and icon based on skill content.
 */
export function getSkillVisuals(skill) {
  const text = (skill.name + ' ' + (skill.metadata?.description || '')).toLowerCase();
  
  if (text.includes('translate') || text.includes('language') || text.includes('多语言')) {
    return { category: 'Translation', icon: 'Languages', color: 'from-blue-500 to-cyan-400' };
  }
  if (text.includes('code') || text.includes('dev') || text.includes('program') || text.includes('代码')) {
    return { category: 'Development', icon: 'Terminal', color: 'from-emerald-500 to-teal-400' };
  }
  if (text.includes('image') || text.includes('vision') || text.includes('draw') || text.includes('图片')) {
    return { category: 'Visual Art', icon: 'Image', color: 'from-purple-500 to-pink-400' };
  }
  if (text.includes('search') || text.includes('web') || text.includes('find') || text.includes('搜索')) {
    return { category: 'Intelligence', icon: 'Globe', color: 'from-orange-500 to-amber-400' };
  }
  if (text.includes('write') || text.includes('copy') || text.includes('creative') || text.includes('写作')) {
    return { category: 'Content', icon: 'PenTool', color: 'from-rose-500 to-orange-400' };
  }
  
  return { category: 'General Agent', icon: 'Zap', color: 'from-purple-500 to-indigo-400' };
}

/**
 * Extracts top keywords for badges.
 */
export function extractKeywords(skill) {
  const desc = skill.metadata?.description || '';
  const name = skill.name;
  const combined = (name + ' ' + desc).toLowerCase();
  
  const commonKeywords = [
    'expert', 'pro', 'logic', 'api', 'automation', 'creative', 'analysis', 
    'fast', 'secure', 'minimal', 'stable', 'v3', 'engine', 'core',
    '专家', '自动化', '逻辑', '分析', '创作', '核心', '引擎'
  ];
  
  const found = commonKeywords.filter(k => combined.includes(k.toLowerCase()));
  return Array.from(new Set([...found])).slice(0, 3);
}

/**
 * Exports a single skill folder as a new ZIP file.
... (existing rest of file)
 * Now supports optional updated metadata/readme from editor.
 */
export async function exportSkill(skill, updatedData = null) {
  const newZip = new JSZip();
  
  const metadata = updatedData?.metadata || skill.metadata;
  const readme = updatedData?.readme || skill.readme;
  const skillMdContent = generateSkillMd(metadata, readme);

  for (const [relativePath, zipEntry] of Object.entries(skill.files)) {
    // Determine if this is the core SKILL.md (either at root or the only child of a nested root)
    const isRootSkillMd = relativePath === 'SKILL.md';
    
    if (isRootSkillMd) {
      newZip.file(relativePath, skillMdContent);
    } else {
      const content = await zipEntry.async('blob');
      newZip.file(relativePath, content);
    }
  }


  const blob = await newZip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${metadata.name || skill.name}.zip`;
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
