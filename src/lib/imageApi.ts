import { api } from './api';

export interface PresignedUrlResponse {
  uploadUrl: string;
  key: string;
}

export const getPresignedUrl = async (filename: string, contentType: string, imageType: 'PROFILE' | 'CHARACTER' | 'LOG') => {
  return await api.post<PresignedUrlResponse>('/images/presigned-url', {
    filename,
    contentType,
    imageType
  });
};
