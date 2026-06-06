import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import Button from '../../components/common/Button';
import { getDayLog } from '../../lib/logRoomApi';
import type { DayLogTimeSlot } from '../../lib/logRoomApi';
import { cn } from '../../lib/utils';

const LogRoomPage = () => {
  const { publicId } = useParams<{ publicId: string }>();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<DayLogTimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!publicId) return;
      setLoading(true);
      try {
        const response = await getDayLog(publicId, selectedDate);
        setLogs(response.data);
      } catch (err) {
        console.error('Failed to fetch day logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [publicId, selectedDate]);

  return (
    <PageLayout containerClassName="max-w-4xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-1">
          <button
            onClick={() => navigate('/log-rooms')}
            className="text-body-4 text-base-500 hover:text-primary transition-colors flex items-center gap-1 mb-2"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            목록으로 돌아가기
          </button>
          <h1 className="text-header-1 font-bold text-base-50">Daily Log</h1>
          <p className="text-body-3 text-base-500">오늘 하루의 기록을 한 눈에 확인하세요.</p>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-base-900 border border-base-800 rounded-xl px-4 py-2 text-sm text-base-50 focus:outline-hidden focus:border-primary/50 transition-all"
          />
          <Button variant="solid" size="s" className="rounded-xl px-6 font-bold" onClick={() => {/* 업로드 모달 */ }}>
            사진 올리기
          </Button>
        </div>
      </header>

      <div className="space-y-16">
        {logs.map((slot) => (
          <section key={slot.timeSlot} className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-8 bottom-0 w-px bg-base-800 -mb-16"></div>

            <div className="flex gap-8">
              <div className="shrink-0 w-12 h-12 rounded-full bg-base-900 border border-base-800 flex items-center justify-center text-[11px] font-mono font-bold text-primary z-10">
                {slot.timeSlot.toString().padStart(2, '0')}:00
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 pb-12">
                {slot.entries.map((entry, idx) => (
                  <div key={idx} className="bg-base-950 border border-base-900 rounded-2xl overflow-hidden group hover:border-base-700 transition-all">
                    <div className="aspect-square w-full bg-base-900 overflow-hidden">
                      <img src={entry.imageUrl} alt="log" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-base-800">
                          <img src={entry.authorImageUrl || ''} alt={entry.authorName} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[11px] font-bold text-base-300">{entry.authorName}</span>
                        <span className={cn(
                          "text-[9px] px-1.5 py-0.5 rounded font-bold uppercase",
                          entry.authorType === 'CHARACTER' ? "bg-primary/10 text-primary" : "bg-base-800 text-base-500"
                        )}>
                          {entry.authorType}
                        </span>
                      </div>
                      {entry.caption && (
                        <p className="text-body-4 text-base-400 line-clamp-2 leading-relaxed">{entry.caption}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {!loading && logs.length === 0 && (
          <div className="py-40 text-center">
            <div className="w-16 h-16 rounded-full bg-base-900 border border-base-800 flex items-center justify-center mx-auto mb-6 text-base-700">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
            </div>
            <h3 className="text-header-3 text-base-500">기록된 로그가 없습니다.</h3>
            <p className="text-body-3 text-base-600 mt-2">이 시간대의 추억을 먼저 채워보세요.</p>
          </div>
        )}
      </div>

      {/* FAB for Chat */}
      <div className="fixed bottom-12 right-12">
        <button
          onClick={() => navigate(`/log-rooms/${publicId}/chats`)}
          className="size-16 bg-primary text-background-main rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all cursor-pointer"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.38 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.38 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
        </button>
      </div>
    </PageLayout>
  );
};

export default LogRoomPage;
