import React, { useState, useRef } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import Button from '../../common/Button';
import TextInput from '../../common/TextInput';
import { updateProfile, getMyProfile } from '../../../lib/authApi';

const SignupStep2View: React.FC = () => {
  const { setView, setAuthenticated } = useAuthStore();
  const [nickname, setNickname] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      // 서버의 imageUrl 컬럼이 255자로 제한되어 있고, /presigned-url API가 아직 미구현 상태입니다.
      // base64 문자열을 그대로 보내면 500 에러가 발생하므로, 임시로 더미 URL을 사용합니다.
      const tempImageUrl = imagePreview ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${nickname}` : null;

      await updateProfile({
        nickname,
        profileImageUrl: tempImageUrl
      });

      // 2. 업데이트된 유저 정보 다시 가져오기
      const updatedUser = await getMyProfile();
      
      // 3. 스토어 업데이트
      setAuthenticated(true, updatedUser);

      // 4. 성공 화면으로 이동
      setView('signup-success');
    } catch (error) {
      console.error('Profile update failed:', error);
      alert('프로필 업데이트에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-w-120 w-full mx-auto">
      {/* 제목 */}
      <div className="text-center space-y-3 mb-8">
        <h2 className="text-[18px] font-bold text-primary tracking-widest uppercase">BLUEPILL</h2>
        <h1 className="text-[28px] font-bold text-base-50">회원가입</h1>
      </div>

      {/* 박스 영역 */}
      <div className="relative bg-transparent border border-base-800 rounded-xl p-8 flex flex-col pt-12">
        {/* 단계 표시 */}
        <span className="absolute top-4 right-6 text-base-500 typo-body-3 font-mono">2/2</span>

        <h3 className="typo-body-2 font-bold text-base-200 mb-2 uppercase tracking-widest">BLUEPILL</h3>
        <p className="text-[18px] font-bold text-base-50 mb-8">프로필 사진과 닉네임을 등록하세요.</p>

        {/* 프로필 이미지 업로드 */}
        <div className="flex items-center gap-6 mb-8">
          <div
            className="w-24 h-24 rounded-2xl border border-primary flex items-center justify-center cursor-pointer overflow-hidden bg-base-950 hover:bg-base-900 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Profile Preview" className="w-full h-full object-cover" />
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="#62F6B5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="typo-body-4 border border-base-800 rounded-md px-4 py-2 hover:bg-base-900 text-base-200 transition-colors"
          >
            이미지 업로드하기
          </button>
        </div>

        {/* 닉네임 입력 */}
        <div className="mb-6">
          <TextInput
            label="닉네임 설정"
            placeholder="원하는 닉네임을 알려주세요"
            helperText="12자 이내로 작성해주세요!"
            maxLength={12}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>

        <button
          onClick={() => setView('signup-success')}
          className="text-left typo-body-4 text-base-500 hover:text-base-300 underline mb-8"
        >
          나중에 정할게요.
        </button>

        {/* 확인 버튼 */}
        <Button
          variant="Darksolid"
          size="l"
          fullWidth
          onClick={handleSubmit}
          loading={isLoading}
        >
          확인
        </Button>
      </div>
    </div>
  );
};

export default SignupStep2View;
