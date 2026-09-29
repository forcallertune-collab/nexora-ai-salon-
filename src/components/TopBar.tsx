import React from 'react';
import { Layers, ShieldCheck, FileText, Compass, LayoutGrid, GitBranch, Sparkles, Layout, Clock, UserCheck, LayoutDashboard, SlidersHorizontal, ShieldAlert, Cpu, Palette, Route, Boxes, Globe, Lock, Sliders } from 'lucide-react';

interface TopBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  wireframeCategory: string;
  setWireframeCategory: (cat: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const navItems = [
    { id: 'phase38-website-builder', label: 'Phase 3.8: Website Builder', icon: Sliders },
    { id: 'phase37-onboarding', label: 'Phase 3.7: Onboarding', icon: Sparkles },
    { id: 'phase36-auth-foundation', label: 'Phase 3.6: Authentication', icon: Lock },
    { id: 'phase35-public-website', label: 'Phase 3.5: Public Website', icon: Globe },
    { id: 'phase34-category-engine', label: 'Phase 3.4: Category Engine', icon: Boxes },
    { id: 'phase33-shells', label: 'Phase 3.3: Shells & Routing', icon: Route },
    { id: 'phase32-design-system', label: 'Phase 3.2: Design System', icon: Palette },
    { id: 'phase31-foundation', label: 'Phase 3.1: Project Foundation', icon: Cpu },
    { id: 'phase28-superadmin', label: 'Phase 2.8: Super Admin', icon: ShieldAlert },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Brand title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-semibold text-sm tracking-wider">
              N
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 tracking-tight">
                Nexora SalonOS
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs text-slate-500 font-normal">
                Architecture & Low-Fi Blueprint (Phase 1)
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-3">
            <span className="hidden lg:inline-flex text-xs text-slate-600 border border-slate-200 bg-slate-50 px-2.5 py-1 rounded">
              Phase 1: Architecture & Wireframes Only
            </span>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto py-2 border-t border-slate-100 gap-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
