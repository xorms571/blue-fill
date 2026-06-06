import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import Button from '../../components/common/Button';
import { getMyLogRooms } from '../../lib/logRoomApi';
import type { LogRoomListItem } from '../../lib/logRoomApi';

const LogRoomListPage = () => {
  const navigate = useNavigate();
  const [logRooms, setLogRooms] = useState<LogRoomListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasNext, setHasNext] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const fetchLogRooms = async (isFirst = true) => {
    setLoading(true);
    try {
      const cursor = isFirst ? undefined : (nextCursor || undefined);
      const response = await getMyLogRooms({ cursor, size: 10 });
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

  return (
    <PageLayout>
      <header className="mb-16 space-y-4">
        <span className="text-caption-1 text-base-500 font-bold tracking-widest">LOG ROOMS</span>
        <h1 className="text-display-2 font-bold tracking-tight">My Log Rooms</h1>
        <p className="text-body-2 text-base-500 max-w-3xl leading-relaxed">내가 참여 중인 로그방 목록입니다. 친구들, 캐릭터들과 함께 일상을 기록해보세요.</p>
        <Button variant="solid" size="m" className="rounded-full px-10 h-11 text-base-950 font-bold mt-4" onClick={() => {/* 로그방 생성 모달/페이지 이동 */}}>새 로그방 만들기</Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {logRooms.map((room) => (
          <article 
            key={room.publicId} 
            className="group bg-base-950 border border-base-900 rounded-3xl p-6 hover:border-primary/50 transition-all cursor-pointer"
            onClick={() => navigate(`/log-rooms/${room.publicId}`)}
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-header-3 font-bold text-base-50 group-hover:text-primary transition-colors">{room.name}</h3>
              <span className="text-caption-1 text-base-600 font-bold">{room.participantCount}명 참여 중</span>
            </div>
            
            <div className="flex items-center -space-x-3 mb-6">
              {room.participantImages.map((img, idx) => (
                <div key={idx} className="w-10 h-10 rounded-full border-2 border-base-950 overflow-hidden bg-base-900">
                  <img src={img} alt="participant" className="w-full h-full object-cover" />
                </div>
              ))}
              {room.participantCount > room.participantImages.length && (
                <div className="w-10 h-10 rounded-full border-2 border-base-950 bg-base-800 flex items-center justify-center text-[10px] font-bold text-base-400">
                  +{room.participantCount - room.participantImages.length}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-base-900">
              <div className="flex flex-col">
                <span className="text-[10px] text-base-600 font-bold uppercase tracking-tight">방장</span>
                <span className="text-body-4 text-base-400 font-bold">{room.ownerNickname}</span>
              </div>
              <span className="text-[10px] text-base-700 font-mono">
                {new Date(room.createdAt).toLocaleDateString()}
              </span>
            </div>
          </article>
        ))}

        {logRooms.length === 0 && !loading && (
          <div className="col-span-full py-20 text-center">
            <h3 className="text-header-3 text-base-400">참여 중인 로그방이 없습니다.</h3>
            <p className="text-body-2 text-base-600 mt-2">새로운 로그방을 만들어 시작해보세요!</p>
          </div>
        )}
      </div>

      {hasNext && (
        <div className="flex justify-center mt-12">
          <Button variant="Outline" size="m" loading={loading} onClick={() => fetchLogRooms(false)}>더 보기</Button>
        </div>
      )}
    </PageLayout>
  );
};

export default LogRoomListPage;
