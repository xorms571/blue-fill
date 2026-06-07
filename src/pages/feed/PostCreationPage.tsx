import { useState, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import InstagramPostCard from '../../components/common/InstagramPostCard';
import { useAuthStore } from '../../store/useAuthStore';
import { useUserCharacterCards } from '../../hooks/useUserCharacterCards';
import { cn } from '../../lib/utils';

const PostCreationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser } = useAuthStore();

  // 초기 선택 캐릭터 (모달 등에서 넘어온 경우)
  const initialCharacterId = location.state?.characterId as string | undefined;

  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(initialCharacterId || null);
  const [caption, setCaption] = useState('');
  const [postImageUrl, setPostImageUrl] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { characters, loading: loadingCharacters } = useUserCharacterCards(authUser?.publicId, 20);

  const selectedCharacter = useMemo(() =>
    characters.find(c => c.publicId === selectedCharacterId),
    [characters, selectedCharacterId]
  );

  const filteredCharacters = useMemo(() =>
    characters.filter(c => c.name.toLowerCase().includes(searchKeyword.toLowerCase())),
    [characters, searchKeyword]
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 실제 구현 시 S3 업로드 로직 필요
      // 현재는 로컬 URL로 미리보기만 지원
      const url = URL.createObjectURL(file);
      setPostImageUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCharacterId || !postImageUrl) return;

    setLoading(true);
    try {
      // TODO: API 구현 시 실제 호출
      // await createPost({ characterPublicId: selectedCharacterId, imageUrl: postImageUrl, caption });
      console.log('Post submitted:', { selectedCharacterId, postImageUrl, caption });
      alert('게시물이 성공적으로 생성되었습니다. (Mock)');
      navigate('/feed');
    } catch (err) {
      console.error('Failed to create post:', err);
      alert('게시물 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout containerClassName="max-w-6xl mx-auto flex gap-16">
      {/* Left: Form */}
      <div className="flex-1 max-w-2xl">
        <header className="mb-12 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 text-base-500 hover:text-primary transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <span className="text-[10px] text-primary font-bold uppercase tracking-[0.4em]">FEED</span>
          </div>
          <h1 className="text-display-2 font-bold text-base-50 tracking-tight">New Post</h1>
          <p className="text-body-2 text-base-500 max-w-lg leading-relaxed">
            당신의 캐릭터로 일상을 기록하고 공유해보세요. <br />
            선택한 페르소나의 목소리로 이야기를 들려주세요.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Step 1: Persona Selection */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <h2 className="text-header-3 font-bold text-base-50 uppercase tracking-widest">01 Persona</h2>
                <div className="h-px flex-1 bg-linear-to-r from-base-800 to-transparent"></div>
              </div>
            </div>

            <div className="space-y-6">
              <SearchBar
                variant="dark"
                placeholder="내 캐릭터 검색"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onClear={() => setSearchKeyword('')}
              />

              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {characters.length === 0 && !loadingCharacters && (
                  <div className="flex-1 py-10 text-center border-2 border-dashed border-base-900 rounded-2xl">
                    <p className="text-body-4 text-base-600">게시물을 작성할 캐릭터가 없습니다.</p>
                  </div>
                )}
                {filteredCharacters.map((char) => (
                  <div
                    key={char.publicId}
                    onClick={() => setSelectedCharacterId(char.publicId)}
                    className={cn(
                      "shrink-0 w-24 space-y-2 cursor-pointer group transition-all",
                      selectedCharacterId === char.publicId ? "opacity-100" : "opacity-50 hover:opacity-80"
                    )}
                  >
                    <div className={cn(
                      "w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all",
                      selectedCharacterId === char.publicId ? "border-primary shadow-lg shadow-primary/20" : "border-base-900"
                    )}>
                      <img src={char.imageUrl} alt={char.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[11px] font-bold text-center text-base-300 truncate">{char.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Step 2: Content */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <h2 className="text-header-3 font-bold text-base-50 uppercase tracking-widest">02 Content</h2>
              <div className="h-px flex-1 bg-linear-to-r from-base-800 to-transparent"></div>
            </div>

            <div className="space-y-8 bg-base-950/40 p-10 rounded-4xl border border-base-900/50 shadow-2xl">
              <div className="space-y-4">
                <label className="text-caption-1 font-bold text-base-500 uppercase tracking-widest ml-1">Photo</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "aspect-square w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-all",
                    postImageUrl ? "border-base-800 p-0 overflow-hidden" : "border-base-800 hover:border-primary/40 hover:bg-primary/5 bg-base-900/40"
                  )}
                >
                  {postImageUrl ? (
                    <img src={postImageUrl} alt="upload" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-base-800 flex items-center justify-center text-base-400">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                      </div>
                      <span className="text-body-4 text-base-500 font-bold uppercase tracking-widest">Click to upload photo</span>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="space-y-4">
                <label className="text-caption-1 font-bold text-base-500 uppercase tracking-widest ml-1">Caption</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="무슨 생각을 하고 있나요? 캐릭터의 말투로 적어보세요."
                  className="w-full h-32 bg-base-900 border border-base-800 rounded-2xl p-6 text-base-100 placeholder:text-base-600 focus:outline-hidden focus:border-primary/50 transition-all resize-none"
                />
              </div>
            </div>
          </section>

          <div className="pt-8 flex gap-4">
            <Button
              variant="Darkoutline"
              size="l"
              className="flex-1 rounded-2xl h-14"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              size="l"
              className="flex-2 rounded-2xl h-14 font-bold shadow-lg shadow-primary/10"
              type="submit"
              disabled={!selectedCharacterId || !postImageUrl || loading}
              loading={loading}
            >
              Post to Feed
            </Button>
          </div>
        </form>
      </div>

      {/* Right: Preview */}
      <div className="hidden lg:block w-100 shrink-0">
        <div className="sticky top-24 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
            <h3 className="text-caption-1 font-bold text-base-400 uppercase tracking-[0.3em]">Feed Preview</h3>
          </div>

          <div className="relative p-6 bg-base-950 border border-base-900 rounded-[40px] shadow-2xl">
            <InstagramPostCard
              user={{
                imageUrl: selectedCharacter?.imageUrl || 'https://via.placeholder.com/150',
                instagramId: `@${selectedCharacter?.name || 'persona'}`,
                characterName: selectedCharacter?.name || 'Character Name',
                tags: ['#BLUEPILL', '#LOG']
              }}
              postImageUrl={postImageUrl || 'https://via.placeholder.com/500?text=Upload+Photo'}
              date={new Date().toLocaleDateString('ko-KR')}
              caption={caption || '이곳에 캡션 내용이 표시됩니다.'}
            />
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
            <p className="text-[11px] text-primary/80 leading-relaxed font-medium">
              💡 **Tip**: 캐릭터의 세계관과 어울리는 사진을 올려보세요. <br />
              해시태그는 자동으로 추천됩니다.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PostCreationPage;
