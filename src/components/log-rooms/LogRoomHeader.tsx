import { useState } from 'react';
import { Calendar, Share2, ArrowLeft, MessageCircleMore } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../lib/utils';
import type { DayLogTimeSlot } from '../../lib/logRoomApi';

interface LogRoomHeaderProps {
  roomName: string;
  participants: { imageUrl: string | null }[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  selectedTimeSlot: number;
  onTimeSlotChange: (slot: number) => void;
  isChatOpen: boolean;
  onToggleChat: () => void;
  timelineData: DayLogTimeSlot[];
}

export const LogRoomHeader = ({
  roomName,
  participants,
  selectedDate,
  onDateChange,
  selectedTimeSlot,
  onTimeSlotChange,
  isChatOpen,
  onToggleChat,
  timelineData
}: LogRoomHeaderProps) => {
  const navigate = useNavigate();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const timeSlots = [6, 9, 12, 15, 18, 21, 24, 3];

  // Simple date formatter for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
  };

  return (
    <header className="w-full flex flex-col items-center pt-16 pb-2">
      {/* Top Row */}
      <div className="w-full flex items-start justify-between px-8 mb-6">
        {/* Left: Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 rounded-full bg-background-main border border-gray-700 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Center: Room Pill */}
        <div className='flex flex-col items-center gap-5.25'>
          <div className="flex items-center gap-3 px-6 py-2 rounded-full border border-gray-700 bg-background-main">
            <h1 className="text-lg font-bold text-base-300 tracking-wide">{roomName}</h1>
            <div className="flex -space-x-2">
              {participants.map((p, i) => (
                <img
                  key={i}
                  src={getImageUrl(p.imageUrl) || '/default-profile.png'}
                  alt="participant"
                  className="w-7 h-7 rounded-full border-2 border-gray-900 object-cover"
                />
              ))}
            </div>
          </div>

          {/* Time Slot Selector */}
          <div className="flex items-center gap-8">
            {timeSlots.map(slot => {
              const isSelected = selectedTimeSlot === slot;
              const hasLog = (timelineData.find(t => t.timeSlot === slot)?.entries.length ?? 0) > 0;
              return (
                <button
                  key={slot}
                  onClick={() => onTimeSlotChange(slot)}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className={`rounded-full transition-all ${isSelected
                    ? 'w-3 h-3 bg-primary shadow-[0_0_0_4px_rgba(98,246,181,0.25),0_0_10px_rgba(98,246,181,0.6)]'
                    : hasLog
                      ? 'w-2 h-2 bg-primary/80'
                      : 'w-2 h-2 bg-gray-700 group-hover:bg-gray-500'
                    }`} />
                  <span className={`text-[11px] font-medium transition-colors ${isSelected ? 'text-white' : hasLog ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                    {slot.toString().padStart(2, '0')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="p-2.5 rounded-full bg-background-main border border-gray-700 text-gray-400 hover:text-white transition-colors relative"
          >
            <Calendar size={20} />
            {isCalendarOpen && (
              <div className="absolute right-0 top-full mt-2 bg-background-main border border-gray-700 rounded-lg p-4 shadow-xl z-50">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => { onDateChange(e.target.value); setIsCalendarOpen(false); }}
                  className="bg-gray-800 text-white rounded p-1"
                />
              </div>
            )}
          </button>

          <button className="p-2.5 rounded-full bg-background-main border border-gray-700 text-gray-400 hover:text-white transition-colors">
            <Share2 size={20} />
          </button>
        </div>

        <button
          onClick={onToggleChat}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-700 bg-background-main transition-colors ${isChatOpen ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
        >
          <MessageCircleMore size={18} />
          <span className="text-sm font-medium">채팅하기</span>
        </button>
      </div>
    </header>
  );
};
