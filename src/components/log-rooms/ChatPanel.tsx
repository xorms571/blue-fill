import { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { LogSnapshotPost } from './LogSnapshotPost';
import type { ChatMessage, SharedPost } from '../../lib/logRoomApi';
import { getImageUrl } from '../../lib/utils';

interface ChatItem {
  type: 'MESSAGE' | 'POST';
  data: ChatMessage | SharedPost;
}

interface ChatPanelProps {
  chatMessages: ChatMessage[];
  sharedPosts: SharedPost[];
  isAiTyping: boolean;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  replyPhotoId: string | null;
  onViewLog: (post: SharedPost) => void;
  onJumpToDate: (date: string) => void;
  myImageUrl: string | null;
}

const getDateKey = (isoString: string) => {
  const date = new Date(isoString);
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const formatDateOnly = (dateKey: string) => {
  const [y, m, d] = dateKey.split('-');
  return `${y}.${Number(m)}.${Number(d)}`;
};

const formatTimestamp = (isoString: string) => {
  const date = new Date(isoString);
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const hh = date.getHours().toString().padStart(2, '0');
  const mm = date.getMinutes().toString().padStart(2, '0');
  return `${y}. ${m}. ${d}. ${hh}:${mm}`;
};

export const ChatPanel = ({ chatMessages, sharedPosts, isAiTyping, inputValue, onInputChange, onSendMessage, replyPhotoId, onViewLog, onJumpToDate, myImageUrl }: ChatPanelProps) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 통합된 채팅/게시물 목록 정렬 (createdAt 기준)
  const chatItems: ChatItem[] = [
    ...chatMessages.map(m => ({ type: 'MESSAGE' as const, data: m })),
    ...sharedPosts.map(p => ({ type: 'POST' as const, data: p }))
  ].sort((a, b) => new Date(a.data.createdAt).getTime() - new Date(b.data.createdAt).getTime());

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatItems, isAiTyping]);

  return (
    <section className="w-[35%] flex flex-col">
      <div className="overflow-y-auto p-4 space-y-3 flex-1 hide-scrollbar">
        {chatItems.map((item, index) => {
          const dateKey = getDateKey(item.data.createdAt);
          const prevItem = chatItems[index - 1];
          const isNewDay = !prevItem || getDateKey(prevItem.data.createdAt) !== dateKey;

          const dateDivider = isNewDay && (
            <div key={`divider-${dateKey}`} className="flex items-center justify-between bg-gray-900/60 rounded-xl px-4 py-2.5">
              <span className="text-xs text-gray-400 font-medium">{formatDateOnly(dateKey)}</span>
              <button onClick={() => onJumpToDate(dateKey)} className="text-xs text-primary font-semibold hover:text-primary/80 transition-colors">
                로그 보기
              </button>
            </div>
          );

          if (item.type === 'MESSAGE') {
            const msg = item.data as ChatMessage;
            const showHeader = isNewDay || prevItem?.type !== 'MESSAGE' || (prevItem.data as ChatMessage).isMe !== msg.isMe;

            return (
              <div key={msg.publicId} className="space-y-3">
                {dateDivider}
                <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                  {showHeader && (
                    <span className="text-[11px] text-gray-500 mb-1 px-1">{formatTimestamp(msg.createdAt)}</span>
                  )}
                  <div className="px-4 py-2.5 rounded-2xl max-w-[80%] bg-gray-800 text-gray-100">
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              </div>
            );
          } else {
            const post = item.data as SharedPost;
            return (
              <div key={post.publicId} className="space-y-3">
                {dateDivider}
                <LogSnapshotPost post={post} onViewLog={onViewLog} />
              </div>
            );
          }
        })}
        {isAiTyping && (
          <div className="text-xs text-gray-400 p-2 italic">AI가 생각하는 중...</div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2">
          <img
            src={getImageUrl(myImageUrl) || '/default-profile.png'}
            alt="me"
            className="w-9 h-9 rounded-full object-cover shrink-0"
          />
          <div className="flex-1 flex items-center gap-2 bg-gray-900 rounded-full pl-4 pr-1.5 py-1.5">
            <input
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSendMessage()}
              placeholder={replyPhotoId ? "사진에 답장 중..." : "메시지"}
              className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder:text-gray-500"
            />
            <button onClick={onSendMessage} className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
