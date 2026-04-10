import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileArchive, AlertCircle, Loader2 } from 'lucide-react';

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
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 relative z-10"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
          Skill <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Visualizer</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
          上传您的技能包压缩文件，即刻开启可视化体验与管理
        </p>
      </motion.div>

      <motion.div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="glass-card w-full max-w-2xl p-12 rounded-3xl flex flex-col items-center justify-center border-2 border-dashed border-slate-700 hover:border-indigo-500/50 transition-all cursor-pointer group relative z-10"
      >
        <input
          type="file"
          accept=".zip"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
          disabled={isLoading}
        />
        
        <div className="w-20 h-20 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-all">
          {isLoading ? (
            <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
          ) : (
            <Upload className="w-10 h-10 text-indigo-400 group-hover:scale-110 transition-transform" />
          )}
        </div>

        <h3 className="text-2xl font-semibold mb-2">
          {isLoading ? '正在解析文件...' : '点此上传或拖拽文件'}
        </h3>
        <p className="text-slate-500">支持 .zip 格式的技能包文件</p>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </motion.div>

      <div className="mt-12 flex gap-8 relative z-10">
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <FileArchive className="w-4 h-4" />
          <span>本地解析，无服务器上传</span>
        </div>
      </div>

      <style jsx>{`
        .glass-card {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  );
};

export default UploadZone;
