import React from 'react';
import { Home, Music, FolderOpen, Settings, Disc } from 'lucide-react';
import { Logo } from './Logo';

const Sidebar: React.FC = () => {
  return (
    <div className="hidden md:flex flex-col w-20 lg:w-64 fixed left-4 top-4 bottom-4 bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl rounded-3xl z-30 transition-all duration-300">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex-shrink-0 animate-pulse">
            <Logo className="w-full h-full" />
          </div>
          <span className="text-xl font-bold tracking-tight hidden lg:block bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-pink-500">
            智音 ZhiYin
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar">
        <NavItem icon={<Home size={22} />} label="首页" active />
        <NavItem icon={<Disc size={22} />} label="开始创作" />
        <NavItem icon={<FolderOpen size={22} />} label="我的项目" />
        <NavItem icon={<Music size={22} />} label="社区发现" />
      </nav>

      {/* Footer / Settings */}
      <div className="p-4 mt-auto">
         <NavItem icon={<Settings size={22} />} label="设置" />
      </div>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean }> = ({ icon, label, active }) => (
  <button className={`flex items-center w-full gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${active ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-200 transform scale-105' : 'text-gray-500 hover:bg-white hover:shadow-md hover:text-violet-600'}`}>
    <span>{icon}</span>
    <span className="hidden lg:block font-medium tracking-wide">{label}</span>
  </button>
);

export default Sidebar;