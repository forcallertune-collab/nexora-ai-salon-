import React from 'react';
import { Save } from 'lucide-react';

export function BusinessSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Business Content</h1>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
        <h2 className="text-lg font-bold">About Business</h2>
        <div>
          <label className="block text-sm font-medium">Tagline</label>
          <input type="text" className="w-full p-2 border rounded-lg" defaultValue="Royal Crown Barber" />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea className="w-full p-2 border rounded-lg" rows={4} defaultValue="Best barber in town." />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
        <h2 className="text-lg font-bold">Contact Info</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input type="text" className="w-full p-2 border rounded-lg" defaultValue="+91 9811122233" />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="text" className="w-full p-2 border rounded-lg" defaultValue="info@royalcrown.com" />
          </div>
        </div>
      </div>
      
      <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
        <Save className="w-4 h-4" /> Save Settings
      </button>
    </div>
  );
}
