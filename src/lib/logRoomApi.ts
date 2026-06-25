import { api } from './api';

export interface LogRoomParticipant {
  memberPublicId: string;
  imageUrl: string | null;
}

export interface LogRoomListItem {
  publicId: string;
  name: string;
  participantCount: number;
  createdAt: string;
  isOwner: boolean;
  isPublic: boolean;
  backgroundPhoto: string | null;
  ownerPublicId: string;
  ownerNickname: string;
  participants: LogRoomParticipant[];
}

export interface LogRoomListResponse {
  content: LogRoomListItem[];
  nextCursor: string | null;
  hasNext: boolean;
}

export interface DayLogEntry {
  memberPublicId: string;
  photoPublicId: string;
  caption: string | null;
  imageUrl: string;
  authorType: 'USER' | 'CHARACTER';
  authorName: string;
  authorImageUrl: string | null;
}

export interface DayLogTimeSlot {
  timeSlot: number;
  entries: DayLogEntry[];
}

export interface LogCharacterCard {
  memberPublicId: string;
  characterPublicId: string;
  name: string;
  description: string;
  imageUrl: string;
  useCount: number;
  isDeleted: boolean;
  isPublic: boolean;
  isLatest: boolean;
  isOwner: boolean;
  canUpdate: boolean;
}

export interface ChatMessage {
  publicId: string;
  isMe: boolean;
  content: string;
  createdAt: string;
}

export interface SharedPostPhoto {
  memberPublicId: string;
  photoPublicId: string;
  caption: string | null;
  imageUrl: string;
  authorType: 'USER' | 'CHARACTER';
  authorName: string;
  authorImageUrl: string | null;
}

export interface SharedPost {
  publicId: string;
  postDate: string;
  timeSlot: number;
  sharer: {
    publicId: string;
    nickname: string;
    profileImageUrl: string | null;
  };
  isMine: boolean;
  createdAt: string;
  photos: SharedPostPhoto[];
}

export interface SharedPostListResponse {
  content: SharedPost[];
  nextCursor: string | null;
  hasNext: boolean;
}

/**
 * 로그방 목록 조회
 */
export const getMyLogRooms = async (params: { cursor?: string; size?: number } = {}) => {
  const query = new URLSearchParams();
  if (params.cursor) query.append('cursor', params.cursor);
  if (params.size) query.append('size', params.size.toString());

  const endpoint = `/log-rooms${query.toString() ? `?${query.toString()}` : ''}`;
  return api.get<{ data: LogRoomListResponse }>(endpoint);
};

/**
 * 로그방 생성
 */
export const createLogRoom = async (data: {
  name: string;
  characterCardPublicIds: string[];
  relationship: string;
  isPublic: boolean;
  backgroundPhoto?: string;
}) => {
  return api.post<{ data: { publicId: string; name: string; isPublic: boolean; createdAt: string } }>(
    '/log-rooms',
    data
  );
};

/**
 * 하루 로그 조회
 */
export const getDayLog = async (publicId: string, date: string) => {
  return api.get<{ data: DayLogTimeSlot[] }>(`/log-rooms/${publicId}/logs?date=${date}`);
};

/**
 * 로그 캐릭터 카드 조회
 */
export const getLogCharacterCard = async (publicId: string, memberPublicId: string) => {
  return api.get<{ data: LogCharacterCard }>(`/log-rooms/${publicId}/members/${memberPublicId}`);
};

/**
 * 로그 캐릭터 카드 업데이트 (최신 버전으로)
 */
export const updateLogCharacterCard = async (publicId: string, memberPublicId: string) => {
  return api.patch(`/log-rooms/${publicId}/members/${memberPublicId}`);
};

/**
 * 로그 게시물 공유 (피드 게시물로)
 */
export const shareLog = async (publicId: string, data: { postDate: string; timeSlot: number }) => {
  return api.post<{
    data: {
      publicId: string;
      logRoomPublicId: string;
      postDate: string;
      timeSlot: number;
      createdAt: string;
    };
  }>(`/log-rooms/${publicId}/posts`, data);
};

/**
 * 로그방에서 공유된 게시물 조회
 */
export const getLogRoomPosts = async (
  publicId: string,
  params: { cursor?: string; size?: number } = {}
) => {
  const query = new URLSearchParams();
  if (params.cursor) query.append('cursor', params.cursor);
  if (params.size) query.append('size', params.size.toString());

  const endpoint = `/log-rooms/${publicId}/posts${query.toString() ? `?${query.toString()}` : ''}`;
  return api.get<{ data: SharedPostListResponse }>(endpoint);
};

/**
 * 로그 사진 업로드
 */
export const uploadLogPhoto = async (
  publicId: string,
  data: { imageUrl: string; caption?: string },
  timezone: string
) => {
  return api.post(`/log-rooms/${publicId}/photos`, data, {
    headers: { 'X-Timezone': timezone },
  });
};

/**
 * 로그 사진 삭제
 */
export const deleteLogPhoto = async (publicId: string, photoPublicId: string) => {
  return api.delete(`/log-rooms/${publicId}/photos/${photoPublicId}`);
};

/**
 * 채팅방 메시지 목록 조회
 */
export const getChatMessages = async (publicId: string, params: { cursor?: string; limit?: number } = {}) => {
  const query = new URLSearchParams();
  if (params.cursor) query.append('cursor', params.cursor);
  if (params.limit) query.append('limit', params.limit.toString());

  const endpoint = `/log-rooms/${publicId}/chats${query.toString() ? `?${query.toString()}` : ''}`;
  return api.get<{ data: { messages: ChatMessage[]; next_cursor: string | null; has_more: boolean } }>(endpoint);
};

/**
 * 채팅방 메시지 전송
 */
export const sendChatMessage = async (publicId: string, data: { message: string; photoPublicId?: string }) => {
  return api.post(`/log-rooms/${publicId}/chats`, {
    content: data.message,
    quotedPhotoPublicId: data.photoPublicId
  });
};
