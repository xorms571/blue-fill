import { api } from './api';

export interface FeedPostPhoto {
  public_id: string;
  image_url: string;
  caption: string | null;
}

export interface FeedPost {
  public_id: string;
  post_date: string;
  time_slot: number;
  log_room: {
    public_id: string;
    name: string;
  };
  photos: FeedPostPhoto[];
  created_at: string;
}

export interface FeedPostListResponse {
  posts: FeedPost[];
  next_cursor: string | null;
  has_more: boolean;
}

/**
 * 로그 게시물 목록 조회 (메인 피드)
 */
export const getFeedPosts = async (params: { 
  cursor?: string; 
  size?: number;
  time_slot?: number;
} = {}) => {
  const query = new URLSearchParams();
  if (params.cursor) query.append('cursor', params.cursor);
  if (params.size) query.append('size', params.size.toString());
  if (params.time_slot !== undefined) query.append('time_slot', params.time_slot.toString());

  const endpoint = `/posts${query.toString() ? `?${query.toString()}` : ''}`;
  return api.get<{ data: FeedPostListResponse }>(endpoint);
};

/**
 * 로그 게시물 삭제
 */
export const deletePost = async (publicId: string) => {
  return api.delete(`/posts/${publicId}`);
};
