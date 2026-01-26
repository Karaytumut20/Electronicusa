import React from 'react';

export default function CreditCardForm() {
  return (
    <div className="bg-gray-50 p-6 rounded-md border border-gray-200">
      <div className="flex gap-4 mb-6">
        <div className="w-12 h-8 bg-blue-900 rounded opacity-80"></div>
        <div className="w-12 h-8 bg-red-600 rounded opacity-80"></div>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-[12px] font-bold text-gray-600 mb-1">Cardholder Name</label>
          <input type="text" placeholder="John Doe" className="w-full border border-gray-300 rounded-sm h-[38px] px-3 focus:border-indigo-500 outline-none" />
        </div>
        <div>
          <label className="block text-[12px] font-bold text-gray-600 mb-1">Card Number</label>
          <input type="text" placeholder="0000 0000 0000 0000" className="w-full border border-gray-300 rounded-sm h-[38px] px-3 focus:border-indigo-500 outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-bold text-gray-600 mb-1">Expiry</label>
            <input type="text" placeholder="MM/YY" className="w-full border border-gray-300 rounded-sm h-[38px] px-3 focus:border-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-gray-600 mb-1">CVC</label>
            <input type="text" placeholder="123" maxLength={3} className="w-full border border-gray-300 rounded-sm h-[38px] px-3 focus:border-indigo-500 outline-none" />
          </div>
        </div>
      </div>
    </div>
  );
}