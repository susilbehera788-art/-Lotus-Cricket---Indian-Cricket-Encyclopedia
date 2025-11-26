import React, { useState, useEffect } from 'react';
import { getGeminiContent, parseMarkdown } from '../services/geminiService';
import { LoadingState } from '../types';
import { Loader2, RefreshCw } from 'lucide-react';

interface AIContentCardProps {
  prompt: string;
  title: string;
  useSearch?: boolean;
  className?: string;
}

const AIContentCard: React.FC<AIContentCardProps> = ({ prompt, title, useSearch = false, className = '' }) => {
  const [content, setContent] = useState<string>('');
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);

  const fetchData = async () => {
    setStatus(LoadingState.LOADING);
    const result = await getGeminiContent(prompt, useSearch);
    setContent(result);
    setStatus(LoadingState.SUCCESS);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt]);

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border border-gray-100 ${className}`}>
      <div className="flex justify-between items-center mb-4 border-b pb-2 border-gray-100">
        <h3 className="text-xl font-bold text-india-blue flex items-center gap-2">
           {title}
           {useSearch && <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">Live Data</span>}
        </h3>
        <button 
          onClick={fetchData} 
          className="text-gray-400 hover:text-india-blue transition-colors"
          title="Refresh Content"
        >
          <RefreshCw size={18} className={status === LoadingState.LOADING ? "animate-spin" : ""} />
        </button>
      </div>

      {status === LoadingState.LOADING ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
          <Loader2 size={32} className="animate-spin mb-2" />
          <p className="text-sm">Fetching insights from Lotus AI...</p>
        </div>
      ) : (
        <div className="prose max-w-none text-gray-700 space-y-3">
          {parseMarkdown(content).map((line, idx) => {
            if (line.startsWith('##')) return <h4 key={idx} className="text-lg font-bold text-gray-900 mt-4">{line.replace(/#/g, '')}</h4>;
            if (line.startsWith('*') || line.startsWith('-')) return <li key={idx} className="ml-4">{line.replace(/[*|-]/g, '').trim()}</li>;
            return <p key={idx} className="leading-relaxed whitespace-pre-wrap">{line}</p>;
          })}
        </div>
      )}
    </div>
  );
};

export default AIContentCard;