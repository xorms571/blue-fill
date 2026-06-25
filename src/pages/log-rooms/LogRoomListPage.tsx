import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import { getMyLogRooms } from '../../lib/logRoomApi';
import type { LogRoomListItem } from '../../lib/logRoomApi';
import PageHeader from '../../components/common/PageHeader';

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
      <PageHeader
        category="Universe"
        title="Log Rooms"
        description="캐릭터들과 함께 쌓아가는 특별한 기록의 공간입니다."
        action={{
          label: "New Log Room",
          onClick: () => navigate('/log-rooms/new'),
          icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        }}
      />

      <div className="mb-12 flex flex-col sm:flex-row gap-6 items-center justify-between">
        <div className="w-full sm:w-96">
          <SearchBar
            variant="dark"
            placeholder="Search log rooms..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onClear={() => setSearchKeyword('')}
          />
        </div>
        <div className="flex items-center gap-4 text-caption-1 text-base-600 font-bold uppercase tracking-[0.2em]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <span>{filteredRooms.length} Total Rooms</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading && logRooms.length === 0 ? (
          [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
        ) : (
          filteredRooms.map((room) => (
            <article
              key={room.publicId}
              className="group relative aspect-[3/4] bg-base-900 rounded-[32px] overflow-hidden cursor-pointer border border-base-800 hover:border-primary/50 hover:shadow-[0_0_40px_rgba(98,246,181,0.1)] transition-all duration-500"
              onClick={() => navigate(`/log-rooms/${room.publicId}`, { state: { roomName: room.name } })}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={room.participants[0]?.imageUrl || '/default-room.png'}
                  alt={room.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              </div>

              {/* Status Badges */}
              <div className="absolute top-5 right-5 flex gap-2">
                {room.isOwner && (
                  <span className="text-[10px] px-2.5 py-1 bg-primary text-background-main rounded-full font-black uppercase tracking-tighter">Owner</span>
                )}
                {!room.isPublic && (
                  <div className="w-7 h-7 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="absolute inset-0 p-7 flex flex-col justify-end">
                <div className="space-y-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="space-y-1">
                    <h3 className="text-header-3 font-bold text-white tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                      {room.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-base-400 font-bold uppercase tracking-wider">With</span>
                      <div className="flex -space-x-2">
                        {room.participants.slice(0, 3).map((p, idx) => (
                          <div key={idx} className="w-5 h-5 rounded-full border border-black overflow-hidden bg-base-800">
                            <img src={p.imageUrl || '/default-avatar.png'} alt="participant" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                      <span className="text-[11px] text-primary/80 font-bold">+{room.participantCount}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-system-success"></div>
                      <span className="text-[10px] text-base-400 font-bold uppercase tracking-widest">Active</span>
                    </div>
                    <span className="text-[10px] text-base-500 font-mono">
                      {new Date(room.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hover Interaction Overlay */}
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
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
