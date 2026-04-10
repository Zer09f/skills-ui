import React from 'react';
import { motion } from 'framer-motion';
import { Upload, FileArchive, AlertCircle, Loader2, Sparkles } from 'lucide-react';

const UploadZone = ({ onUpload, isLoading, error }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.zip')) {
      onUpload(file);
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
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 bg-black overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[150px] animate-pulse-glow" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: '3s' }} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center mb-16 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
          <Sparkles className="w-3 h-3" />
          Powered by DeepMind
        </div>
        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">
          Skill <span className="text-gradient-purple">Visualizer</span>
        </h1>
        <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
          管理您的智能体技能包，即刻开启专业的可视化体验
        </p>
      </motion.div>

      <motion.div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        whileHover={{ scale: 1.01, translateY: -5 }}
        whileTap={{ scale: 0.99 }}
        className="glass-card w-full max-w-3xl p-16 md:p-24 rounded-[3rem] flex flex-col items-center justify-center border border-white/5 cursor-pointer group relative z-10 overflow-hidden"
      >
        <input
          type="file"
          accept=".zip"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
          disabled={isLoading}
        />
        
        {/* Glow behind icon */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/5 rounded-full blur-[60px] group-hover:bg-purple-500/10 transition-all duration-700" />

        <div className="w-24 h-24 bg-purple-500/5 rounded-[2rem] flex items-center justify-center mb-10 border border-purple-500/10 group-hover:border-purple-500/30 group-hover:bg-purple-500/10 transition-all duration-500 relative">
          {isLoading ? (
            <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
          ) : (
            <Upload className="w-10 h-10 text-purple-400 group-hover:scale-110 transition-transform duration-500" />
          )}
        </div>

        <h3 className="text-3xl font-bold mb-3 tracking-tight group-hover:text-purple-50 transition-colors">
          {isLoading ? '正在解析文件...' : '点此上传或拖拽文件'}
        </h3>
        <p className="text-zinc-600 font-medium">支持专业技能包 .zip 格式</p>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 p-5 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-center gap-4 text-red-400 text-sm max-w-md backdrop-blur-md"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-center">{error}</span>
          </motion.div>
        )}
      </motion.div>

      <div className="mt-16 flex items-center gap-10 relative z-10 opacity-40 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-3 text-zinc-500 text-sm font-semibold tracking-wide uppercase">
          <FileArchive className="w-4 h-4 text-purple-600" />
          <span>本地加密解析</span>
        </div>
        <div className="w-1 h-1 bg-zinc-800 rounded-full" />
        <div className="text-zinc-600 text-xs font-mono">ROOT.V1.PRO-MAX</div>
      </div>

      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(40px);
        }
        .text-gradient-purple {
          background: linear-gradient(to right, #a855f7, #6366f1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .animate-pulse-glow {
          animation: pulse-glow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default UploadZone;
