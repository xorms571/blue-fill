import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import { useAuthStore } from '../../store/useAuthStore';
import Button from '../../components/common/Button';
import Chip from '../../components/common/Chip';
import Tabs from '../../components/common/Tabs';
import Switch from '../../components/common/Switch';
import { useUserCharacterCards } from '../../hooks/useUserCharacterCards';
import { updateProfileVisibility } from '../../lib/authApi';
import { api } from '../../lib/api';
import ProfileEditModal from '../../components/profile/ProfileEditModal';
import type { CharacterCard } from '../../lib/characterApi';

// --- Icons ---
const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const LinkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ProfilePage = () => {
  const { publicId: paramPublicId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('characters');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterCard | null>(null);

  const isOwner = !paramPublicId || paramPublicId === currentUser?.publicId;
  const targetPublicId = paramPublicId || currentUser?.publicId;

  const { characters, loading: charsLoading } = useUserCharacterCards(targetPublicId);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!targetPublicId) return;
      setLoading(true);
      try {
        const response = await api.get<{ data: any }>(`/users/${targetPublicId}`);
        setProfileUser(response.data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [targetPublicId]);

  const handleVisibilityChange = async (checked: boolean) => {
    try {
      await updateProfileVisibility(!checked); // isPrivate state와 반대
      setProfileUser((prev: any) => ({ ...prev, isPublic: checked }));
    } catch (err) {
      console.error('Failed to update visibility:', err);
    }
  };

  const handleEditSuccess = (newNickname: string, newImageUrl: string | null) => {
    setProfileUser((prev: any) => ({
      ...prev,
      nickname: newNickname,
      profileImageUrl: newImageUrl
    }));
  };

  if (loading) return <PageLayout>Loading...</PageLayout>;
  if (!profileUser) return <PageLayout>User not found</PageLayout>;

  // 닉네임 첫 글자 (아바타용)
  const firstLetter = profileUser.nickname ? profileUser.nickname.charAt(0).toUpperCase() : '?';

  const tabItems = [
    { id: 'posts', label: '게시물' },
    { id: 'characters', label: '캐릭터' },
  ];

  return (
    <PageLayout className="bg-background-main">
      {/* --- Character Detail Modal --- */}
      {selectedCharacter && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedCharacter(null)} />
          <div className="relative w-full max-w-md bg-base-950 border border-base-800 rounded-3xl overflow-hidden shadow-2xl">
            <button onClick={() => setSelectedCharacter(null)} className="absolute top-4 right-4 z-10 text-base-400 hover:text-base-50 transition-colors"><CloseIcon /></button>
            <div className="flex flex-col">
              <div className="aspect-square w-full overflow-hidden"><img src={selectedCharacter.imageUrl} alt={selectedCharacter.name} className="w-full h-full object-cover" /></div>
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <h2 className="text-header-2 font-bold text-base-50">{selectedCharacter.name}</h2>
                  <div className="space-y-2">
                    <h4 className="text-caption-1 text-base-600 font-bold uppercase tracking-widest">캐릭터 설명</h4>
                    <p className="text-body-3 text-base-400 leading-relaxed">{selectedCharacter.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-base-900 border border-white/5 text-primary"><LinkIcon /> <span className="text-[11px] font-bold">{selectedCharacter.creatorNickname}</span></div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-base-900 border border-white/5 text-primary"><ClockIcon /> <span className="text-[11px] font-bold">{selectedCharacter.useCount}회</span></div>
                </div>
                <Button
                  variant="solid"
                  fullWidth
                  size="m"
                  className="h-12 rounded-xl text-base-950 font-bold"
                  onClick={() => navigate('/feed/new', { state: { characterId: selectedCharacter.publicId } })}
                >
                  게시물 만들기
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-12">
        {/* 상단 프로필 섹션 */}
        <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            {/* 아바타 */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-base-700 flex items-center justify-center bg-base-900 text-header-1 font-bold text-base-50">
              {profileUser.profileImageUrl ? (
                <img src={profileUser.profileImageUrl} alt="profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                firstLetter
              )}
            </div>

            {/* 유저 정보 */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <h1 className="typo-header-2 text-base-50">{profileUser.nickname || '사용자'}</h1>
                {isOwner && <span className="typo-body-2 text-base-500">{profileUser.email?.split('@')[0]}</span>}
              </div>

              <div className="flex items-center gap-2">
                <span className="typo-body-3 text-base-400">구독 중</span>
                <Chip variant="gray" size="m" className="bg-primary/10 text-primary border border-primary/20">
                  {profileUser.subscriptionPlan || 'FREE'}
                </Chip>
              </div>

              <div className="flex items-center gap-4 text-base-400 typo-body-3">
                <span>캐릭터 {profileUser.characterCardCount || 0}</span>
                <span>게시물 {profileUser.postCount || 0}</span>
              </div>
            </div>
          </div>

          {/* 우측 액션 버튼 */}
          {isOwner && (
            <div className="flex flex-col items-end gap-4 self-stretch md:self-auto">
              <Button
                variant="Rectangleoutline"
                size="s"
                className="px-6"
                onClick={() => setIsEditModalOpen(true)}
                leftIcon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                }
              >
                수정
              </Button>

              <Switch
                label="계정 비공개로 설정"
                checked={!profileUser.isPublic}
                onChange={(checked) => handleVisibilityChange(!checked)}
              />
            </div>
          )}
        </section>

        {/* 탭 메뉴 */}
        <section className="border-t border-base-900 pt-6">
          <Tabs
            items={tabItems}
            activeId={activeTab}
            onTabChange={setActiveTab}
            className="mb-12"
          />

          {activeTab === 'characters' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
              {characters.map((char) => (
                <article key={char.publicId} className="group cursor-pointer" onClick={() => setSelectedCharacter(char)}>
                  <div className="relative aspect-4/5 mb-4 overflow-hidden rounded-[20px] bg-base-900 border border-base-800">
                    <img src={char.imageUrl} alt={char.name} className="size-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 scale-105 group-hover:scale-100" />
                    <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/10"><ClockIcon /><span className="text-[10px] font-bold">{char.useCount}</span></div>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-header-4 font-bold text-base-50">{char.name}</h3>
                    <div className="text-body-4 text-base-500 line-clamp-2">{char.description}</div>
                  </div>
                </article>
              ))}
              {characters.length === 0 && !charsLoading && (
                <div className="col-span-full flex flex-col items-center justify-center py-20 gap-6">
                  <h3 className="typo-header-3 text-base-50 mb-2">생성된 캐릭터가 아직 없습니다</h3>
                  {isOwner && (
                    <Button variant="solid" size="l" onClick={() => navigate('/library/new')} className="bg-primary text-background-main rounded-xl px-8">캐릭터 생성하기</Button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 gap-6">
              <h3 className="typo-header-3 text-base-50 mb-2">게시물이 아직 없습니다</h3>
            </div>
          )}
        </section>
      </div>

      {isOwner && (
        <ProfileEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          currentNickname={profileUser.nickname || ''}
          currentImageUrl={profileUser.profileImageUrl}
          onSuccess={handleEditSuccess}
        />
      )}
    </PageLayout>
  );
};

export default ProfilePage;
