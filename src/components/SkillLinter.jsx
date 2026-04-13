import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, ShieldX, Info, AlertTriangle, XCircle } from 'lucide-react';

const SkillLinter = ({ analysis }) => {
  const { score, issues, status } = analysis;

  const getStatusColor = () => {
    if (status === 'healthy') return 'text-emerald-400';
    if (status === 'warning') return 'text-amber-400';
    return 'text-rose-400';
  };

  const getStatusIcon = () => {
    if (status === 'healthy') return <ShieldCheck className="w-6 h-6" />;
    if (status === 'warning') return <ShieldAlert className="w-6 h-6" />;
    return <ShieldX className="w-6 h-6" />;
  };

  const getIssueIcon = (level) => {
    if (level === 'error') return <XCircle className="w-4 h-4 text-rose-500" />;
    if (level === 'warning') return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    return <Info className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-white/5 ${getStatusColor()}`}>
            {getStatusIcon()}
          </div>
          <div>
            <h3 className="text-lg font-black tracking-tight">健康度诊断</h3>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Skill Health Score</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-black ${getStatusColor()}`}>{score}</div>
          <div className="text-[10px] text-zinc-600 font-bold uppercase">Points</div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
        {issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center space-y-3 opacity-40">
            <ShieldCheck className="w-12 h-12 text-emerald-500" />
            <p className="text-sm font-medium">完美无瑕！技能包符合所有规范。</p>
          </div>
        ) : (
          issues.map((issue, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group"
            >
              <div className="mt-0.5 group-hover:scale-110 transition-transform">
                {getIssueIcon(issue.level)}
              </div>
              <p className="text-xs text-zinc-300 font-medium leading-relaxed">
                {issue.message}
              </p>
            </motion.div>
          ))
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-white/5">
        <div className="bg-purple-500/10 rounded-2xl p-4 border border-purple-500/20">
          <p className="text-[10px] text-purple-300 leading-relaxed font-medium">
            提示：高评分代表更清晰的 Agent 指令逻辑和更完善的元数据定义，有助于提高在不同平台部署的兼容性。
          </p>
        </div>
      </div>
    </div>
  );
};

export default SkillLinter;
