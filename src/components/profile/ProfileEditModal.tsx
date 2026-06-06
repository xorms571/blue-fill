import React, { useState, useRef } from 'react';
import Button from '../common/Button';
import TextInput from '../common/TextInput';
import { updateProfile } from '../../lib/authApi';
import { useAuthStore } from '../../store/useAuthStore';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentNickname: string;
  currentImageUrl: string | null;
  onSuccess: (newNickname: string, newImageUrl: string | null) => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ 
  isOpen, 
  onClose, 
  currentNickname, 
  currentImageUrl,
  onSuccess 
}) => {
  const [nickname, setNickname] = useState(currentNickname);
  const [imagePreview, setImagePreview] = useState<string | null>(currentImageUrl);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setAuthenticated, user } = useAuthStore();

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!nickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      // 서버의 imageUrl 제약(255자) 우회를 위한 임시 URL 생성기
      // 새 이미지가 업로드된 경우(base64로 변경된 경우) 다이스베어 URL 생성
      let finalImageUrl = imagePreview;
      if (imagePreview && imagePreview.startsWith('data:image')) {
          finalImageUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${nickname + Date.now()}`;
      }

      await updateProfile({
        nickname,
        profileImageUrl: finalImageUrl
      });

      // 전역 스토어 업데이트
      if (user) {
         setAuthenticated(true, { ...user, nickname, profileImageUrl: finalImageUrl });
      }
      
      onSuccess(nickname, finalImageUrl);
      onClose();
    } catch (error: any) {
      console.error('Profile update failed:', error);
      alert(error.message || '프로필 업데이트에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-base-950 border border-base-800 rounded-3xl overflow-hidden shadow-2xl p-8">
        <h2 className="text-header-3 font-bold text-base-50 mb-6">프로필 수정</h2>

        {/* 프로필 이미지 업로드 */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div
            className="w-32 h-32 rounded-full border border-base-800 flex items-center justify-center cursor-pointer overflow-hidden bg-base-900 hover:border-primary transition-colors relative group"
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl text-base-500 font-bold">{nickname.charAt(0).toUpperCase()}</span>
            )}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          <button 
             onClick={() => setImagePreview(null)}
             className="text-[12px] text-base-500 hover:text-red-400 transition-colors underline"
          >
             기본 이미지로 변경
          </button>
        </div>

        {/* 닉네임 입력 */}
        <div className="mb-8">
          <TextInput
            label="닉네임"
            placeholder="닉네임을 입력하세요"
            maxLength={12}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <Button variant="Darkoutline" fullWidth onClick={onClose}>취소</Button>
          <Button variant="solid" fullWidth onClick={handleSubmit} loading={isLoading}>저장</Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal;
