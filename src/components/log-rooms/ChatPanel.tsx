import { useRef, useEffect, useMemo, useState } from 'react';
import { Send } from 'lucide-react';
import { getDayLog } from '../../lib/logRoomApi';
import type { ChatMessage, SharedPost, DayLogTimeSlot, DayLogEntry } from '../../lib/logRoomApi';
import { messageReplyKey } from '../../lib/photoReplyCache';
import { getImageUrl } from '../../lib/utils';

interface LogEntryItem extends DayLogEntry {
  dateKey: string;
  timeSlot: number;
  createdAt: string;
}

interface ChatItem {
  type: 'MESSAGE' | 'LOG';
  data: ChatMessage | LogEntryItem;
}

interface ChatPanelProps {
  roomPublicId: string;
  chatMessages: ChatMessage[];
  sharedPosts: SharedPost[];
  timelineData: DayLogTimeSlot[];
  selectedDate: string;
  isAiTyping: boolean;
  isInputDisabled?: boolean;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  replyPhotoId: string | null;
  onJumpToLog: (date: string, timeSlot: number) => void;
  myImageUrl: string | null;
  characterName?: string;
  characterImageUrl: string | null;
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

const toLogEntryItems = (dateKey: string, slots: DayLogTimeSlot[]): LogEntryItem[] =>
  slots.flatMap(slot =>
    slot.entries.map(entry => ({
      ...entry,
      dateKey,
      timeSlot: slot.timeSlot,
      createdAt: `${dateKey}T${slot.timeSlot.toString().padStart(2, '0')}:00:00`,
    }))
  );

export const ChatPanel = ({ roomPublicId, chatMessages, sharedPosts, timelineData, selectedDate, isAiTyping, isInputDisabled = false, inputValue, onInputChange, onSendMessage, replyPhotoId, onJumpToLog, myImageUrl, characterName, characterImageUrl }: ChatPanelProps) => {
  const chatEndRef = useRef<HTMLDivElement>(null);
  // selectedDate를 제외한 '과거' 날짜들의 로그 (메시지/공유 게시물 때문에 별도 조회가 필요한 날짜만)
  const [historicalLogsByDate, setHistoricalLogsByDate] = useState<Record<string, LogEntryItem[]>>({});

  // 채팅/공유 게시물에 등장하는 날짜 목록 (그 날짜들의 로그 사진을 별도로 조회하기 위함)
  const messagePostDateKeys = useMemo(() => [...new Set([
    ...chatMessages.map(m => getDateKey(m.createdAt)),
    ...sharedPosts.map(p => getDateKey(p.createdAt)),
  ])], [chatMessages, sharedPosts]);

  useEffect(() => {
    if (!roomPublicId) return;
    // selectedDate는 부모의 timelineData로 렌더 중에 바로 계산하므로 여기서 조회하지 않음
    const missingDates = messagePostDateKeys.filter(d => d !== selectedDate && !(d in historicalLogsByDate));
    if (missingDates.length === 0) return;

    let cancelled = false;
    Promise.all(missingDates.map(async (date) => {
      try {
        const slots = await getDayLog(roomPublicId, date);
        return [date, toLogEntryItems(date, slots)] as const;
      } catch {
        return [date, [] as LogEntryItem[]] as const;
      }
    })).then((results) => {
      if (cancelled) return;
      setHistoricalLogsByDate(prev => {
        const next = { ...prev };
        results.forEach(([date, entries]) => { next[date] = entries; });
        return next;
      });
    });
    return () => { cancelled = true; };
  }, [messagePostDateKeys, roomPublicId, historicalLogsByDate, selectedDate]);

  // 현재 보고 있는 날짜(selectedDate)의 로그는 부모가 이미 들고 있는 timelineData에서 직접 파생 (별도 state/effect 불필요)
  const selectedDateLogItems = useMemo(
    () => toLogEntryItems(selectedDate, timelineData),
    [selectedDate, timelineData]
  );

  const allLogItems = useMemo(() => [
    ...Object.entries(historicalLogsByDate)
      .filter(([date]) => date !== selectedDate)
      .flatMap(([, entries]) => entries),
    ...selectedDateLogItems,
  ], [historicalLogsByDate, selectedDateLogItems, selectedDate]);

  const logPhotoIds = useMemo(
    () => new Set(allLogItems.map(log => log.photoPublicId)),
    [allLogItems],
  );

  // 사진에 달린 답장 — 해당 사진이 피드에 있을 때만 사진 아래로 묶는다
  const repliesByPhotoId = useMemo(() => {
    const map = new Map<string, ChatMessage[]>();
    for (const msg of chatMessages) {
      const photoId = msg.quotedPhotoPublicId;
      if (!photoId || !logPhotoIds.has(photoId)) continue;
      const list = map.get(photoId) ?? [];
      list.push(msg);
      map.set(photoId, list);
    }
    for (const list of map.values()) {
      list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
    return map;
  }, [chatMessages, logPhotoIds]);

  const nestedReplyKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const list of repliesByPhotoId.values()) {
      for (const msg of list) keys.add(messageReplyKey(msg));
    }
    return keys;
  }, [repliesByPhotoId]);

  // 통합된 채팅/로그 목록 정렬 (createdAt 기준)
  // 공유 게시물(POST) 카드는 채팅창에 이미지로 올리지 않는다.
  // historicalLogsByDate는 selectedDate가 바뀌기 전에 캐시된 과거 날짜의 로그도 그대로 남아있을 수 있으므로,
  // 현재 선택된 날짜는 selectedDateLogItems(live)만 사용하고 historicalLogsByDate에서는 제외해 중복을 막는다.
  const chatItems: ChatItem[] = useMemo(() => [
    ...chatMessages
      .filter(m => !nestedReplyKeys.has(messageReplyKey(m)))
      .map(m => ({ type: 'MESSAGE' as const, data: m })),
    ...allLogItems.map(log => ({ type: 'LOG' as const, data: log })),
  ].sort((a, b) => new Date(a.data.createdAt).getTime() - new Date(b.data.createdAt).getTime()),
  [chatMessages, allLogItems, nestedReplyKeys]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatItems, isAiTyping, repliesByPhotoId]);

  const renderMessageBubble = (msg: ChatMessage, options?: { compact?: boolean; showHeader?: boolean }) => {
    const compact = options?.compact ?? false;
    const showHeader = options?.showHeader ?? true;

    return (
      <div className={`flex items-end gap-2 ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
        {!msg.isMe && (
          <img
            src={getImageUrl(characterImageUrl) || '/default-profile.png'}
            alt={characterName || '캐릭터'}
            className={`${compact ? 'w-5 h-5' : 'w-7 h-7'} rounded-full object-cover shrink-0`}
          />
        )}
        <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
          {showHeader && (
            <span className="text-[11px] text-gray-500 mb-1 px-1">
              {!msg.isMe && characterName ? `${characterName} · ` : ''}{formatTimestamp(msg.createdAt)}
            </span>
          )}
          <div className={`px-3 py-2 rounded-2xl ${compact ? 'max-w-52' : 'max-w-60'} bg-gray-800 text-gray-100`}>
            <p className={`${compact ? 'text-xs' : 'text-sm'}`}>{msg.content}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="max-h-[calc(100vh-263.5px)] w-full md:w-[25vw] flex flex-col overflow-y-auto hide-scrollbar">
      <div className="p-4 space-y-3 flex-1 mb-11">
        {chatItems.map((item, index) => {
          const dateKey = getDateKey(item.data.createdAt);
          const prevItem = chatItems[index - 1];
          const isNewDay = !prevItem || getDateKey(prevItem.data.createdAt) !== dateKey;

          // 메시지는 timeSlot이 없으므로 작성 시각에서 3시간 단위 슬롯을 역산한다.
          const itemTimeSlot = item.type === 'MESSAGE'
            ? Math.floor(new Date(item.data.createdAt).getHours() / 3) * 3
            : (item.data as LogEntryItem).timeSlot;

          const dateDivider = isNewDay && (
            <div key={`divider-${dateKey}`} className="flex items-center justify-between bg-gray-900/60 rounded-xl px-4 py-2.5">
              <span className="text-xs text-gray-400 font-medium">{formatDateOnly(dateKey)}</span>
              <button onClick={() => onJumpToLog(dateKey, itemTimeSlot)} className="text-xs text-primary font-semibold hover:text-primary/80 transition-colors">
                로그 보기
              </button>
            </div>
          );

          if (item.type === 'MESSAGE') {
            const msg = item.data as ChatMessage;
            const showHeader = isNewDay || prevItem?.type !== 'MESSAGE' || (prevItem.data as ChatMessage).isMe !== msg.isMe;

            return (
              <div key={`item-${index}`} className="space-y-3">
                {dateDivider}
                {renderMessageBubble(msg, { showHeader })}
              </div>
            );
          }

          const log = item.data as LogEntryItem;
          const replies = repliesByPhotoId.get(log.photoPublicId) ?? [];

          return (
            <div key={`item-${index}`} className="space-y-3">
              {dateDivider}
              <div className="flex flex-col items-start gap-1.5">
                <span className="text-[11px] text-gray-500 px-1">
                  {log.authorName} · {formatTimestamp(log.createdAt)}
                </span>
                <img
                  src={getImageUrl(log.imageUrl) || ''}
                  alt={log.caption || '로그 이미지'}
                  className="w-40 h-40 rounded-2xl object-cover border border-gray-800"
                />
                {log.caption && <p className="text-xs text-gray-400 px-1 max-w-60">{log.caption}</p>}
                {replies.length > 0 && (
                  <div className="w-full pl-2 mt-1 space-y-2 border-l border-gray-800">
                    {replies.map((reply, replyIndex) => (
                      <div key={`${messageReplyKey(reply)}-${replyIndex}`}>
                        {renderMessageBubble(reply, {
                          compact: true,
                          showHeader: replyIndex === 0 || replies[replyIndex - 1].isMe !== reply.isMe,
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {isAiTyping && (
          <div className="text-xs text-gray-400 p-2 italic">AI가 생각하는 중...</div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 fixed bottom-11 w-full md:w-[25vw] bg-background-main">
        <div className="flex items-center gap-2">
          <img
            src={getImageUrl(myImageUrl) || '/default-profile.png'}
            alt="me"
            className="w-9 h-9 rounded-full object-cover shrink-0"
          />
          <div className={`flex-1 flex items-center gap-2 bg-gray-900 rounded-full pl-4 pr-1.5 py-1.5 ${isInputDisabled ? 'opacity-50' : ''}`}>
            <input
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isInputDisabled && onSendMessage()}
              placeholder={
                isInputDisabled
                  ? 'AI 답장 대기 중...'
                  : replyPhotoId
                    ? '사진에 답장 중...'
                    : '메시지'
              }
              disabled={isInputDisabled}
              className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder:text-gray-500 disabled:cursor-not-allowed"
            />
            <button
              onClick={onSendMessage}
              disabled={isInputDisabled}
              className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
