import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, Zap, Coins, MessageSquare, Gift, Lightbulb, CheckCheck, FolderOpen } from 'lucide-react';
import { User } from '../types';
import { Logo } from './Logo';
import { NOTIFICATIONS_DATA } from '../config';

interface HeaderProps {
  user: User;
  onLogin: () => void;
  onUpgrade: () => void;
  onShowHistory: () => void;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  content: string;
  unread: boolean;
  action?: string;
}

const AppHeader: React.FC<HeaderProps> = ({ user, onLogin, onUpgrade, onShowHistory }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS_DATA as Notification[]);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Calculate unread count
  const unreadCount = notifications.filter(n => n.unread).length;

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(prev => prev.map(n => 
      n.id === notification.id ? { ...n, unread: false } : n
    ));

    // Execute action
    if (notification.action === 'upgrade') {
      setShowNotifications(false);
      onUpgrade();
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'system': return <MessageSquare size={16} className="text-violet-500" />;
      case 'promo': return <Gift size={16} className="text-pink-500" />;
      case 'tip': return <Lightbulb size={16} className="text-amber-500" />;
      default: return <MessageSquare size={16} />;
    }
  };

  return (
    <header className="h-24 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-20 bg-[#fcfbf9]/80 backdrop-blur-md transition-all duration-300">
      {/* Brand / Logo */}
      <div className="flex items-center gap-4">
        <div className="text-2xl lg:text-3xl">
          <Logo />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 sm:gap-6">
        
        {/* My Projects Button */}
        <button 
          onClick={onShowHistory}
          className="hidden sm:flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-serif font-medium text-sm px-3 py-2 rounded-lg hover:bg-gray-100/50"
        >
          <FolderOpen size={18} />
          <span>我的创作</span>
        </button>

        <div className="w-px h-4 bg-gray-300 hidden sm:block"></div>

        {/* Credits Pill */}
        {user.isLoggedIn && (
          <div 
            onClick={onUpgrade}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-full text-xs font-bold cursor-pointer transition-colors border border-amber-100"
          >
            <Coins size={14} className="text-amber-500 fill-amber-500" />
            <span>{user.credits} 次</span>
          </div>
        )}

        {/* Notification Bell Area */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`text-gray-400 hover:text-gray-900 transition-colors relative p-2 rounded-full hover:bg-gray-100/50 ${showNotifications ? 'text-gray-900' : ''}`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full border border-white"></span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute top-full right-0 mt-6 w-80 md:w-96 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fadeIn origin-top-right z-50">
              <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                <h3 className="font-serif font-bold text-gray-900 text-sm">通知中心</h3>
                {unreadCount > 0 && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                    {unreadCount} 未读
                  </span>
                )}
              </div>
              
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.map((note) => (
                  <div 
                    key={note.id}
                    onClick={() => handleNotificationClick(note)}
                    className={`p-5 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer flex gap-4 ${note.unread ? 'bg-gray-50/50' : ''}`}
                  >
                    <div className="mt-1 flex-shrink-0">
                      {getIcon(note.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`text-sm font-serif ${note.unread ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>
                          {note.title}
                        </h4>
                        {note.unread && <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>}
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 font-serif">
                        {note.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div 
                onClick={markAllAsRead}
                className="p-3 bg-gray-50 text-center text-xs text-gray-500 font-medium hover:text-gray-900 cursor-pointer transition-colors border-t border-gray-100"
              >
                全部标为已读
              </div>
            </div>
          )}
        </div>
        
        {!user.isLoggedIn ? (
          <button 
            onClick={onLogin}
            className="px-5 py-2 bg-gray-900 text-white rounded-lg text-sm font-serif hover:bg-black transition-all"
          >
            登录
          </button>
        ) : (
          <div className="flex items-center gap-3">
             <button 
               onClick={onUpgrade}
               className="hidden md:flex items-center gap-2 text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:shadow-lg hover:shadow-violet-200 px-4 py-2 rounded-lg text-sm font-serif transition-all"
             >
               升级 Pro
             </button>
             <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-serif font-bold text-xs cursor-pointer hover:bg-gray-200">
               {user.name.charAt(0)}
             </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AppHeader;