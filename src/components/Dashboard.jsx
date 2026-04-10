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
  ExternalLink,
  ChevronLeft,
  Menu,
  Sparkles
} from 'lucide-react';
import { exportSkill, renderMarkdown } from '../lib/utils';

const Dashboard = ({ skills, onReset }) => {
  const [selectedSkillId, setSelectedSkillId] = useState(skills[0]?.name);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const selectedSkill = skills.find(s => s.name === selectedSkillId);
  const filteredSkills = skills.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.metadata?.name && s.metadata.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarCollapsed ? 80 : 320 }}
        className="relative border-r border-white/5 bg-[#050505] flex flex-col z-20 shadow-2xl"
      >
        <div className={`p-6 border-b border-white/5 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isSidebarCollapsed && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="flex items-center gap-3"
            >
              <div className="p-2.5 bg-purple-500/10 rounded-xl purple-glow-border">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-gradient-purple">Skill Hub</h2>
            </motion.div>
          )}
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-500 hover:text-white"
          >
            {isSidebarCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {!isSidebarCollapsed && (
          <div className="p-6">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-purple-400 transition-colors" />
              <input
                type="text"
                placeholder="搜索技能..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-zinc-600"
              />
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
          {filteredSkills.map(skill => (
            <button
              key={skill.name}
              onClick={() => setSelectedSkillId(skill.name)}
              className={`w-full group flex items-center gap-3 p-3 rounded-xl transition-all relative ${
                selectedSkillId === skill.name 
                  ? 'bg-purple-500/10 text-white' 
                  : 'hover:bg-white/5 text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <div className={`p-2 rounded-lg flex-shrink-0 transition-all ${
                selectedSkillId === skill.name ? 'bg-purple-500/20 text-purple-400 scale-110' : 'bg-zinc-900 text-zinc-600'
              }`}>
                <Layers className="w-4 h-4" />
              </div>
              
              {!isSidebarCollapsed && (
                <div className="text-left overflow-hidden flex-1">
                  <div className="font-semibold text-sm truncate">{skill.metadata?.name || skill.name}</div>
                  <div className="text-[10px] text-zinc-600 truncate uppercase tracking-widest mt-0.5">{skill.name}</div>
                </div>
              )}

              {selectedSkillId === skill.name && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-purple-500 rounded-full"
                />
              )}
            </button>
          ))}
        </nav>

        <div className={`p-4 border-t border-white/5 ${isSidebarCollapsed ? 'flex justify-center' : ''}`}>
          <button 
            onClick={onReset}
            className={`flex items-center gap-2 text-zinc-500 hover:text-white transition-all text-xs font-medium ${isSidebarCollapsed ? 'p-2' : 'w-full py-2 hover:translate-x-1'}`}
          >
            <ArrowLeft className="w-4 h-4" />
            {!isSidebarCollapsed && "重新上传"}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-[#020202]">
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse-glow" />
        
        <AnimatePresence mode="wait">
          {selectedSkill ? (
            <motion.div
              key={selectedSkill.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="p-10 md:p-20 max-w-6xl mx-auto"
            >
              <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-16">
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-purple-500/10 text-purple-400 text-[10px] font-bold rounded-full border border-purple-500/20 tracking-[0.2em] uppercase">
                      Core Agent Skill
                    </span>
                    {selectedSkill.metadata?.license && (
                      <span className="text-zinc-600 text-xs font-medium">/ License: {selectedSkill.metadata.license}</span>
                    )}
                  </div>
                  <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                    {selectedSkill.metadata?.name || selectedSkill.name}
                  </h1>
                  <p className="text-zinc-400 text-xl leading-relaxed max-w-3xl font-light">
                    {selectedSkill.metadata?.description}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <button 
                    onClick={() => exportSkill(selectedSkill)}
                    className="group relative flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                  >
                    <Download className="w-5 h-5 group-hover:animate-bounce" />
                    下载技能包
                  </button>
                </div>
              </header>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                <div className="xl:col-span-8 space-y-10">
                  <div className="glass-card p-10 md:p-14 rounded-[2.5rem] overflow-hidden">
                    <div className="flex items-center gap-3 mb-10 pb-6 border-b border-white/5">
                       <FileCode2 className="w-6 h-6 text-purple-400" />
                       <h3 className="text-xl font-bold tracking-tight">说明文档 (SKILL.md)</h3>
                    </div>
                    <div 
                      className="markdown-content prose prose-invert max-w-none prose-purple"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedSkill.readme) }}
                    />
                  </div>
                </div>

                <div className="xl:col-span-4 space-y-8">
                  <div className="glass-card p-8 rounded-[2.5rem]">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                       <Package className="w-5 h-5 text-purple-400" />
                       资源列表
                    </h3>
                    <div className="space-y-2">
                      {Object.keys(selectedSkill.files).map(path => (
                        <div key={path} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 text-sm transition-all group border border-transparent hover:border-white/5">
                           <div className="flex items-center gap-3 text-zinc-400 overflow-hidden">
                             <FileCode2 className="w-4 h-4 flex-shrink-0 group-hover:text-purple-400" />
                             <span className="truncate group-hover:text-zinc-200">{path}</span>
                           </div>
                           <ExternalLink className="w-3.5 h-3.5 text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 shadow-inner">
                    <h4 className="text-[10px] font-black text-purple-400 mb-6 uppercase tracking-[0.3em]">元数据详情</h4>
                    <div className="space-y-5">
                      {Object.entries(selectedSkill.metadata || {}).map(([key, value]) => {
                        if (['name', 'description'].includes(key)) return null;
                        return (
                          <div key={key} className="space-y-1">
                            <div className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">{key.replace(/-/g, ' ')}</div>
                            <div className="text-sm font-semibold text-zinc-300 break-words">{String(value)}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-zinc-800">
               <Package className="w-24 h-24 mb-6 opacity-10 animate-pulse" />
               <p className="text-lg font-medium tracking-tight">探索技能核心，请从侧边栏选择</p>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;
