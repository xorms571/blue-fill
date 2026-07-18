import { useState } from 'react';
import { getPresignedUrl } from '../lib/imageApi';
import { getErrorMessage } from '../lib/utils';

export const useR2Upload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadToR2 = async (file: File, imageType: 'PROFILE' | 'CHARACTER' | 'LOG') => {
    setIsUploading(true);
    try {
      // 1. Presigned URL 요청
      const { uploadUrl, key } = await getPresignedUrl(file.name, file.type, imageType);
      
      // 2. R2로 직접 업로드 (PUT)
      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type }
      });
      
      return key; // 서버에 저장할 key 반환
    } catch (error) {
      console.error(getErrorMessage(error, 'R2 업로드에 실패했습니다.'));
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadToR2, isUploading };
};
