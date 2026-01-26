import React from 'react';
import { DollarSign } from 'lucide-react';

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Transactions</h1>
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500 shadow-sm">
        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign size={24} className="text-gray-400"/>
        </div>
        No transaction history available yet.
      </div>
    </div>
  );
}