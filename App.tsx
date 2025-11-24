import React, { useState } from 'react';
import AppHeader from './components/AppHeader';
import SongResultCard from './components/SongResultCard';
import { SongData, User, Inspiration, SongVariant } from './types';
import { generateInstantSong } from './services/geminiService';
import { 
  SCENE_GROUPS, 
  FEATURED_INSPIRATIONS, 
  COST_PER_GENERATION, 
  WECHAT_ID, 
  PRICING_CONFIG, 
  CONTACT_CONFIG 
} from './config';
import { 
  Loader2, 
  Wand2,
  Mic,
  Check,
  X,
  Zap,
  LayoutGrid,
  Infinity,
  BatteryCharging,
  MessageCircle,
  QrCode,
  Smartphone,
  Copy,
  User as UserIcon,
  Sparkles,
  Music,
  Trash2,
  Quote,
  ArrowUpRight
} from 'lucide-react';

const App: React.FC = () => {
  // --- User State (Guest Mode) ---
  const [user, setUser] = useState<User>(() => {
    // Initialize from localStorage or default to 5 chances
    const savedCredits = typeof window !== 'undefined' ? localStorage.getItem('zhiyin_credits') : null;
    const initialCredits = savedCredits ? parseInt(savedCredits, 10) : 5;
    
    // Ensure persistence on first load
    if (!savedCredits && typeof window !== 'undefined') {
      localStorage.setItem('zhiyin_credits', initialCredits.toString());
    }

    return {
      id: 'guest',
      name: '音乐人', 
      isLoggedIn: true,
      credits: initialCredits,
      tier: 'FREE'
    };
  });

  const [showPricing, setShowPricing] = useState(false);
  
  // --- Payment State ---
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{name: string, price: string} | null>(null);

  // --- Contact Modal State ---
  const [showContact, setShowContact] = useState(false);
  const [copiedWechat, setCopiedWechat] = useState(false);

  // --- History Modal State ---
  const [showHistory, setShowHistory] = useState(false);

  // --- Inspiration Modal State ---
  const [selectedInspiration, setSelectedInspiration] = useState<Inspiration | null>(null);

  // --- App Logic State ---
  const [generatedSongs, setGeneratedSongs] = useState<SongData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [instantInput, setInstantInput] = useState('');

  // --- Logic Helpers ---

  const checkCredits = (cost: number) => {
    if (user.credits < cost) {
      setShowPricing(true);
      return false;
    }
    return true;
  };

  const deductCredits = (cost: number) => {
    setUser(prev => {
      const newCredits = Math.max(0, prev.credits - cost);
      localStorage.setItem('zhiyin_credits', newCredits.toString());
      return { ...prev, credits: newCredits };
    });
  };

  const handleGenerate = async () => {
    // Unified consumption: 1 chance per generation
    if (!checkCredits(COST_PER_GENERATION)) return;
    if (isLoading || !instantInput.trim()) return;

    setIsLoading(true);
    deductCredits(COST_PER_GENERATION);

    try {
      const song = await generateInstantSong(instantInput);
      setGeneratedSongs(prev => [song, ...prev]);
    } catch (e: any) {
      console.error("App Generate Error:", e);
      // Enhanced Error Display
      alert(`生成遇到问题: ${e.message || "网络或服务异常"}`);
      
      // Refund on failure
      setUser(prev => {
         const refunded = prev.credits + COST_PER_GENERATION;
         localStorage.setItem('zhiyin_credits', refunded.toString());
         return { ...prev, credits: refunded };
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyTemplate = (template: string) => {
    setInstantInput(template);
  };
  
  const initiatePayment = (name: string, price: string) => {
    setSelectedPlan({ name, price });
    setShowPricing(false);
    setShowPayment(true);
  };

  const copyWechatId = () => {
    navigator.clipboard.writeText(WECHAT_ID);
    setCopiedWechat(true);
    setTimeout(() => setCopiedWechat(false), 2000);
  };

  const clearHistory = () => {
    if(confirm("确定要清空本次会话的创作记录吗？")) {
      setGeneratedSongs([]);
      setShowHistory(false);
    }
  }

  const handleUseInspiration = (ins: Inspiration) => {
    // Combine full lyrics and prompt into one block for the input
    const combinedContent = `${ins.fullLyrics}\n\n[Suno Prompt: ${ins.sunoPrompt}]`;
    
    setInstantInput(combinedContent);
    setSelectedInspiration(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Refine / Tweak Logic ---
  // Updated: Takes both song AND the specific variant to refine
  const handleRefine = (song: SongData, variant: SongVariant) => {
    // 1. Construct the iteration format prompt
    const refinementTemplate = `【请修改这段歌词】
原歌词内容：
${variant.lyrics}

原提示词：
${variant.sunoPrompt}

请在下方输入您的修改意见：`;

    // 2. Fill input box
    setInstantInput(refinementTemplate);

    // 3. Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 4. Close the result card (Remove from list to allow focus on next gen)
    setGeneratedSongs(prev => prev.filter(s => s.id !== song.id));
  };

  // --- Render Sections ---
  
  const renderContactModal = () => {
    if (!showContact) return null;
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-white/80 backdrop-blur-xl" onClick={() => setShowContact(false)}></div>
        
        <div className="bg-white rounded-3xl w-full max-w-sm p-8 relative z-10 shadow-2xl animate-fadeIn flex flex-col items-center text-center border border-gray-100">
          <button onClick={() => setShowContact(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-900 transition-colors"><X size={24}/></button>
          
          <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">{CONTACT_CONFIG.title}</h3>
          <p className="text-gray-500 mb-8 text-sm font-serif italic">{CONTACT_CONFIG.subtitle}</p>

          <div className="w-48 h-48 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center mb-6 relative overflow-hidden">
             <div className="text-gray-400 text-xs flex flex-col items-center gap-2">
                <span className="block w-24 h-24 bg-gray-200 rounded animate-pulse"></span>
                <span>扫码添加主理人</span>
             </div>
          </div>

          <div className="text-left w-full space-y-3 mb-8 font-serif text-sm text-gray-600">
             {CONTACT_CONFIG.items.map((item, idx) => {
               const text = item
                 .replace('%PRICE%', CONTACT_CONFIG.pricePerSong)
                 .replace('%CODE%', CONTACT_CONFIG.verificationCode);
               return <p key={idx}>{text}</p>;
             })}
          </div>

          <button 
            onClick={copyWechatId}
            className="w-full py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2"
          >
            {copiedWechat ? <Check size={16}/> : <Copy size={16}/>}
            {copiedWechat ? '已复制' : '复制微信号'}
          </button>
        </div>
      </div>
    );
  };

  const renderPaymentModal = () => {
    if (!showPayment || !selectedPlan) return null;
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-white/80 backdrop-blur-xl" onClick={() => setShowPayment(false)}></div>
        
        <div className="bg-white rounded-3xl w-full max-w-md p-8 relative z-10 shadow-2xl animate-fadeIn flex flex-col items-center text-center border border-gray-100">
          <button onClick={() => setShowPayment(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-900 transition-colors"><X size={24}/></button>
          
          <h3 className="text-2xl font-serif font-bold text-gray-900 mb-1">扫码解锁灵感</h3>
          <p className="text-gray-500 mb-8 font-serif">开通: <span className="text-gray-900">{selectedPlan.name}</span></p>

          <div className="w-56 h-56 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center mb-8 relative">
             <div className="text-gray-400 text-xs flex flex-col items-center gap-2">
                <span className="block w-32 h-32 bg-gray-200 rounded animate-pulse"></span>
                <span>微信/支付宝扫码</span>
             </div>
          </div>

          <div className="w-full mb-8 text-center">
             <span className="text-3xl font-serif font-bold text-gray-900">¥{selectedPlan.price}</span>
             <p className="text-xs text-gray-500 mt-2 font-serif">支付时请备注您的昵称: {user.name}</p>
          </div>

          <button 
            onClick={() => {
                alert("请求已发送！客服将尽快为您核实开通。");
                setShowPayment(false);
            }}
            className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-200"
          >
            我已支付，联系客服开通
          </button>
        </div>
      </div>
    );
  };

  const renderHistoryModal = () => {
    if (!showHistory) return null;
    return (
      <div className="fixed inset-0 z-50 flex justify-end">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={() => setShowHistory(false)}></div>
        <div className="relative w-full max-w-md bg-white h-full shadow-2xl animate-fadeIn p-6 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-bold text-gray-900">我的创作</h2>
            <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} className="text-gray-500"/></button>
          </div>

          {generatedSongs.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4">
              <Music size={48} className="opacity-20"/>
              <p className="font-serif">暂无创作记录</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {generatedSongs.map(song => (
                <div key={song.id} className="p-4 rounded-xl border border-gray-100 hover:border-gray-300 transition-colors bg-gray-50/50">
                   <h3 className="font-bold text-gray-900 mb-1">{song.title}</h3>
                   <div className="flex gap-2 mb-3">
                     <span className="text-xs px-2 py-0.5 bg-white border border-gray-200 rounded text-gray-500">{song.style}</span>
                     <span className="text-xs px-2 py-0.5 bg-white border border-gray-200 rounded text-gray-500">{song.mood}</span>
                   </div>
                   {/* Display lyrics from the first variant (Version A) for history view */}
                   <p className="text-xs text-gray-500 line-clamp-2 font-serif">{song.variants[0].lyrics}</p>
                   <p className="text-xs text-gray-400 mt-2">{song.createdAt.toLocaleTimeString()}</p>
                </div>
              ))}
            </div>
          )}

          {generatedSongs.length > 0 && (
            <div className="pt-4 border-t border-gray-100">
               <button 
                onClick={clearHistory}
                className="flex items-center justify-center gap-2 w-full py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm"
               >
                 <Trash2 size={16} /> 清空记录
               </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderInspirationModal = () => {
    if (!selectedInspiration) return null;
    return (
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-8">
        {/* Backdrop: Increased blur and darkness */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-xl transition-opacity" onClick={() => setSelectedInspiration(null)}></div>
        
        {/* Modal: Reduced width to 65% on desktop, rounded-2rem, increased spacing */}
        <div className="bg-white rounded-[2rem] w-full md:w-[65%] max-w-4xl relative z-10 shadow-2xl animate-fadeIn flex flex-col max-h-[85vh] overflow-hidden border border-white/20">
          
          {/* Header Image - Reduced height for better proportion */}
          <div className="h-56 relative shrink-0">
             <img 
               src={selectedInspiration.image} 
               alt="Inspiration" 
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
             <button 
                onClick={() => setSelectedInspiration(null)}
                className="absolute top-5 right-5 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-colors border border-white/10"
             >
               <X size={24} />
             </button>
             <div className="absolute bottom-6 left-8">
                <div className="flex gap-2 mb-2">
                   {selectedInspiration.tags.map((tag, idx) => (
                     <span key={idx} className="text-[10px] font-bold uppercase tracking-wider text-white border border-white/30 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full">
                       {tag}
                     </span>
                   ))}
                </div>
                <h3 className="text-white font-serif font-bold text-3xl shadow-black/50 drop-shadow-lg tracking-wide">
                  灵感详情
                </h3>
             </div>
          </div>

          {/* Body Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-8 md:p-10 bg-white">
             <div className="mb-8">
                <h4 className="flex items-center gap-2 font-bold text-gray-900 mb-4 text-lg">
                   <Quote size={20} className="text-violet-600" /> 
                   完整歌词
                </h4>
                <div className="prose prose-lg max-w-none">
                  {/* Padding p-8 ensuring lyrics don't touch edges */}
                  <p className="whitespace-pre-wrap font-serif text-gray-700 leading-relaxed text-lg bg-gray-50/80 p-8 rounded-2xl border border-gray-100/80 shadow-inner">
                    {selectedInspiration.fullLyrics}
                  </p>
                </div>
             </div>

             <div className="mb-2">
                <h4 className="flex items-center gap-2 font-bold text-gray-900 mb-4 text-lg">
                   <Sparkles size={20} className="text-amber-500" /> 
                   Suno/Udio Prompt
                </h4>
                <div className="bg-slate-900 rounded-2xl p-6 relative group shadow-lg border border-slate-800">
                   <p className="font-mono text-base text-emerald-400 break-words leading-relaxed tracking-wide">
                     {selectedInspiration.sunoPrompt}
                   </p>
                </div>
             </div>
          </div>

          {/* Footer Action */}
          <div className="p-6 md:p-8 border-t border-gray-50 bg-white shrink-0">
             <button 
               onClick={() => handleUseInspiration(selectedInspiration)}
               className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-bold text-base transition-all hover:shadow-xl hover:shadow-violet-200 hover:-translate-y-0.5 flex items-center justify-center gap-3 active:scale-[0.99]"
             >
               <Wand2 size={20} />
               <span>试用此灵感 (自动填入)</span>
             </button>
          </div>
        </div>
      </div>
    );
  };

  const renderPricingModal = () => {
    if (!showPricing) return null;
    const { basic, lifetime } = PRICING_CONFIG;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-white/90 backdrop-blur-xl" onClick={() => setShowPricing(false)}></div>
        <div className="bg-white rounded-3xl w-full max-w-5xl p-8 lg:p-12 relative z-10 shadow-2xl border border-gray-100 overflow-y-auto max-h-[90vh]">
          <button onClick={() => setShowPricing(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-colors"><X size={24}/></button>
          
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold mb-4 text-gray-900">为灵感充值</h2>
            <p className="text-gray-500 text-lg font-serif">Support Creativity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            
            {/* Free Tier */}
            <div className="p-8 flex flex-col h-full border border-gray-100 rounded-2xl hover:border-gray-300 transition-colors">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 font-serif">访客</h3>
                <div className="mt-4 text-4xl font-serif text-gray-300">¥0</div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-sm text-gray-600">5 次免费机会</li>
                <li className="flex items-start gap-3 text-sm text-gray-600">标准速度</li>
              </ul>
              <button onClick={() => setShowPricing(false)} className="w-full py-3 border border-gray-200 rounded-lg text-gray-500 hover:text-gray-900 hover:border-gray-900 transition-all font-medium">
                继续创作
              </button>
            </div>

            {/* Basic Pack */}
            <div className="p-8 flex flex-col h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white rounded-2xl shadow-xl transform md:-translate-y-4 ring-1 ring-white/10">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold font-serif">{basic.name}</h3>
                  <span className="text-xs bg-gradient-to-r from-violet-500 to-indigo-500 text-white px-2 py-0.5 rounded font-bold shadow-sm">推荐</span>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-5xl font-serif">¥{basic.price}</span>
                  <span className="text-gray-500 line-through decoration-gray-500">¥{basic.originalPrice}</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-1 text-gray-300">
                {basic.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    {feat}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => initiatePayment(basic.name, basic.price)}
                className="w-full py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg shadow-white/10"
              >
                立即充值
              </button>
            </div>

            {/* Lifetime */}
            <div className="p-8 flex flex-col h-full border border-gray-100 rounded-2xl hover:border-violet-200 transition-colors bg-white">
               <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 font-serif">{lifetime.name}</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-serif text-gray-900">¥{lifetime.price}</span>
                  <span className="text-gray-400 line-through">¥{lifetime.originalPrice}</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {lifetime.features.map((feat, idx) => (
                   <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                    {feat}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => initiatePayment(lifetime.name, lifetime.price)}
                className="w-full py-3 border border-gray-200 rounded-lg text-gray-900 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200 transition-all font-medium"
              >
                获取特权
              </button>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button 
              onClick={() => {
                setShowPricing(false);
                setShowContact(true);
              }}
              className="text-sm text-gray-400 hover:text-gray-900 transition-colors font-serif border-b border-transparent hover:border-gray-900"
            >
              需要人工定制成品音乐？联系主理人
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-gray-900 font-sans selection:bg-violet-100 selection:text-violet-900 flex flex-col relative overflow-x-hidden">
      
      {/* Ambient Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-100/40 via-transparent to-transparent opacity-80"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <AppHeader 
          user={user} 
          onLogin={() => {}} 
          onUpgrade={() => setShowPricing(true)} 
          onShowHistory={() => setShowHistory(true)}
        />
        
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 lg:px-8 flex flex-col pb-20">
          
          {/* Main Hero Section */}
          <div className="mt-16 lg:mt-24 mb-12 text-center max-w-2xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight animate-fadeIn">
               为音乐注入<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">文学灵魂</span>
            </h1>
            <p className="text-gray-500 text-lg lg:text-xl font-serif leading-relaxed animate-fadeIn delay-100">
               智音AI，更懂你的私人作词人 <br className="hidden sm:block" />一键生成大师级歌词与专属 提示词咒语。
            </p>
          </div>

          {/* Smart Input Container - Enhanced with Colors */}
          <div className="w-full max-w-3xl mx-auto mb-10 animate-fadeIn delay-200">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-violet-100/50 border border-gray-100 p-2 relative group transition-all duration-300 focus-within:ring-2 focus-within:ring-violet-100 focus-within:border-violet-200 focus-within:shadow-2xl focus-within:shadow-violet-100">
              <textarea
                value={instantInput}
                onChange={(e) => setInstantInput(e.target.value)}
                placeholder="写一首生日歌，送给朋友安娜，祝她永远18岁，风格要欢快R&B..."
                className="w-full h-32 p-6 rounded-xl resize-none outline-none text-gray-800 text-lg placeholder-gray-300 bg-transparent font-serif"
              />
              
              <div className="flex items-center justify-between px-4 pb-3">
                 <div className="flex gap-2">
                   <button className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors" title="Voice Input">
                     <Mic size={20} />
                   </button>
                 </div>
                 
                 <div className="flex items-center gap-4">
                    <span className="text-xs font-medium text-gray-400 group-focus-within:text-violet-500 transition-colors">消耗 {COST_PER_GENERATION} 次机会</span>
                    <button 
                      onClick={handleGenerate}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-violet-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none shadow-[0_4px_14px_0_rgba(139,92,246,0.39)]"
                    >
                      {isLoading ? <Loader2 className="animate-spin" size={18}/> : <Sparkles size={18} />}
                      <span className="text-sm">✨ 生成歌词 & 灵感</span>
                    </button>
                 </div>
              </div>
            </div>
          </div>

          {/* Scene Capsules - Expanded to Two Rows */}
          <div className="w-full max-w-4xl mx-auto mb-20 animate-fadeIn delay-300 flex flex-col gap-3">
             {/* Row 1: Life & Ritual */}
             <div className="flex flex-wrap justify-center gap-3">
                {SCENE_GROUPS.life.map((capsule) => (
                  <button
                    key={capsule.id}
                    onClick={() => applyTemplate(capsule.template)}
                    className={`px-4 py-2 bg-white/50 border border-gray-200 rounded-full text-sm text-gray-500 transition-all active:scale-95 ${capsule.color}`}
                  >
                    {capsule.label}
                  </button>
                ))}
             </div>
             {/* Row 2: Emotion & Creative */}
             <div className="flex flex-wrap justify-center gap-3">
                {SCENE_GROUPS.creative.map((capsule) => (
                  <button
                    key={capsule.id}
                    onClick={() => applyTemplate(capsule.template)}
                    className={`px-4 py-2 bg-white/50 border border-gray-200 rounded-full text-sm text-gray-500 transition-all active:scale-95 ${capsule.color}`}
                  >
                    {capsule.label}
                  </button>
                ))}
             </div>
          </div>

          {/* Results Section */}
          {generatedSongs.length > 0 && (
            <div className="mb-24 animate-fadeIn border-t border-gray-100 pt-12">
               <div className="flex flex-col gap-12 max-w-5xl mx-auto">
                  {generatedSongs.map(song => (
                    <div key={song.id} className="w-full">
                      <SongResultCard 
                        song={song} 
                        onRefine={(variant) => handleRefine(song, variant)}
                      />
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* Featured Inspirations - Enhanced Visuals */}
          <div className="mb-24">
            <div className="flex items-center justify-center gap-4 mb-10 text-center">
              <div className="h-px w-8 bg-gray-300"></div>
              <h2 className="text-2xl font-serif font-bold text-gray-900">精选灵感案例</h2>
              <div className="h-px w-8 bg-gray-300"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURED_INSPIRATIONS.map((card) => (
                <div 
                  key={card.id} 
                  onClick={() => setSelectedInspiration(card)}
                  className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-violet-200/50 transition-all duration-700 border border-gray-100/50 bg-gray-900"
                >
                   {/* Background Image with Zoom Effect */}
                   <img 
                     src={card.image} 
                     alt="Inspiration" 
                     referrerPolicy="no-referrer"
                     className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90"
                     onError={(e) => {
                       // Fallback if image fails entirely
                       (e.target as HTMLImageElement).style.display = 'none';
                     }} 
                   />
                   
                   {/* Gradient Overlay: Bottom Dark, Top Transparent for better text readability */}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 transition-opacity duration-500"></div>
                   
                   {/* Content */}
                   <div className="absolute inset-0 p-6 flex flex-col justify-end items-center text-center z-10 pb-10">
                      <Quote size={20} className="text-white/60 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0" />
                      
                      <p className="text-lg font-serif text-white font-medium leading-relaxed mb-6 drop-shadow-md">
                        {card.lyrics}
                      </p>
                      
                      <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {card.tags.map((tag, idx) => (
                          <span key={idx} className="text-[10px] uppercase tracking-wider text-white/90 border border-white/20 bg-white/10 backdrop-blur-md px-2 py-1 rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <span className="text-xs text-white/50 group-hover:text-white transition-colors flex items-center gap-1">
                        点击查看详情 <ArrowUpRight size={12} />
                      </span>
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* Minimal Footer */}
          <div className="mt-auto pt-10 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400 font-serif">© 2024 ZhiYin Studio.</p>
          </div>

        </main>
      </div>

      {renderPricingModal()}
      {renderPaymentModal()}
      {renderContactModal()}
      {renderHistoryModal()}
      {renderInspirationModal()}
    </div>
  );
};

export default App;