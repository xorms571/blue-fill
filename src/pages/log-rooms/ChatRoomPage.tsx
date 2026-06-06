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
        setMessages(response.data.messages.reverse()); // 최신 메시지가 아래로 오게
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
      // 메시지 전송 후 목록 다시 불러오기 (혹은 낙관적 업데이트)
      const response = await getChatMessages(publicId, { limit: 50 });
      setMessages(response.data.messages.reverse());
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <PageLayout containerClassName="max-w-3xl mx-auto h-full flex flex-col p-0 md:p-0">
      <header className="shrink-0 p-6 md:px-10 border-b border-base-900 flex items-center gap-4 bg-background-main/80 backdrop-blur-md sticky top-0 z-20">
        <button onClick={() => navigate(`/log-rooms/${publicId}`)} className="text-base-500 hover:text-base-50 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <div>
          <h1 className="text-header-4 font-bold text-base-50">AI Character Chat</h1>
          <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Active Now</p>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.message_id} className={cn(
            "flex flex-col max-w-[80%]",
            msg.sender === 'USER' ? "ml-auto items-end" : "mr-auto items-start"
          )}>
            <div className={cn(
              "px-5 py-3 rounded-2xl text-sm leading-relaxed",
              msg.sender === 'USER'
                ? "bg-primary text-background-main rounded-tr-none font-medium"
                : "bg-base-900 text-base-200 border border-base-800 rounded-tl-none"
            )}>
              {msg.message}
            </div>
            <span className="text-[10px] text-base-600 mt-2 font-mono">
              {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        {loading && <div className="text-center py-10 text-base-600 text-sm">Loading chat...</div>}
        {!loading && messages.length === 0 && (
          <div className="text-center py-20">
            <p className="text-base-500 text-sm italic">캐릭터와 대화를 시작해보세요!</p>
          </div>
        )}
      </div>

      <footer className="shrink-0 p-6 md:p-10 bg-background-main border-t border-base-900 sticky bottom-0">
        <form onSubmit={handleSendMessage} className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="w-full bg-base-950 border border-base-800 rounded-2xl pl-6 pr-16 py-4 text-sm text-base-50 focus:outline-hidden focus:border-primary/50 transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || sending}
            className="absolute right-3 p-2 text-primary hover:scale-110 disabled:opacity-30 disabled:hover:scale-100 transition-all cursor-pointer"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
          </button>
        </form>
      </footer>
    </PageLayout>
  );
};

export default ChatRoomPage;
