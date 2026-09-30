import React from 'react';

export function BusinessManagementPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Businesses</h1>
      <div className="bg-white rounded-xl border p-4">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-slate-500">
              <th className="p-2">Name</th>
              <th className="p-2">Category</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2">Royal Crown Barber</td>
              <td className="p-2">Barber</td>
              <td className="p-2">Active</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
