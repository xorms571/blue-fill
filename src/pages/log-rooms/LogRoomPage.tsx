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
    <PageLayout containerClassName="max-w-5xl mx-auto pb-32">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
        <div className="space-y-4">
          <button
            onClick={() => navigate('/log-rooms')}
            className="group flex items-center gap-2 text-[10px] text-base-500 hover:text-primary font-bold uppercase tracking-[0.3em] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><polyline points="15 18 9 12 15 6" /></svg>
            Back to Universe
          </button>
          <div className="space-y-1">
            <h1 className="text-display-3 font-black text-base-50 tracking-tighter">Daily Chronicles</h1>
            <p className="text-body-2 text-base-500 max-w-md">캐릭터들과 함께 쌓아온 오늘의 소중한 순간들을 확인하세요.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 bg-base-950/40 p-2 rounded-2xl border border-base-900/50 backdrop-blur-xl">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent border-none text-sm text-base-50 font-bold focus:ring-0 cursor-pointer px-4"
          />
          <div className="w-px h-8 bg-base-900 mx-2 hidden sm:block"></div>
          <Button variant="solid" size="s" className="rounded-xl px-6 font-black tracking-widest uppercase text-[10px]" onClick={() => {/* 업로드 모달 */ }}>
            Add Log
          </Button>
        </div>
      </header>

      <div className="space-y-24 relative">
        {/* Central Timeline Line */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-primary/50 via-base-900 to-transparent"></div>

        {logs.map((slot, slotIdx) => (
          <section key={slot.timeSlot} className="relative">
            {/* Time Indicator */}
            <div className="absolute left-0 md:left-1/2 -translate-x-1/2 top-0 z-10">
              <div className="w-12 h-12 rounded-full bg-background-main border-2 border-primary flex items-center justify-center shadow-[0_0_20px_rgba(98,246,181,0.2)]">
                <span className="text-[10px] font-black text-primary font-mono">{slot.timeSlot.toString().padStart(2, '0')}:00</span>
              </div>
            </div>

            <div className="pl-16 md:pl-0 pt-16">
               <div className={cn(
                 "grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16",
                 slotIdx % 2 === 0 ? "md:text-right" : "md:flex-row-reverse"
               )}>
                 {slot.entries.map((entry, idx) => (
                   <div 
                     key={idx} 
                     className={cn(
                       "group space-y-4",
                       slotIdx % 2 === 0 ? (idx % 2 === 0 ? "md:col-start-1" : "md:col-start-1") : (idx % 2 === 0 ? "md:col-start-2" : "md:col-start-2")
                     )}
                   >
                     <div className="relative aspect-4/3 rounded-3xl overflow-hidden border border-base-900 bg-base-950 group-hover:border-primary/30 transition-all duration-500 shadow-2xl">
                        <img src={entry.imageUrl} alt="log" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        {/* Author Tag on Image Hover */}
                        <div className="absolute bottom-4 left-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                           <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20">
                             <img src={entry.authorImageUrl || ''} alt={entry.authorName} className="w-full h-full object-cover" />
                           </div>
                           <span className="text-[10px] font-bold text-white uppercase tracking-wider">{entry.authorName}</span>
                        </div>
                     </div>

                     <div className={cn(
                       "px-2 space-y-2",
                       slotIdx % 2 === 0 ? "md:items-end" : "md:items-start"
                     )}>
                        <div className="flex items-center gap-2">
                           <span className={cn(
                             "text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest",
                             entry.authorType === 'CHARACTER' ? "bg-primary/10 text-primary" : "bg-base-900 text-base-500"
                           )}>
                             {entry.authorType}
                           </span>
                           <span className="text-[10px] text-base-600 font-mono">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        {entry.caption && (
                          <p className="text-body-4 text-base-400 leading-relaxed max-w-sm">{entry.caption}</p>
                        )}
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </section>
        ))}

        {!loading && logs.length === 0 && (
          <div className="py-40 text-center relative z-10">
            <div className="w-24 h-24 rounded-full bg-base-950 border border-base-900 flex items-center justify-center mx-auto mb-8 text-base-800 shadow-inner">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
            </div>
            <h3 className="text-header-2 text-base-400 font-bold tracking-tight">No Chronicles Recorded</h3>
            <p className="text-body-2 text-base-600 mt-3 max-w-sm mx-auto">오늘 하루의 소중한 기록이 아직 비어있습니다. 캐릭터들과 대화하며 추억을 남겨보세요.</p>
            <Button variant="Outline" size="m" className="mt-10 rounded-2xl px-8" onClick={() => navigate(`/log-rooms/${publicId}/chats`)}>캐릭터와 대화하기</Button>
          </div>
        )}
      </div>

      {/* Floating Action Bar for Chat */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
         <button
           onClick={() => navigate(`/log-rooms/${publicId}/chats`)}
           className="group flex items-center gap-4 bg-primary text-background-main px-8 py-5 rounded-full shadow-[0_20px_40px_rgba(98,246,181,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
         >
           <span className="text-sm font-black uppercase tracking-widest">Open Neural Chat</span>
           <div className="w-8 h-8 bg-background-main/20 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.38 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.38 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
           </div>
         </button>
      </div>
    </PageLayout>
  );
};

export default LogRoomPage;
