"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { getConversationsClient, getMessagesClient, sendMessageClient, markMessagesAsReadClient } from "@/lib/services";
import { Send, ArrowLeft, Loader2, MessageSquare, ExternalLink, MapPin, Search, MoreVertical, Check, CheckCheck, Image as ImageIcon, AlertCircle } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRealtimeSubscription } from "@/hooks/use-realtime";

// ... (Helper functions like getRelativeDate remain the same)
function getRelativeDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function MessagesContent() {
  const { user, loading: authLoading } = useAuth();
  // ... (State definitions)
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();
  const searchParams = useSearchParams();

  // ... (useEffect for loading conversations)
  useEffect(() => {
    if (user) {
        getConversationsClient(user.id).then(data => {
            setConversations(data || []);
            setLoading(false);
            const initialId = searchParams.get("convId");
            if(initialId) setActiveConvId(Number(initialId));
        });
    }
  }, [user]);

  // ... (useEffect for messages)
  useEffect(() => {
    if(activeConvId) {
        getMessagesClient(activeConvId).then(data => {
            setMessages(data || []);
            setTimeout(() => {
                if(messageContainerRef.current) messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
            }, 100);
        });
    }
  }, [activeConvId]);

  const handleSend = async (e: React.FormEvent) => {
      e.preventDefault();
      if(!inputText.trim() || !user || !activeConvId) return;

      const content = inputText;
      setInputText("");

      // Optimistic
      setMessages(prev => [...prev, { id: Date.now(), content, sender_id: user.id, created_at: new Date().toISOString(), is_pending: true }]);

      await sendMessageClient(activeConvId, user.id, content);
      // Realtime subscription will update the actual message
  };

  const activeConv = conversations.find((c) => c.id === activeConvId);
  // SAFE AD CHECK: Handle deleted/null ads
  const adTitle = activeConv?.ads?.title || "Ad Removed / Sold";
  const adPrice = activeConv?.ads ? `${activeConv.ads.price} ${activeConv.ads.currency}` : "N/A";
  const adImage = activeConv?.ads?.image || null;
  const isAdDeleted = !activeConv?.ads;

  if (authLoading || loading) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin"/></div>;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg h-[calc(100vh-140px)] min-h-[600px] flex overflow-hidden">
      {/* Sidebar List */}
      <div className={`w-full md:w-[350px] border-r border-gray-200 flex flex-col bg-white ${activeConvId ? "hidden md:flex" : "flex"}`}>
         <div className="p-4 border-b"><h2 className="font-bold text-xl">Messages</h2></div>
         <div className="flex-1 overflow-y-auto">
            {conversations.map(conv => {
                const isActive = activeConvId === conv.id;
                const displayTitle = conv.ads?.title || "Ad Removed";
                const otherUser = conv.buyer_id === user?.id ? conv.seller : conv.profiles;

                return (
                    <div key={conv.id} onClick={() => setActiveConvId(conv.id)} className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${isActive ? 'bg-blue-50' : ''}`}>
                        <div className="flex justify-between mb-1">
                            <span className="font-bold text-sm">{otherUser?.full_name || 'User'}</span>
                            <span className="text-xs text-gray-400">{getRelativeDate(conv.updated_at)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-200 rounded shrink-0 overflow-hidden">
                                {conv.ads?.image ? <img src={conv.ads.image} className="w-full h-full object-cover"/> : <ImageIcon size={16} className="m-auto mt-2 text-gray-400"/>}
                            </div>
                            <p className={`text-xs truncate ${!conv.ads ? 'text-red-500 italic' : 'text-gray-500'}`}>{displayTitle}</p>
                        </div>
                    </div>
                )
            })}
         </div>
      </div>

      {/* Chat Window */}
      <div className={`flex-1 flex flex-col bg-[#e5ddd5] relative ${!activeConvId ? "hidden md:flex" : "flex"}`}>
        {activeConv ? (
            <>
                {/* Header */}
                <div className="bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm z-20 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <button onClick={() => setActiveConvId(null)} className="md:hidden"><ArrowLeft/></button>

                        {/* Safe Ad Link */}
                        {isAdDeleted ? (
                            <div className="flex items-center gap-3 opacity-70 cursor-not-allowed">
                                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center"><AlertCircle className="text-gray-400"/></div>
                                <div>
                                    <h3 className="font-bold text-gray-600 text-sm">Ad Removed or Sold</h3>
                                    <span className="text-xs text-red-500">This item is no longer available.</span>
                                </div>
                            </div>
                        ) : (
                            <Link href={`/ilan/${activeConv.ads.id}`} target="_blank" className="flex items-center gap-3 group">
                                <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                                    <img src={adImage || ""} className="w-full h-full object-cover"/>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-sm group-hover:text-indigo-600">{adTitle}</h3>
                                    <span className="text-indigo-700 font-bold text-sm">{adPrice}</span>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Messages */}
                <div ref={messageContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`px-4 py-2 rounded-xl text-sm shadow-sm max-w-[80%] ${msg.sender_id === user?.id ? 'bg-[#dcf8c6]' : 'bg-white'}`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="bg-white p-3 border-t flex gap-2">
                    <input value={inputText} onChange={e => setInputText(e.target.value)} className="flex-1 bg-gray-100 rounded-full px-4 py-2 outline-none" placeholder="Type a message..." />
                    <button type="submit" className="bg-indigo-600 text-white p-2 rounded-full"><Send size={18}/></button>
                </form>
            </>
        ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">Select a conversation</div>
        )}
      </div>
    </div>
  );
}

export default function MessagesPage() {
    return <Suspense fallback={<div>Loading...</div>}><MessagesContent /></Suspense>
}