import { api } from './api';

/**
 * Presigned URL 받기
 */
export const getPresignedUrl = async () => {
  return api.get<{ data: { url: string; fields: any } }>('/presigned-url');
};
