import React, { useState } from 'react';
import { Search, Plus, Edit2, Copy, Power, Filter } from 'lucide-react';

export function TemplateManagementPage() {
  const [templates] = useState([
    { name: 'Luxury Barber', category: 'Barber', theme: 'Luxury', status: 'Active', created: '2026-09-01' },
    { name: 'Modern Salon', category: 'Hair Salon', theme: 'Modern', status: 'Active', created: '2026-09-15' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Templates</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Template
        </button>
      </div>
      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-4 border-b flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search templates..." className="w-full pl-10 pr-4 py-2 border rounded-lg" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg"><Filter className="w-4 h-4" /> Filter</button>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr className="text-left">
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Theme</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((tpl) => (
              <tr key={tpl.name} className="border-t">
                <td className="p-4 font-medium">{tpl.name}</td>
                <td className="p-4">{tpl.category}</td>
                <td className="p-4">{tpl.theme}</td>
                <td className="p-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">{tpl.status}</span></td>
                <td className="p-4 flex gap-2">
                  <button className="text-slate-500 hover:text-indigo-600"><Edit2 className="w-4 h-4" /></button>
                  <button className="text-slate-500 hover:text-indigo-600"><Copy className="w-4 h-4" /></button>
                  <button className="text-slate-500 hover:text-rose-600"><Power className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
