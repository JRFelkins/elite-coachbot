import React, { useEffect, useState } from 'react';
import CoachBot from './components/CoachBot';
import { initializeRAG, addToKnowledgeBase } from './utils/rag';
import coachingTipsData from './data/coachingTips.jsonl?raw';

function App() {
  const [isKnowledgeBaseLoaded, setIsKnowledgeBaseLoaded] = useState(false);

  useEffect(() => {
    const loadKnowledgeBase = async () => {
      try {
        console.log('🚀 Starting knowledge base initialization...');
        console.log('📝 Loading coaching tips data:', coachingTipsData.split('\n').length, 'lines');
        
        await initializeRAG();
        await addToKnowledgeBase(coachingTipsData);
        
        console.log('✅ Knowledge base loaded successfully');
        setIsKnowledgeBaseLoaded(true);
      } catch (error) {
        console.error('❌ Error loading knowledge base:', error);
      }
    };

    loadKnowledgeBase();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex flex-col items-center justify-center p-4 sm:p-6">
      <header className="w-full max-w-2xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-2">ELITE CoachBot</h1>
        <p className="text-blue-200">Your personal high-performance coaching companion</p>
      </header>
      <main className="w-full max-w-2xl">
        <CoachBot isKnowledgeBaseLoaded={isKnowledgeBaseLoaded} />
      </main>
      <footer className="mt-8 text-sm text-blue-200/60">
        © {new Date().getFullYear()} ELITE CoachBot. All rights reserved.
      </footer>
    </div>
  );
}

export default App