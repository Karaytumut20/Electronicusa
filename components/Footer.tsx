import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white text-xs text-slate-500">
      <div className="container mx-auto px-6 max-w-7xl py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-widest">ElectronicUSA</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="hover:text-indigo-600">About Us</Link></li>
              <li><Link href="#" className="hover:text-indigo-600">Contact</Link></li>
              <li><Link href="#" className="hover:text-indigo-600">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-widest">Services</h4>
            <ul className="space-y-3">
              <li><Link href="/post-ad" className="hover:text-indigo-600">Post Ad</Link></li>
              <li><Link href="#" className="hover:text-indigo-600">Store Solutions</Link></li>
              <li><Link href="#" className="hover:text-indigo-600">Secure Payment</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-widest">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="hover:text-indigo-600">Terms of Use</Link></li>
              <li><Link href="#" className="hover:text-indigo-600">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-indigo-600">Cookie Settings</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-widest">Support</h4>
            <p>Help Center available 24/7 at:</p>
            <span className="font-black text-indigo-600 text-sm">support@electronicusa.com</span>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-100 bg-slate-50 py-6 text-center font-medium">
        <p>© 2026 ElectronicUSA. All rights reserved.</p>
      </div>
    </footer>
  );
}