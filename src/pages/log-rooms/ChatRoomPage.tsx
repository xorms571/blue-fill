import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import { getChatMessages, sendChatMessage } from '../../lib/logRoomApi';
import type { ChatMessage } from '../../lib/logRoomApi';
import { cn } from '../../lib/utils';

const ChatRoomPage = () => {
  const { publicId } = useParams<{ publicId: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!publicId) return;
      setLoading(true);
      try {
        const response = await getChatMessages(publicId, { limit: 50 });
        setMessages(response.data.messages.reverse());
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [publicId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !publicId || sending) return;

    setSending(true);
    try {
      await sendChatMessage(publicId, { message: inputText });
      setInputText('');
      const response = await getChatMessages(publicId, { limit: 50 });
      setMessages(response.data.messages.reverse());
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <PageLayout containerClassName="max-w-4xl mx-auto h-[calc(100vh-80px)] flex flex-col p-0 md:p-0 bg-base-950/20 rounded-[40px] border border-base-900/50 overflow-hidden my-4 shadow-2xl">
      <header className="shrink-0 p-6 md:px-10 border-b border-base-900/50 flex items-center justify-between bg-base-950/80 backdrop-blur-xl z-20">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(`/log-rooms/${publicId}`)} className="group p-2 -ml-2 text-base-500 hover:text-primary transition-all">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <div>
            <h1 className="text-header-4 font-black text-base-50 tracking-tight">Neural Sync</h1>
            <div className="flex items-center gap-2 mt-0.5">
               <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
               <span className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">Active Link</span>
            </div>
          </div>
        </div>
        
        <div className="flex -space-x-3">
           {[1, 2].map(i => <div key={i} className="w-10 h-10 rounded-2xl border-2 border-base-950 bg-base-900 shadow-xl"></div>)}
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-12 space-y-10 custom-scrollbar scroll-smooth">
        {messages.map((msg, idx) => {
          const isUser = msg.sender === 'USER';
          const prevMsg = messages[idx - 1];
          const showAvatar = !prevMsg || prevMsg.sender !== msg.sender;

          return (
            <div key={msg.message_id} className={cn(
              "flex gap-4 group",
              isUser ? "flex-row-reverse" : "flex-row"
            )}>
              {/* Avatar Placeholder */}
              {!isUser && (
                <div className="w-10 h-10 shrink-0">
                  {showAvatar && (
                    <div className="w-10 h-10 rounded-2xl bg-base-900 border border-base-800 flex items-center justify-center shadow-lg overflow-hidden">
                       <div className="w-full h-full bg-linear-to-br from-primary/20 to-base-800" />
                    </div>
                  )}
                </div>
              )}

              <div className={cn(
                "flex flex-col max-w-[75%]",
                isUser ? "items-end" : "items-start"
              )}>
                <div className={cn(
                  "relative px-6 py-4 rounded-3xl text-[14px] leading-relaxed transition-all shadow-sm",
                  isUser
                    ? "bg-primary text-background-main rounded-tr-none font-semibold shadow-[0_10px_30px_rgba(98,246,181,0.1)]"
                    : "bg-base-900/60 text-base-200 border border-base-800 rounded-tl-none backdrop-blur-sm group-hover:bg-base-900 transition-colors"
                )}>
                  {msg.message}
                </div>
                <span className={cn(
                  "text-[9px] text-base-600 mt-2 font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                  isUser ? "text-right" : "text-left"
                )}>
                  {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
             <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
             <span className="text-[10px] text-base-600 font-black uppercase tracking-widest">Synchronizing...</span>
          </div>
        )}
        {!loading && messages.length === 0 && (
          <div className="text-center py-40 space-y-4">
             <div className="w-16 h-16 bg-base-900/30 rounded-full flex items-center justify-center mx-auto text-base-800">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.38 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.38 0 0 1 4.7-7.6 8.38 8.38 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
             </div>
             <p className="text-base-600 text-[11px] font-bold uppercase tracking-[0.2em]">Initiate first neural contact</p>
          </div>
        )}
      </div>

      <footer className="shrink-0 p-8 md:p-10 bg-base-950/80 backdrop-blur-xl border-t border-base-900/50">
        <form onSubmit={handleSendMessage} className="relative flex items-center group">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Neural input required..."
            className="w-full bg-base-900/50 border border-base-800 rounded-2xl pl-8 pr-20 py-5 text-sm text-base-50 focus:outline-hidden focus:border-primary/50 focus:bg-base-900 transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || sending}
            className="absolute right-4 p-3 bg-primary text-background-main rounded-xl hover:scale-105 active:scale-95 disabled:opacity-20 disabled:hover:scale-100 transition-all cursor-pointer shadow-lg"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
          </button>
        </form>
        <p className="text-center mt-6 text-[9px] text-base-700 font-bold uppercase tracking-[0.3em]">AI may produce unexpected logs. Verify important memories.</p>
      </footer>
    </PageLayout>
  );
};

export default ChatRoomPage;
