import React from 'react';
import { motion } from 'framer-motion';
import { Type, AlignLeft, Code2, Hash, User, ShieldCheck } from 'lucide-react';

const SkillEditor = ({ metadata, readme, onMetadataChange, onReadmeChange }) => {
  const handleMetaChange = (key, value) => {
    onMetadataChange({ ...metadata, [key]: value });
  };

  const fields = [
    { id: 'name', label: '技能名称', icon: <Type />, placeholder: '例如: translate-expert' },
    { id: 'description', label: '简短描述', icon: <AlignLeft />, placeholder: '一句话描述技能的核心作用' },
    { id: 'version', label: '版本号', icon: <Hash />, placeholder: '1.0.0' },
    { id: 'author', label: '作者', icon: <User />, placeholder: 'Your Name' },
    { id: 'license', label: '许可证', icon: <ShieldCheck />, placeholder: 'MIT' },
  ];

  return (
    <div className="space-y-8">
      {/* Metadata Form */}
      <div className="glass-panel p-10 rounded-[2.5rem] border border-white/5 space-y-8">
        <h3 className="text-xl font-black flex items-center gap-3">
          <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
          元数据配置
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div key={field.id} className={`${field.id === 'description' ? 'md:col-span-2' : ''} space-y-2`}>
              <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500 ml-1 flex items-center gap-2">
                <span className="text-zinc-700">{field.icon}</span>
                {field.label}
              </label>
              <input
                type="text"
                value={metadata[field.id] || ''}
                onChange={(e) => handleMetaChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-5 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-zinc-800 font-medium"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Readme Editor */}
      <div className="glass-panel p-10 rounded-[2.5rem] border border-white/5 space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black flex items-center gap-3">
            <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
            SKILL.md 正文
          </h3>
          <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center gap-2">
            <Code2 className="w-3 h-3 text-purple-400" />
            <span className="text-[10px] text-purple-400 font-black uppercase tracking-widest">Markdown Editor</span>
          </div>
        </div>
        
        <div className="relative group">
          <textarea
            value={readme}
            onChange={(e) => onReadmeChange(e.target.value)}
            className="w-full h-[600px] bg-white/[0.02] border border-white/5 rounded-3xl p-8 text-sm font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all custom-scrollbar resize-none selection:bg-purple-500/30"
            placeholder="# 编写你的技能说明文档..."
          />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-b-3xl" />
        </div>
      </div>
    </div>
  );
};

export default SkillEditor;
