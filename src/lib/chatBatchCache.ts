import type { ChatMessage } from './logRoomApi';

export type ChatBatchPart = {
  content: string;
  createdAt: string;
  photoPublicId?: string | null;
};

const storageKey = (roomId: string) => `bluepill:chat-batch-split:${roomId}`;

const loadMap = (roomId: string): Record<string, ChatBatchPart[]> => {
  try {
    const raw = sessionStorage.getItem(storageKey(roomId));
    return raw ? (JSON.parse(raw) as Record<string, ChatBatchPart[]>) : {};
  } catch {
    return {};
  }
};

const saveMap = (roomId: string, map: Record<string, ChatBatchPart[]>) => {
  sessionStorage.setItem(storageKey(roomId), JSON.stringify(map));
};

/** 서버에 묶여 저장된 메시지를 개별 말풍선으로 다시 펼치기 위해 저장 */
export const saveChatBatchSplit = (roomId: string, batchedContent: string, parts: ChatBatchPart[]) => {
  if (parts.length <= 1) return;
  const map = loadMap(roomId);
  map[batchedContent] = parts;
  saveMap(roomId, map);
};

/** 서버 메시지 중 배치로 보낸 유저 메시지를 개별 채팅으로 펼친다 */
export const expandChatBatches = (roomId: string, messages: ChatMessage[]): ChatMessage[] => {
  const map = loadMap(roomId);
  const result: ChatMessage[] = [];

  for (const msg of messages) {
    const parts = msg.isMe ? map[msg.content] : undefined;
    if (parts && parts.length > 1) {
      for (const part of parts) {
        result.push({
          isMe: true,
          content: part.content,
          createdAt: part.createdAt,
          quotedPhotoPublicId: part.photoPublicId ?? null,
        });
      }
    } else {
      result.push(msg);
    }
  }

  return result;
};
