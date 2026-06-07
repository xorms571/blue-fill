import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import Button from '../../components/common/Button';
import TextInput from '../../components/common/TextInput';
import Checkbox from '../../components/common/Checkbox';
import SearchBar from '../../components/common/SearchBar';
import { createLogRoom } from '../../lib/logRoomApi';
import { useCharacterLibrary } from '../../hooks/useCharacterLibrary';
import { cn } from '../../lib/utils';

const LogRoomCreationPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  const { characters, loading: loadingCharacters } = useCharacterLibrary(40);

  const selectedCharacter = useMemo(() =>
    characters.find(c => c.publicId === selectedCharacterId),
    [characters, selectedCharacterId]
  );

  const filteredCharacters = useMemo(() =>
    characters.filter(c => c.name.toLowerCase().includes(searchKeyword.toLowerCase())),
    [characters, searchKeyword]
  );

  const handleToggleCharacter = (id: string) => {
    setSelectedCharacterId(id === selectedCharacterId ? null : id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !selectedCharacterId) return;

    setLoading(true);
    try {
      const response = await createLogRoom({
        name,
        characterCardPublicIds: [selectedCharacterId],
        relationship,
        isPublic,
      });
      navigate(`/log-rooms/${response.data.publicId}`);
    } catch (err) {
      console.error('Failed to create log room:', err);
      alert('로그방 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout containerClassName="max-w-6xl mx-auto flex gap-16">
      {/* Left Content Area: Form */}
      <div className="flex-1 max-w-2xl">
        <header className="mb-12 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => navigate('/log-rooms')}
              className="p-2 -ml-2 text-base-500 hover:text-primary transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <span className="text-[10px] text-primary font-bold uppercase tracking-[0.4em]">LOG ROOMS</span>
          </div>
          <h1 className="text-display-2 font-bold text-base-50 tracking-tight">Create Log Room</h1>
          <p className="text-body-2 text-base-500 max-w-lg leading-relaxed">
            캐릭터들과 함께할 새로운 공간을 설정해주세요. <br />
            이곳에서 나누는 대화는 모두 일상의 기록이 됩니다.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-16">
          {/* Section 01: Basic Info */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <h2 className="text-header-3 font-bold text-base-50 uppercase tracking-widest">01 Basic Info</h2>
              <div className="h-px flex-1 bg-linear-to-r from-base-800 to-transparent"></div>
            </div>

            <div className="space-y-8 bg-base-950/40 p-10 rounded-4xl border border-base-900/50 shadow-2xl">
              <TextInput
                label="로그방 이름"
                placeholder="예: 닌자들의 아지트, 우리들의 일상"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={30}
                required
              />
              <TextInput
                label="관계 설정"
                placeholder="예: 친구, 동료, 연인 등 (자유롭게 입력)"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                maxLength={50}
              />
              <div className="pt-2">
                <Checkbox
                  label="공개 로그방으로 설정 (다른 유저가 구경 가능)"
                  checked={isPublic}
                  onChange={setIsPublic}
                />
              </div>
            </div>
          </section>

          {/* Section 02: Character Selection */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <h2 className="text-header-3 font-bold text-base-50 uppercase tracking-widest">02 Characters</h2>
                <div className="h-px flex-1 bg-linear-to-r from-base-800 to-transparent"></div>
              </div>
              <span className="ml-4 text-caption-1 text-base-600 font-bold uppercase tracking-widest">
                {selectedCharacterId ? '1' : '0'} / 1 SELECTED
              </span>
            </div>

            <div className="space-y-6">
              <div className="w-full">
                <SearchBar
                  variant="dark"
                  placeholder="캐릭터 이름으로 검색"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onClear={() => setSearchKeyword('')}
                />
              </div>

              <div className="bg-base-950/40 p-8 rounded-4xl border border-base-900/50 min-h-100">
                {loadingCharacters ? (
                  <div className="py-40 text-center flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    <span className="text-body-4 text-base-600 font-bold uppercase tracking-widest">Loading Library...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {filteredCharacters.map((char) => (
                      <div
                        key={char.publicId}
                        onClick={() => handleToggleCharacter(char.publicId)}
                        className={cn(
                          "relative aspect-3/4 rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer group",
                          selectedCharacterId === char.publicId
                            ? "border-primary shadow-[0_0_30px_rgba(98,246,181,0.2)] scale-102"
                            : "border-base-900 hover:border-base-700"
                        )}
                      >
                        <img src={char.imageUrl} alt={char.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4">
                          <span className="text-[11px] font-bold text-white truncate">{char.name}</span>
                          <span className="text-[9px] text-base-400 font-medium truncate opacity-60 group-hover:opacity-100 transition-opacity">{char.description}</span>
                        </div>
                        {selectedCharacterId === char.publicId && (
                          <div className="absolute top-3 right-3 w-7 h-7 bg-primary rounded-full flex items-center justify-center text-background-main shadow-xl animate-in zoom-in-50 duration-300">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                          </div>
                        )}
                      </div>
                    ))}

                    {filteredCharacters.length === 0 && (
                      <div className="col-span-full py-20 text-center border-2 border-dashed border-base-900/50 rounded-2xl bg-base-950/20">
                        <p className="text-body-3 text-base-600 font-bold uppercase tracking-widest">No Characters Found</p>
                        <Button
                          variant="Outline"
                          size="s"
                          className="mt-6 rounded-xl"
                          onClick={() => navigate('/library/new')}
                        >
                          + CREATE NEW CHARACTER
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          <div className="pt-8 flex gap-4">
            <Button
              variant="Darkoutline"
              size="l"
              className="flex-1 rounded-2xl h-14"
              onClick={() => navigate('/log-rooms')}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              size="l"
              className="flex-2 rounded-2xl h-14 font-bold shadow-lg shadow-primary/10"
              type="submit"
              disabled={!name || !selectedCharacterId || loading}
              loading={loading}
            >
              Start Log Room
            </Button>
          </div>
        </form>
      </div>

      {/* Right Content Area: Preview */}
      <div className="hidden lg:block w-100 shrink-0">
        <div className="sticky top-24 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
            <h3 className="text-caption-1 font-bold text-base-400 uppercase tracking-[0.3em]">Live Preview</h3>
          </div>

          <div className="relative group">
            {/* Background Glow */}
            <div className="absolute -inset-4 bg-primary/5 rounded-[40px] blur-2xl group-hover:bg-primary/10 transition-colors duration-500"></div>

            <div className="relative bg-base-950 border border-base-900 rounded-[40px] p-8 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] overflow-hidden">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-1">
                  <h4 className="text-header-3 font-bold text-base-50 tracking-tight line-clamp-1">{name || 'Room Name'}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-base-600 font-bold uppercase">Relationship</span>
                    <span className="text-body-4 text-primary font-semibold">{relationship || 'Undefined'}</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-base-900 border border-base-800 flex items-center justify-center text-base-600">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </div>
              </div>

              <div className="aspect-square w-full rounded-3xl bg-base-900 mb-8 overflow-hidden border border-base-800/50">
                {selectedCharacter ? (
                  <img src={selectedCharacter.imageUrl} alt="preview" className="w-full h-full object-cover animate-in fade-in duration-700" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-base-800 bg-base-900/40">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    <span className="text-[11px] font-bold uppercase tracking-widest">Select Character</span>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="flex items-center -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-base-950 bg-base-800 flex items-center justify-center text-[10px] font-bold text-base-400">ME</div>
                  {selectedCharacter && (
                    <div className="w-10 h-10 rounded-full border-2 border-base-950 overflow-hidden bg-base-900 animate-in slide-in-from-left-2 duration-300">
                      <img src={selectedCharacter.imageUrl} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-base-900/50 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-base-600 font-bold uppercase">Visibility</span>
                    <span className="text-body-4 text-base-400 font-bold">{isPublic ? 'Public' : 'Private'}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] text-base-600 font-bold uppercase">Status</span>
                    <span className="text-body-4 text-system-success font-bold">Ready to Start</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
            <p className="text-[11px] text-primary/80 leading-relaxed font-medium">
              💡 **Tip**: 로그방은 언제든지 비공개로 전환할 수 있습니다. <br />
              캐릭터와의 관계 설정은 대화 스타일에 영향을 줍니다.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default LogRoomCreationPage;
