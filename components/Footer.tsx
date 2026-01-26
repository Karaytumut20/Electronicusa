import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-gray-200 bg-white text-xs text-gray-600">
      <div className="container mx-auto px-4 max-w-[1150px] py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-[#333] mb-3 text-sm">Corporate</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:underline">About Us</Link></li>
              <li><Link href="#" className="hover:underline">Careers</Link></li>
              <li><Link href="#" className="hover:underline">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#333] mb-3 text-sm">Services</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:underline">Secure Payment</Link></li>
              <li><Link href="#" className="hover:underline">Advertise</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#333] mb-3 text-sm">Privacy</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:underline">Terms of Use</Link></li>
              <li><Link href="#" className="hover:underline">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#333] mb-3 text-sm">Follow Us</h4>
            <p>Support: <span className="font-bold text-[#333]">support@electronicusa.com</span></p>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 bg-[#f6f7f9] py-6 text-center">
        <p>Copyright © 2026 ElectronicUSA. All rights reserved.</p>
      </div>
    </footer>
  );
}