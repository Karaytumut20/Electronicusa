"use client";
import React, { useState, useEffect } from 'react';
import { Calculator, ArrowRight } from 'lucide-react';

export default function LoanCalculator({ price }: { price: number }) {
  const [amount, setAmount] = useState(price ? Math.floor(price * 0.8) : 10000);
  const [term, setTerm] = useState(48);
  const [rate, setRate] = useState(5.5);
  const [result, setResult] = useState<{ monthly: number; total: number } | null>(null);

  useEffect(() => {
    const r = rate / 100 / 12;
    const monthly = (amount * r * Math.pow(1 + r, term)) / (Math.pow(1 + r, term) - 1);
    setResult({ monthly, total: monthly * term });
  }, [amount, term, rate]);

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-5 mt-4">
      <h3 className="font-bold text-[#333] flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
        <Calculator size={18} className="text-indigo-600" /> Loan Calculator
      </h3>
      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">Loan Amount ($)</label>
          <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full border border-gray-300 rounded-sm p-2 text-sm" />
        </div>
      </div>
      <div className="bg-indigo-50 p-3 rounded-sm border border-indigo-100">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-indigo-800">Monthly:</span>
          <span className="text-sm font-bold text-indigo-900">${result?.monthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
      </div>
    </div>
  );
}