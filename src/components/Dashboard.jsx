import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ChevronRight, 
  ArrowLeft, 
  Download, 
  Package, 
  Layers, 
  FileCode2,
  ExternalLink
} from 'lucide-react';
import { exportSkill, renderMarkdown } from '../lib/utils';

const Dashboard = ({ skills, onReset }) => {
  const [selectedSkillId, setSelectedSkillId] = useState(skills[0]?.name);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedSkill = skills.find(s => s.name === selectedSkillId);
  const filteredSkills = skills.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.metadata?.name && s.metadata.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 border-r border-slate-800/50 bg-[#0f172a]/50 backdrop-blur-3xl flex flex-col">
        <div className="p-6 border-b border-slate-800/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <Package className="w-6 h-6 text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Skill Hub</h2>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="搜索技能..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredSkills.map(skill => (
            <button
              key={skill.name}
              onClick={() => setSelectedSkillId(skill.name)}
              className={`w-full group flex items-center justify-between p-3 rounded-xl transition-all ${
                selectedSkillId === skill.name 
                  ? 'bg-indigo-500/10 text-white border border-indigo-500/20' 
                  : 'hover:bg-slate-800/50 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${
                  selectedSkillId === skill.name ? 'bg-indigo-500/20' : 'bg-slate-800'
                }`}>
                  <Layers className={`w-4 h-4 ${selectedSkillId === skill.name ? 'text-indigo-400' : 'text-slate-500'}`} />
                </div>
                <div className="text-left overflow-hidden">
                  <div className="font-medium truncate">{skill.metadata?.name || skill.name}</div>
                  <div className="text-xs text-slate-500 truncate">{skill.name}</div>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${
                selectedSkillId === skill.name ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'
              }`} />
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800/50">
          <button 
            onClick={onReset}
            className="flex items-center justify-center gap-2 w-full py-2.5 text-slate-500 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            重新上传文件
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-gradient-to-br from-[#020617] to-[#0f172a]">
        <AnimatePresence mode="wait">
          {selectedSkill ? (
            <motion.div
              key={selectedSkill.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-8 md:p-12 max-w-5xl mx-auto"
            >
              <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-800/50 pb-12">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-bold rounded-full border border-indigo-500/20 tracking-wider">
                      AGENT SKILL
                    </span>
                    {selectedSkill.metadata?.license && (
                      <span className="text-slate-500 text-xs">License: {selectedSkill.metadata.license}</span>
                    )}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">{selectedSkill.metadata?.name || selectedSkill.name}</h1>
                  <p className="text-slate-400 text-lg line-height-relaxed max-w-3xl">
                    {selectedSkill.metadata?.description}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => exportSkill(selectedSkill)}
                    className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 px-6 py-3 rounded-xl font-semibold text-white transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                  >
                    <Download className="w-5 h-5" />
                    下载技能包
                  </button>
                </div>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                  <div className="glass-card p-8 rounded-2xl overflow-hidden">
                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                       <FileCode2 className="w-5 h-5 text-indigo-400" />
                       说明文档 (SKILL.md)
                    </h3>
                    <div 
                      className="markdown-content prose prose-invert max-w-none prose-indigo prose-img:rounded-xl"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedSkill.readme) }}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="glass-card p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold mb-4">资源浏览器</h3>
                    <div className="space-y-1">
                      {Object.keys(selectedSkill.files).map(path => (
                        <div key={path} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/50 text-sm transition-colors group">
                           <div className="flex items-center gap-2 text-slate-400 overflow-hidden">
                             <FileCode2 className="w-4 h-4 flex-shrink-0" />
                             <span className="truncate">{path}</span>
                           </div>
                           <ExternalLink className="w-3 h-3 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                    <h4 className="text-sm font-semibold text-indigo-400 mb-2 uppercase tracking-wider">元数据详情</h4>
                    <div className="space-y-3">
                      {Object.entries(selectedSkill.metadata || {}).map(([key, value]) => {
                        if (['name', 'description'].includes(key)) return null;
                        return (
                          <div key={key}>
                            <div className="text-xs text-slate-500 capitalize">{key.replace(/-/g, ' ')}</div>
                            <div className="text-sm font-medium text-slate-300">{String(value)}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
               <Package className="w-16 h-16 mb-4 opacity-20" />
               <p>请选择一个技能以查看详情</p>
            </div>
          )}
        </AnimatePresence>
      </main>

      <style jsx global>{`
        .markdown-content h1 { font-size: 2rem; margin-bottom: 1.5rem; margin-top: 2rem; color: #fff; border-bottom: 1px solid #1e293b; padding-bottom: 0.5rem; }
        .markdown-content h2 { font-size: 1.5rem; margin-bottom: 1rem; margin-top: 1.5rem; color: #e2e8f0; }
        .markdown-content h3 { font-size: 1.25rem; margin-bottom: 0.75rem; margin-top: 1.25rem; color: #cbd5e1; }
        .markdown-content p { margin-bottom: 1.25rem; line-height: 1.75; color: #94a3b8; }
        .markdown-content ul, .markdown-content ol { margin-bottom: 1.25rem; padding-left: 1.5rem; color: #94a3b8; }
        .markdown-content li { margin-bottom: 0.5rem; }
        .markdown-content code { background: #1e293b; padding: 0.2rem 0.4rem; rounded: 0.3rem; font-size: 0.9em; font-family: 'JetBrains Mono'; }
        .markdown-content pre { background: #0f172a; padding: 1.5rem; rounded: 1rem; overflow-x: auto; margin-bottom: 1.5rem; border: 1px solid #1e293b; }
        .markdown-content pre code { background: transparent; padding: 0; font-size: 0.85em; color: #e2e8f0; }
        .markdown-content blockquote { border-left: 4px solid #6366f1; padding-left: 1.5rem; font-style: italic; color: #cbd5e1; margin-bottom: 1.5rem; }
        .markdown-content hr { border: 0; border-top: 1px solid #1e293b; margin: 2rem 0; }
      `}</style>
    </div>
  );
};

export default Dashboard;
