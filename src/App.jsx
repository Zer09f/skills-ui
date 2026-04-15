import React, { useState, useEffect } from 'react';
import { processZip } from './lib/utils';
import UploadZone from './components/UploadZone';
import Dashboard from './components/Dashboard';

function App() {
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (file) => {
    setIsLoading(true);
    setError(null);
    try {
      const parsedSkills = await processZip(file);
      if (parsedSkills.length === 0) {
        throw new Error('未在 ZIP 文件中找到有效的技能包（缺少 SKILL.md）。');
      }
      
      setSkills(prevSkills => {
        // Create a map of existing skills by name for easy replacement
        const skillsMap = new Map(prevSkills.map(s => [s.name, s]));
        
        // Add or overwrite with new skills
        parsedSkills.forEach(skill => {
          skillsMap.set(skill.name, skill);
        });
        
        return Array.from(skillsMap.values());
      });
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSkills([]);
    setError(null);
  };

  return (
    <div className="app-container min-h-screen">
      {skills.length === 0 ? (
        <UploadZone onUpload={handleFileUpload} isLoading={isLoading} error={error} />
      ) : (
        <Dashboard skills={skills} onReset={handleReset} onUpload={handleFileUpload} />
      )}
    </div>
  );
}

export default App;
