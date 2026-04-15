import React, { useState, useRef } from 'react';
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
  Sparkles,
  Edit3,
  Check,
  X,
  Zap,
  Plus
} from 'lucide-react';
import { exportSkill, renderMarkdown, analyzeSkillHealth } from '../lib/utils';
import SkillEditor from './SkillEditor';
import SkillLinter from './SkillLinter';

const BackgroundBlobs = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-radial-gradient">
    <div className="absolute inset-0 bg-mesh-grid opacity-30" />
    <motion.div 
      animate={{ 
        x: [0, 100, -50, 0],
        y: [0, -50, 100, 0],
        opacity: [0.4, 0.8, 0.4]
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-25%] left-[-15%] w-[80%] h-[80%] bg-purple-600/30 rounded-full blur-[160px]"
    />
    <motion.div 
      animate={{ 
        x: [0, -120, 80, 0],
        y: [0, 80, -120, 0],
        opacity: [0.3, 0.7, 0.3]
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-[-25%] right-[-15%] w-[90%] h-[90%] bg-indigo-600/20 rounded-full blur-[200px]"
    />
  </div>
);

const Dashboard = ({ skills, onReset, onUpload }) => {
  const fileInputRef = useRef(null);
  const [selectedSkillId, setSelectedSkillId] = useState(skills[0]?.name);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editMetadata, setEditMetadata] = useState(null);
  const [editReadme, setEditReadme] = useState('');

  const selectedSkill = skills.find(s => s.name === selectedSkillId);
  const filteredSkills = skills.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.metadata?.name && s.metadata.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const startEditing = () => {
    setEditMetadata(selectedSkill.metadata || {});
    setEditReadme(selectedSkill.readme || '');
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const handleSaveLocal = () => {
    // In a real app, we might persist this to a global state or IndexedDB
    // For now, we update the in-memory skill object
    selectedSkill.metadata = editMetadata;
    selectedSkill.readme = editReadme;
    setIsEditing(false);
  };

  const handleSkillSwitch = (id) => {
    if (isEditing) {
      if (!confirm('当前修改尚未保存，确定要切换吗？')) return;
    }
    setSelectedSkillId(id);
    setIsEditing(false);
  };

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.zip')) {
      onUpload(file);
      e.target.value = '';
    }
  };

  // Analyze health based on current state (draft or saved)
  const healthAnalysis = analyzeSkillHealth({
    metadata: isEditing ? editMetadata : selectedSkill?.metadata,
    readme: isEditing ? editReadme : selectedSkill?.readme
  });

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden font-sans selection:bg-purple-500/30">
      <BackgroundBlobs />
      
      {/* Hidden File Input for Adding Skills */}
      <input
        type="file"
        accept=".zip"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />
      
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarCollapsed ? 90 : 340 }}
        className="relative border-r border-white/5 glass-panel flex flex-col z-20 shadow-[20px_0_50px_rgba(0,0,0,0.5)]"
      >
        <div className={`p-8 border-b border-white/5 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isSidebarCollapsed && (
            <motion.div 
               initial={{ opacity: 0, x: -10 }}
               animate={{ opacity: 1, x: 0 }}
               className="flex items-center gap-3"
            >
              <div className="p-2.5 bg-gradient-to-br from-purple-500/20 to-purple-500/5 rounded-xl border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-2xl font-black tracking-tighter text-gradient-neon">Skill Hub</h2>
            </motion.div>
          )}
          <div className="flex items-center gap-3">
            <button 
              onClick={handleAddClick}
              className="p-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg border border-purple-500/20 transition-all hover:scale-110 active:scale-95 group/add"
              title="添加新技能包"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2.5 hover:bg-white/5 border border-transparent hover:border-white/10 rounded-xl transition-all text-zinc-500 hover:text-white group"
            >
              {isSidebarCollapsed ? <Menu className="w-5 h-5 group-hover:scale-110" /> : <ChevronLeft className="w-5 h-5 group-hover:scale-110" />}
            </button>
          </div>
        </div>

        {!isSidebarCollapsed && (
          <div className="p-8 pb-4">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-purple-400 transition-colors" />
              <input
                type="text"
                placeholder="搜索技能..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-zinc-600 font-medium"
              />
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {filteredSkills.map(skill => (
            <button
              key={skill.name}
              onClick={() => handleSkillSwitch(skill.name)}
              className={`w-full group flex items-center gap-4 p-4 rounded-2xl transition-all relative overflow-hidden ${
                selectedSkillId === skill.name 
                  ? 'bg-purple-500/15 text-white shadow-[0_4px_20px_rgba(168,85,247,0.1)]' 
                  : 'hover:bg-white/5 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className={`p-2.5 rounded-xl flex-shrink-0 transition-all duration-500 ${
                selectedSkillId === skill.name ? 'bg-purple-500/20 text-purple-400 scale-110 rotate-3' : 'bg-zinc-900/50 text-zinc-600'
              }`}>
                <Layers className="w-5 h-5" />
              </div>
              
              {!isSidebarCollapsed && (
                <div className="text-left overflow-hidden flex-1">
                  <div className={`font-bold text-[15px] truncate transition-colors ${selectedSkillId === skill.name ? 'text-white' : 'group-hover:text-zinc-200'}`}>
                    {skill.metadata?.name || skill.name}
                  </div>
                  <div className="text-[10px] text-zinc-500 truncate uppercase tracking-[0.15em] mt-1 font-semibold opacity-70 italic">{skill.name}</div>
                </div>
              )}

              {selectedSkillId === skill.name && (
                <motion.div 
                  layoutId="active-neon-bar"
                  className="active-neon-bar"
                />
              )}
            </button>
          ))}
        </nav>

        <div className={`p-6 border-t border-white/5 ${isSidebarCollapsed ? 'flex justify-center' : ''}`}>
          <button 
            onClick={onReset}
            className={`flex items-center gap-3 text-zinc-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest ${isSidebarCollapsed ? 'p-3 hover:scale-110' : 'w-full py-4 px-2 hover:bg-white/5 rounded-2xl'}`}
          >
            <ArrowLeft className="w-4 h-4 text-purple-500" />
            {!isSidebarCollapsed && "重新上传技能包"}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-transparent custom-scrollbar">
        <AnimatePresence mode="wait">
          {selectedSkill ? (
            <motion.div
              key={selectedSkill.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="p-10 md:p-24 max-w-7xl mx-auto"
            >
              <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20">
                <div className="flex-1 space-y-12">
                  <div className="flex items-center gap-4">
                    <span className="px-4 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-black rounded-full border border-white/20 shadow-[0_0_20px_rgba(168,85,247,0.3)] tracking-[0.3em] uppercase">
                      CORE AGENT SKILL
                    </span>
                    {selectedSkill.metadata?.license && (
                      <span className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest bg-white/5 px-3 py-1 rounded-md">
                        {selectedSkill.metadata.license}
                      </span>
                    )}
                  </div>
                  <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white">
                    {(isEditing ? editMetadata?.name : selectedSkill.metadata?.name) || selectedSkill.name}
                  </h1>
                  <p className="text-zinc-400 text-xl md:text-2xl leading-relaxed max-w-4xl font-light">
                    {(isEditing ? editMetadata?.description : selectedSkill.metadata?.description) || "Explore this specialized agent skill and its technical documentation."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  {!isEditing ? (
                    <>
                      <button 
                        onClick={startEditing}
                        className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-6 py-4 rounded-2xl font-bold transition-all"
                      >
                        <Edit3 className="w-5 h-5 text-purple-400" />
                        <span>编辑内容</span>
                      </button>
                      <button 
                        onClick={() => exportSkill(selectedSkill)}
                        className="group relative flex items-center gap-4 bg-white text-black px-10 py-5 rounded-2xl font-black transition-all hover:scale-[1.03] shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] overflow-hidden"
                      >
                        <Download className="w-6 h-6 group-hover:animate-bounce" />
                        <span className="uppercase tracking-widest text-sm">Download</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={cancelEditing}
                        className="flex items-center gap-3 bg-white/5 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-white/10 px-6 py-4 rounded-2xl font-bold transition-all"
                      >
                        <X className="w-5 h-5" />
                        <span>丢弃修改</span>
                      </button>
                      <button 
                        onClick={handleSaveLocal}
                        className="flex items-center gap-3 bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-[0_10px_30px_rgba(168,85,247,0.3)]"
                      >
                        <Check className="w-5 h-5" />
                        <span>保存更新</span>
                      </button>
                    </>
                  )}
                </div>
              </header>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                <div className="xl:col-span-8 space-y-12">
                  {!isEditing ? (
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="glass-panel p-10 md:p-16 rounded-[3rem] border border-white/5 glass-card-hover"
                    >
                      <div className="flex items-center gap-4 mb-12 pb-8 border-b border-white/5">
                        <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/20">
                          <FileCode2 className="w-8 h-8" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black tracking-tight">说明文档</h3>
                          <p className="text-zinc-500 text-sm font-semibold uppercase tracking-widest">SKILL.md Presentation</p>
                        </div>
                      </div>
                      <div 
                        className="markdown-container prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedSkill.readme) }}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <SkillEditor 
                        metadata={editMetadata}
                        readme={editReadme}
                        onMetadataChange={setEditMetadata}
                        onReadmeChange={setEditReadme}
                      />
                    </motion.div>
                  )}
                </div>

                <div className="xl:col-span-4 space-y-10">
                  {/* Linter Panel */}
                  <div className="sticky top-10">
                    <SkillLinter analysis={healthAnalysis} />

                    <div className="mt-10 glass-panel p-10 rounded-[3rem] border border-white/5 glass-card-hover">
                      <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
                        资源组件
                      </h3>
                      <div className="space-y-3">
                        {Object.keys(selectedSkill.files).map(path => (
                          <div key={path} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 text-sm transition-all group border border-transparent hover:border-white/5 cursor-pointer">
                            <div className="flex items-center gap-4 text-zinc-400 overflow-hidden">
                              <FileCode2 className="w-4 h-4 flex-shrink-0 group-hover:text-purple-400 group-hover:rotate-12 transition-all" />
                              <span className="truncate group-hover:text-zinc-100 font-medium">{path}</span>
                            </div>
                            <ExternalLink className="w-4 h-4 text-zinc-700 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {!isEditing && (
                      <div className="mt-10 p-10 rounded-[3rem] bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 shadow-[-10px_-10px_30px_rgba(168,85,247,0.05)] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[50px] group-hover:bg-purple-500/10 transition-colors" />
                        <h4 className="text-[11px] font-black text-purple-400 mb-8 uppercase tracking-[0.4em]">Metadata Analysis</h4>
                        <div className="space-y-6">
                          {Object.entries(selectedSkill.metadata || {}).map(([key, value]) => {
                            if (['name', 'description'].includes(key)) return null;
                            return (
                              <div key={key} className="space-y-2 border-l-2 border-white/5 pl-4 hover:border-purple-500/30 transition-colors">
                                <div className="text-[10px] text-zinc-500 uppercase font-black tracking-widest opacity-60">{key.replace(/-/g, ' ')}</div>
                                <div className="text-base font-bold text-zinc-300 break-words leading-tight">{String(value)}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-zinc-800">
               <motion.div
                 animate={{ 
                   scale: [1, 1.1, 1],
                   rotate: [0, 5, -5, 0]
                 }}
                 transition={{ duration: 10, repeat: Infinity }}
               >
                 <Package className="w-32 h-32 mb-8 opacity-5" />
               </motion.div>
               <p className="text-2xl font-black uppercase tracking-[0.2em] opacity-10">Select a Skill Package</p>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;
