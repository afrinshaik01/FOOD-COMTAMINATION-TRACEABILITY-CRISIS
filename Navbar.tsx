import React from 'react';
import { ShieldCheck, UserCheck, LogOut } from 'lucide-react';
import { AdminUser } from '../types/foodTrace';

interface NavbarProps {
  activeTab: 'home' | 'track' | 'reports' | 'dashboard' | 'about';
  setActiveTab: (tab: 'home' | 'track' | 'reports' | 'dashboard' | 'about') => void;
  currentUser: AdminUser | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onSelectBatch: (batchId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenLogin,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 text-left text-lg font-bold tracking-tight text-emerald-900 whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span>FoodTrace</span>
        </button>

        {/* Zone 2: 4-5 Clean Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <button
            onClick={() => setActiveTab('home')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'home'
                ? 'text-emerald-800 font-semibold border-b-2 border-emerald-700'
                : 'hover:text-stone-900'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'track'
                ? 'text-emerald-800 font-semibold border-b-2 border-emerald-700'
                : 'hover:text-stone-900'
            }`}
          >
            Track Product
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'reports'
                ? 'text-emerald-800 font-semibold border-b-2 border-emerald-700'
                : 'hover:text-stone-900'
            }`}
          >
            Safety Reports
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'dashboard'
                ? 'text-emerald-800 font-semibold border-b-2 border-emerald-700'
                : 'hover:text-stone-900'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'about'
                ? 'text-emerald-800 font-semibold border-b-2 border-emerald-700'
                : 'hover:text-stone-900'
            }`}
          >
            About Us
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                title={`${currentUser.name} (${currentUser.role})`}
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span className="truncate max-w-[130px]">{currentUser.name}</span>
              </button>
              <button
                onClick={onLogout}
                className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 active:scale-[0.98] transition-all shadow-xs whitespace-nowrap shrink-0 cursor-pointer"
            >
              Admin Portal
            </button>
          )}
        </div>
      </div>

      {/* Mobile subnav */}
      <div className="md:hidden flex items-center justify-around border-t border-stone-200 bg-stone-50/90 px-2 py-2 text-xs font-medium text-stone-700 overflow-x-auto">
        <button
          onClick={() => setActiveTab('home')}
          className={`px-2.5 py-1 rounded ${activeTab === 'home' ? 'text-emerald-800 font-bold bg-emerald-100/70' : ''}`}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab('track')}
          className={`px-2.5 py-1 rounded ${activeTab === 'track' ? 'text-emerald-800 font-bold bg-emerald-100/70' : ''}`}
        >
          Track
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-2.5 py-1 rounded ${activeTab === 'reports' ? 'text-emerald-800 font-bold bg-emerald-100/70' : ''}`}
        >
          Reports
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-2.5 py-1 rounded ${activeTab === 'dashboard' ? 'text-emerald-800 font-bold bg-emerald-100/70' : ''}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`px-2.5 py-1 rounded ${activeTab === 'about' ? 'text-emerald-800 font-bold bg-emerald-100/70' : ''}`}
        >
          About
        </button>
      </div>
    </header>
  );
};
