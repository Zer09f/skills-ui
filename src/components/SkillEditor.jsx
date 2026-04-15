import React from 'react';
import { motion } from 'framer-motion';
import { Type, AlignLeft, Code2, Hash, User, ShieldCheck } from 'lucide-react';

const SkillEditor = ({ metadata, readme, onMetadataChange, onReadmeChange, t }) => {
  const handleMetaChange = (key, value) => {
    // Ensure we merge with existing metadata to preserve fields not in the editor
    onMetadataChange({ ...metadata, [key]: value });
  };


  const fields = [
    { id: 'name', label: t('skillName'), icon: <Type />, placeholder: t('placeholderName') },
    { id: 'description', label: t('shortDesc'), icon: <AlignLeft />, placeholder: t('placeholderDesc') },
    { id: 'version', label: t('version'), icon: <Hash />, placeholder: '1.0.0' },
    { id: 'author', label: t('author'), icon: <User />, placeholder: 'Your Name' },
    { id: 'license', label: t('license'), icon: <ShieldCheck />, placeholder: 'MIT' },
  ];

  return (
    <div className="space-y-12">
      {/* Metadata Form */}
      <div className="glass-panel p-10 md:p-14 rounded-[3rem] border border-white/5 space-y-10">
        <h3 className="text-2xl font-black flex items-center gap-3">
          <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
          {t('metadataConfig')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

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
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-12 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-zinc-800 font-medium"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Readme Editor */}
      <div className="glass-panel p-10 md:p-14 rounded-[3rem] border border-white/5 space-y-10">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black flex items-center gap-3">
            <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
            {t('readmeContent')}
          </h3>
          <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center gap-2">
            <Code2 className="w-3 h-3 text-purple-400" />
            <span className="text-[10px] text-purple-400 font-black uppercase tracking-widest">{t('markdownEditor')}</span>
          </div>
        </div>

        
        <div className="relative group">
          <textarea
            value={readme}
            onChange={(e) => onReadmeChange(e.target.value)}
            className="w-full h-[600px] bg-white/[0.02] border border-white/5 rounded-3xl p-8 text-sm font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all custom-scrollbar resize-none selection:bg-purple-500/30"
            placeholder={t('placeholderReadme')}
          />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-b-3xl" />
        </div>
      </div>
    </div>
  );
};


export default SkillEditor;
