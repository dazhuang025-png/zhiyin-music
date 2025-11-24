import React, { useState } from 'react';
import { Copy, Check, Music2, PenTool, Sparkles, RefreshCw, Split } from 'lucide-react';
import { SongData, SongVariant } from '../types';

interface VariantColumnProps {
  variant: SongVariant;
  isLast?: boolean;
  onRefine: (variant: SongVariant) => void;
}

const VariantColumn: React.FC<VariantColumnProps> = ({ variant, isLast, onRefine }) => {
  const [copiedLyrics, setCopiedLyrics] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const handleCopy = (text: string, type: 'lyrics' | 'prompt') => {
    navigator.clipboard.writeText(text);
    if (type === 'lyrics') {
      setCopiedLyrics(true);
      setTimeout(() => setCopiedLyrics(false), 2000);
    } else {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white ${!isLast ? 'border-b lg:border-b-0 lg:border-r border-gray-100' : ''}`}>
      
      {/* Variant Label */}
      <div className={`px-6 py-3 border-b border-gray-50 flex items-center justify-between ${variant.type === 'A' ? 'bg-violet-50/30' : 'bg-amber-50/30'}`}>
         <span className={`text-xs font-bold px-2 py-1 rounded border ${variant.type === 'A' ? 'text-violet-600 border-violet-200 bg-violet-50' : 'text-amber-600 border-amber-200 bg-amber-50'}`}>
            {variant.label}
         </span>
      </div>

      {/* Lyrics Area */}
      <div className="flex-1 p-6 relative">
         <div className="flex items-center justify-between mb-4">
          <h4 className="flex items-center gap-2 font-bold text-gray-800 text-sm">
            <PenTool size={14} className={variant.type === 'A' ? "text-violet-600" : "text-amber-600"} /> 
            歌词
          </h4>
          <button 
            onClick={() => handleCopy(variant.lyrics, 'lyrics')}
            className="flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 transition-colors"
          >
            {copiedLyrics ? <Check size={12} /> : <Copy size={12} />}
            {copiedLyrics ? '已复制' : '复制'}
          </button>
        </div>
        <p className="whitespace-pre-wrap font-serif text-gray-700 leading-relaxed text-sm h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {variant.lyrics}
        </p>
      </div>

      {/* Prompt Area */}
      <div className="p-6 bg-gray-50/50 border-t border-gray-100">
         <div className="flex items-center justify-between mb-3">
          <h4 className="flex items-center gap-2 font-bold text-gray-800 text-sm">
            <Sparkles size={14} className="text-gray-400" /> 
            Suno Prompt
          </h4>
          <button 
            onClick={() => handleCopy(variant.sunoPrompt, 'prompt')}
            className="flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white border border-gray-200 hover:border-violet-200 text-gray-500 hover:text-violet-600 transition-colors shadow-sm"
          >
            {copiedPrompt ? <Check size={12} /> : <Copy size={12} />}
            {copiedPrompt ? '已复制' : '复制'}
          </button>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 shadow-inner">
           <p className="font-mono text-xs text-emerald-400 break-words leading-relaxed line-clamp-4 hover:line-clamp-none transition-all">
             {variant.sunoPrompt}
           </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/30">
        <button 
           onClick={() => onRefine(variant)}
           className="w-full py-2.5 bg-white border border-gray-200 hover:border-violet-300 text-gray-600 hover:text-violet-700 rounded-lg font-medium text-xs flex items-center justify-center gap-2 transition-all hover:shadow-md group"
        >
           <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
           基于此版本微调 (-1次)
        </button>
      </div>

    </div>
  );
};

interface ResultCardProps {
  song: SongData;
  onRefine: (variant: SongVariant) => void;
}

const SongResultCard: React.FC<ResultCardProps> = ({ song, onRefine }) => {
  
  // Header Section
  const renderHeader = () => (
    <div className="relative h-28 bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 p-6 flex items-center justify-between shrink-0">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Music2 size={100} className="text-white" />
      </div>
      
      <div className="relative z-10 flex items-center gap-5 w-full">
        <img 
          src={song.coverImage} 
          alt={song.title} 
          className="w-16 h-16 rounded-lg shadow-lg border-2 border-white/20 object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-3">
             <h3 className="text-2xl font-bold text-white tracking-wide">{song.title}</h3>
             <span className="text-[10px] bg-white/10 text-white/80 px-2 py-0.5 rounded border border-white/10 flex items-center gap-1">
                <Split size={10} /> 双生模式
             </span>
          </div>
          <div className="flex gap-2 mt-2">
            <span className="px-2 py-0.5 bg-white/20 backdrop-blur-md rounded text-xs text-white/90 font-medium border border-white/10">
              {song.style}
            </span>
            <span className="px-2 py-0.5 bg-white/20 backdrop-blur-md rounded text-xs text-white/90 font-medium border border-white/10">
              {song.mood}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 flex flex-col animate-fadeIn group transition-all hover:shadow-2xl hover:border-violet-100">
      {renderHeader()}
      
      {/* Twin Columns Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100 bg-gray-100 gap-px">
        {song.variants.map((variant, idx) => (
          <VariantColumn 
            key={idx} 
            variant={variant} 
            isLast={idx === song.variants.length - 1} 
            onRefine={onRefine}
          />
        ))}
      </div>
    </div>
  );
};

export default SongResultCard;