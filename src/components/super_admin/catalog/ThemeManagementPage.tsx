import React, { useState } from 'react';
import { Palette, Edit2, CheckCircle } from 'lucide-react';

export function ThemeManagementPage() {
  const [themes] = useState([
    { name: 'Luxury', status: 'Active' },
    { name: 'Minimal', status: 'Active' },
    { name: 'Modern', status: 'Draft' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Themes</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {themes.map(theme => (
          <div key={theme.name} className="p-6 bg-white rounded-xl border shadow-sm space-y-4">
            <div className="flex justify-between items-start">
                <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                    <Palette className="w-6 h-6" />
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${theme.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {theme.status}
                </span>
            </div>
            <h2 className="font-bold text-lg">{theme.name}</h2>
            <button className="w-full flex items-center justify-center gap-2 py-2 border rounded-lg hover:bg-slate-50">
                <Edit2 className="w-4 h-4" /> Edit Theme
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
