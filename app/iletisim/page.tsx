"use client";
import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container max-w-[1000px] mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-[#333] mb-6">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm">
            <h2 className="font-bold text-lg mb-4 text-indigo-900">Headquarters</h2>
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-start gap-3"><MapPin className="text-indigo-600 shrink-0" /><p>123 Tech Blvd, CA</p></div>
              <div className="flex items-center gap-3"><Phone className="text-indigo-600 shrink-0" /><p>+1 800 123 4567</p></div>
              <div className="flex items-center gap-3"><Mail className="text-indigo-600 shrink-0" /><p>support@electronicusa.com</p></div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm">
          <h2 className="font-bold text-lg mb-4 text-[#333]">Message Us</h2>
          <form className="space-y-4">
            <input type="text" placeholder="Name" className="w-full border border-gray-300 rounded-sm h-[38px] px-3" />
            <input type="email" placeholder="Email" className="w-full border border-gray-300 rounded-sm h-[38px] px-3" />
            <textarea className="w-full border border-gray-300 rounded-sm h-32 p-3 resize-none" placeholder="Your message..."></textarea>
            <button className="w-full bg-indigo-600 text-white font-bold py-3 rounded-sm">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}