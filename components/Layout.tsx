import React, { ReactNode } from 'react';
import { Activity, BookOpen, MessageSquare } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  activeTab: 'simulation' | 'docs';
  onTabChange: (tab: 'simulation' | 'docs') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Activity className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 leading-tight">Sistem Agen RS</h1>
              <p className="text-xs text-slate-500 font-medium">Integrated Smart Hospital System</p>
            </div>
          </div>

          <nav className="flex gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => onTabChange('docs')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'docs'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Dokumentasi
            </button>
            <button
              onClick={() => onTabChange('simulation')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'simulation'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Simulasi Live
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;