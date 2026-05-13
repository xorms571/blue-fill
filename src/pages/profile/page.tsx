import { useState } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import { useAuthStore } from '../../store/useAuthStore';
import Button from '../../components/common/Button';
import Chip from '../../components/common/Chip';
import Tabs from '../../components/common/Tabs';
import Switch from '../../components/common/Switch';

const ProfilePage = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('characters');
  const [isPrivate, setIsPrivate] = useState(user?.isPublic === false);

  // 닉네임 첫 글자 (아바타용)
  const firstLetter = user?.nickname ? user.nickname.charAt(0).toUpperCase() : '?';

  const tabItems = [
    { id: 'posts', label: '게시물' },
    { id: 'characters', label: '캐릭터' },
  ];

  return (
    <PageLayout className="bg-background-main">
      <div className="flex flex-col gap-12">
        {/* 상단 프로필 섹션 */}
        <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            {/* 아바타 */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-base-700 flex items-center justify-center bg-base-900 text-header-1 font-bold text-base-50">
              {user?.profileImageUrl ? (
                <img src={user.profileImageUrl} alt="profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                firstLetter
              )}
            </div>

            {/* 유저 정보 */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <h1 className="typo-header-2 text-base-50">{user?.nickname || '사용자'}</h1>
                <span className="typo-body-2 text-base-500">{user?.email.split('@')[0]}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="typo-body-3 text-base-400">구독 중</span>
                <Chip variant="gray" size="m" className="bg-primary/10 text-primary border border-primary/20">
                  플랜 선택
                </Chip>
              </div>

              <div className="flex items-center gap-4 text-base-400 typo-body-3">
                <span>캐릭터 {user?.characterCnt || 0}</span>
                <span>게시물 {user?.postCnt || 0}</span>
              </div>
            </div>
          </div>

          {/* 우측 액션 버튼 */}
          <div className="flex flex-col items-end gap-4 self-stretch md:self-auto">
            <Button
              variant="Rectangleoutline"
              size="s"
              className="px-6"
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
              checked={isPrivate}
              onChange={setIsPrivate}
            />
          </div>
        </section>

        {/* 탭 메뉴 */}
        <section className="border-t border-base-900 pt-6">
          <Tabs
            items={tabItems}
            activeId={activeTab}
            onTabChange={setActiveTab}
            className="mb-12"
          />

          {/* 탭 콘텐츠 - 현재는 캐릭터 탭의 빈 상태만 구현 */}
          <div className="flex flex-col items-center justify-center py-20 gap-6">
            <div className="text-center">
              <h3 className="typo-header-3 text-base-50 mb-2">
                {activeTab === 'characters' ? '생성된 캐릭터가 아직 없습니다' : '게시물이 아직 없습니다'}
              </h3>
              <p className="typo-body-2 text-base-500">
                {activeTab === 'characters'
                  ? '내가 만든 캐릭터를 자유롭게 플레이할 수 있어요.'
                  : '당신의 캐릭터로 멋진 게시물을 만들어보세요.'}
              </p>
            </div>

            {activeTab === 'characters' && (
              <Button
                variant="solid"
                size="l"
                className="bg-primary hover:bg-primary-hovered text-background-main rounded-xl px-8"
                leftIcon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                }
              >
                캐릭터 생성하기
              </Button>
            )}
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default ProfilePage;
