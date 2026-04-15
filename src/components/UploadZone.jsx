import React from 'react';
import { motion } from 'framer-motion';
import { Upload, FileArchive, AlertCircle, Loader2, Sparkles } from 'lucide-react';

const BackgroundBlobs = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-radial-gradient">
    <div className="absolute inset-0 bg-mesh-grid opacity-30" />
    <motion.div 
      animate={{ 
        x: [0, 80, -100, 0],
        y: [0, 100, -80, 0],
        opacity: [0.1, 0.4, 0.1]
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-30%] left-[-20%] w-[90%] h-[90%] bg-purple-600/15 rounded-full blur-[180px]"
    />
    <motion.div 
      animate={{ 
        x: [0, -100, 120, 0],
        y: [0, -80, 100, 0],
        opacity: [0.1, 0.3, 0.1]
      }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-[-30%] right-[-20%] w-[100%] h-[100%] bg-blue-600/10 rounded-full blur-[200px]"
    />
  </div>
);

const UploadZone = ({ onUpload, isLoading, error, lang, setLang, t }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.zip')) {
      onUpload(file);
      e.target.value = ''; // Reset to allow re-selection
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.zip')) {
      onUpload(file);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-8 bg-black overflow-hidden font-sans selection:bg-purple-500/30">
      <BackgroundBlobs />

      {/* Language Toggle */}
      <div className="absolute top-10 right-10 flex gap-2 z-30">
        <button
          onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-[10px] font-black tracking-widest uppercase text-zinc-400 hover:text-white"
        >
          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
          {lang === 'zh' ? 'English' : '中文'}
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-20 relative z-10"
      >
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[11px] font-black uppercase tracking-[0.4em] mb-12 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
          <Sparkles className="w-3.5 h-3.5" />
          {t('visualizer')} {lang === 'zh' ? '引擎' : 'Engine'}
        </div>
        <h1 className="text-7xl md:text-9xl font-black mb-12 tracking-tighter leading-tight text-white">
          SKILL <span className="text-gradient-neon">{lang === 'zh' ? '可视化' : 'VISUALIZER'}</span>
        </h1>
        <p className="text-zinc-500 text-xl md:text-2xl max-w-3xl mx-auto font-light leading-relaxed tracking-tight">
          {t('description')}
        </p>

      </motion.div>

      <motion.div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        whileHover={{ scale: 1.02, y: -10 }}
        whileTap={{ scale: 0.98 }}
        className="glass-panel w-full max-w-4xl p-20 md:p-32 rounded-[4rem] flex flex-col items-center justify-center border border-white/5 cursor-pointer group relative z-10 overflow-hidden glass-card-hover"
      >
        <input
          type="file"
          accept=".zip"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer z-20"
          disabled={isLoading}
        />
        
        {/* Glow behind icon */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] group-hover:bg-purple-500/20 transition-all duration-1000" />

        <div className="w-28 h-28 bg-gradient-to-br from-white/10 to-transparent rounded-[2.5rem] flex items-center justify-center mb-12 border border-white/10 group-hover:border-purple-500/40 group-hover:bg-purple-500/5 transition-all duration-700 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          {isLoading ? (
            <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
          ) : (
            <Upload className="w-12 h-12 text-white group-hover:text-purple-400 group-hover:scale-125 transition-all duration-700" />
          )}
        </div>

        <h3 className="text-4xl font-black mb-4 tracking-tight text-white transition-colors duration-500 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-400">
          {isLoading ? t('analyzing') : t('uploadTitle')}
        </h3>
        <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-sm">{t('uploadSub')}</p>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 p-6 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center gap-5 text-red-400 text-sm max-w-lg backdrop-blur-2xl"
          >
            <div className="p-3 bg-red-500/20 rounded-xl">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
            </div>
            <span className="font-bold tracking-tight">{error}</span>
          </motion.div>
        )}
      </motion.div>

      <div className="mt-24 flex items-center gap-12 relative z-10 opacity-30 hover:opacity-100 transition-all duration-700 cursor-default">
        <div className="flex items-center gap-4 text-zinc-400 text-xs font-black uppercase tracking-[0.5em]">
          <FileArchive className="w-4 h-4 text-purple-600" />
          <span>{t('securedEdge')}</span>
        </div>
        <div className="w-1.5 h-1.5 bg-purple-500/40 rounded-full" />
        <div className="text-zinc-700 text-[10px] font-black tracking-widest uppercase">{t('systemStable')}</div>
      </div>
    </div>
  );
};


export default UploadZone;
