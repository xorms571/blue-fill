import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import { getMyLogRooms } from '../../lib/logRoomApi';
import type { LogRoomListItem } from '../../lib/logRoomApi';

const SkeletonCard = () => (
  <div className="bg-base-950/20 border border-base-900/30 rounded-4xl p-8 h-80 animate-pulse">
    <div className="flex justify-between items-start mb-8">
      <div className="space-y-3 flex-1">
        <div className="h-6 bg-base-900 rounded-lg w-3/4"></div>
        <div className="h-3 bg-base-900/50 rounded-lg w-1/2"></div>
      </div>
    </div>
    <div className="flex items-center gap-3 mb-10">
      <div className="flex -space-x-4">
        {[1, 2, 3].map(i => <div key={i} className="w-12 h-12 rounded-2xl bg-base-900 border-4 border-background-main"></div>)}
      </div>
      <div className="h-4 bg-base-900 rounded-lg w-20"></div>
    </div>
    <div className="pt-6 border-t border-base-900/30 flex justify-between">
      <div className="h-4 bg-base-900 rounded-lg w-24"></div>
      <div className="h-4 bg-base-900 rounded-lg w-16"></div>
    </div>
  </div>
);

const LogRoomListPage = () => {
  const navigate = useNavigate();
  const [logRooms, setLogRooms] = useState<LogRoomListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasNext, setHasNext] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  const fetchLogRooms = async (isFirst = true) => {
    setLoading(true);
    try {
      const cursor = isFirst ? undefined : (nextCursor || undefined);
      const response = await getMyLogRooms({ cursor, size: 12 });
      const { content, nextCursor: newCursor, hasNext: newHasNext } = response.data;

      if (isFirst) {
        setLogRooms(content);
      } else {
        setLogRooms((prev) => [...prev, ...content]);
      }
      setNextCursor(newCursor);
      setHasNext(newHasNext);
    } catch (err) {
      console.error('Failed to fetch log rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogRooms(true);
  }, []);

  const filteredRooms = logRooms.filter(room =>
    room.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    room.ownerNickname.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <PageLayout>
      <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-caption-1 text-primary font-bold tracking-[0.3em] uppercase">Your Universe</span>
          </div>
          <h1 className="text-display-2 font-bold tracking-tighter text-base-50">My Log Rooms</h1>
          <p className="text-body-1 text-base-500 max-w-2xl leading-relaxed">
            캐릭터들과 함께 쌓아가는 특별한 기록의 공간입니다.<br />
            매일의 대화와 추억이 이곳에 로그로 남습니다.
          </p>
        </div>
        <div className="shrink-0">
          <Button
            variant="solid"
            size="l"
            className="rounded-2xl px-8 font-bold shadow-[0_10px_30px_-10px_rgba(98,246,181,0.3)] hover:scale-102 transition-transform"
            onClick={() => navigate('/log-rooms/new')}
            leftIcon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>}
          >
            새 로그방 만들기
          </Button>
        </div>
      </header>

      <div className="mb-12 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-96">
          <SearchBar
            variant="dark"
            placeholder="로그방 이름 또는 방장 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onClear={() => setSearchKeyword('')}
          />
        </div>
        <div className="flex items-center gap-2 text-caption-1 text-base-600 font-bold uppercase tracking-widest">
          <span>Total</span>
          <span className="text-base-400 font-mono">{filteredRooms.length}</span>
          <div className="w-1 h-1 bg-base-800 rounded-full mx-1"></div>
          <span>Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading && logRooms.length === 0 ? (
          [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
        ) : (
          filteredRooms.map((room) => (
            <article
              key={room.publicId}
              className="group relative bg-base-950/40 border border-base-900/50 rounded-4xl p-8 hover:border-primary/40 hover:bg-base-950 transition-all duration-300 cursor-pointer overflow-hidden"
              onClick={() => navigate(`/log-rooms/${room.publicId}`)}
            >
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="space-y-1">
                    <h3 className="text-header-3 font-bold text-base-50 group-hover:text-primary transition-colors tracking-tight line-clamp-1">{room.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-base-600 font-bold uppercase tracking-wider">Created By</span>
                      <span className="text-body-4 text-base-400 font-semibold">{room.ownerNickname}</span>
                    </div>
                  </div>
                  {room.isOwner && (
                    <span className="text-[9px] px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full font-bold uppercase tracking-tighter">Owner</span>
                  )}
                </div>

                <div className="flex items-center mb-10">
                  <div className="flex items-center -space-x-4">
                    {room.participantImages.slice(0, 4).map((img, idx) => (
                      <div key={idx} className="w-12 h-12 rounded-2xl border-4 border-base-950 overflow-hidden bg-base-900 shadow-xl transform group-hover:scale-105 transition-transform" style={{ transitionDelay: `${idx * 50}ms` }}>
                        <img src={img} alt="participant" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {room.participantCount > 4 && (
                      <div className="w-12 h-12 rounded-2xl border-4 border-base-950 bg-base-800 flex items-center justify-center text-[11px] font-bold text-base-400 shadow-xl z-10">
                        +{room.participantCount - 4}
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex flex-col">
                    <span className="text-[10px] text-base-600 font-bold uppercase tracking-tight">{room.participantCount} Participants</span>
                    <div className="flex gap-1 mt-1">
                      {[...Array(Math.min(room.participantCount, 5))].map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-primary/40 rounded-full"></div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-base-900/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-base-900 flex items-center justify-center text-base-600">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    </div>
                    <span className="text-[11px] text-base-500 font-bold">Live Updates</span>
                  </div>
                  <span className="text-[10px] text-base-700 font-mono font-medium">
                    {new Date(room.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </article>
          ))
        )}

        {filteredRooms.length === 0 && !loading && (
          <div className="col-span-full py-40 text-center border-2 border-dashed border-base-900/50 rounded-[40px] bg-base-950/20">
            <div className="w-20 h-20 bg-base-900/50 rounded-full flex items-center justify-center mx-auto mb-6 text-base-700">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
            <h3 className="text-header-3 text-base-400 font-bold">No log rooms found</h3>
            <p className="text-body-2 text-base-600 mt-2 max-w-sm mx-auto">참여 중인 로그방이 없거나 검색 결과가 없습니다. 새로운 로그방을 만들어 시작해보세요!</p>
            <Button variant="Outline" size="m" className="mt-8 rounded-xl" onClick={() => navigate('/log-rooms/new')}>첫 로그방 만들기</Button>
          </div>
        )}
      </div>

      {hasNext && (
        <div className="flex justify-center mt-20">
          <Button
            variant="Darkoutline"
            size="l"
            className="rounded-2xl px-12"
            loading={loading}
            onClick={() => fetchLogRooms(false)}
          >
            Load More Rooms
          </Button>
        </div>
      )}
    </PageLayout>
  );
};

export default LogRoomListPage;
