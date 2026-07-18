import type { ChatMessage } from './logRoomApi';

const storageKey = (roomId: string) => `bluepill:photo-replies:${roomId}`;

export const messageReplyKey = (m: Pick<ChatMessage, 'content' | 'createdAt' | 'isMe'>) =>
  `${m.createdAt}|${m.isMe ? '1' : '0'}|${m.content}`;

const loadMap = (roomId: string): Record<string, string> => {
  try {
    const raw = sessionStorage.getItem(storageKey(roomId));
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
};

const saveMap = (roomId: string, map: Record<string, string>) => {
  sessionStorage.setItem(storageKey(roomId), JSON.stringify(map));
};

/** 저장된 사진 답장 매핑을 메시지에 다시 붙인다. */
export const applyPhotoReplyCache = (roomId: string, messages: ChatMessage[]): ChatMessage[] => {
  const map = loadMap(roomId);
  return messages.map((m) => {
    const photoId = map[messageReplyKey(m)];
    return photoId ? { ...m, quotedPhotoPublicId: photoId } : m;
  });
};

/**
 * 방금 보낸 사진 답장(및 이어지는 AI 응답)에 quotedPhotoPublicId를 붙이고
 * sessionStorage에 저장해 새로고침 후에도 유지한다.
 */
export const registerPhotoReply = (
  roomId: string,
  messages: ChatMessage[],
  sentContent: string,
  quotedPhotoPublicId: string,
): ChatMessage[] => {
  const sorted = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  let userIdx = -1;
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i].isMe && sorted[i].content === sentContent) {
      userIdx = i;
      break;
    }
  }

  const map = loadMap(roomId);
  if (userIdx < 0) {
    return applyPhotoReplyCache(roomId, messages);
  }

  const tagged = new Set<number>([userIdx]);
  for (let i = userIdx + 1; i < sorted.length; i++) {
    if (sorted[i].isMe) break;
    tagged.add(i);
  }

  tagged.forEach((i) => {
    map[messageReplyKey(sorted[i])] = quotedPhotoPublicId;
  });
  saveMap(roomId, map);

  return sorted.map((m, i) => {
    if (tagged.has(i)) return { ...m, quotedPhotoPublicId };
    const cached = map[messageReplyKey(m)];
    return cached ? { ...m, quotedPhotoPublicId: cached } : m;
  });
};
