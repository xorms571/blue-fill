import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MonthCalendarProps {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  className?: string;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const toDateString = (year: number, month: number, day: number) => {
  const mm = String(month + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
};

export const MonthCalendar = ({ value, onChange, className }: MonthCalendarProps) => {
  const selected = value ? new Date(value) : new Date();
  const [viewYear, setViewYear] = useState(selected.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected.getMonth());

  const today = new Date();
  const todayStr = toDateString(today.getFullYear(), today.getMonth(), today.getDate());

  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const goToPrevMonth = () => {
    if (viewMonth === 0) { setViewYear(viewYear - 1); setViewMonth(11); }
    else setViewMonth(viewMonth - 1);
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) { setViewYear(viewYear + 1); setViewMonth(0); }
    else setViewMonth(viewMonth + 1);
  };

  const cells: { day: number; isCurrentMonth: boolean; dateStr: string }[] = [];

  for (let i = firstWeekday - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const month = viewMonth === 0 ? 11 : viewMonth - 1;
    const year = viewMonth === 0 ? viewYear - 1 : viewYear;
    cells.push({ day, isCurrentMonth: false, dateStr: toDateString(year, month, day) });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ day, isCurrentMonth: true, dateStr: toDateString(viewYear, viewMonth, day) });
  }
  const remaining = 42 - cells.length;
  for (let day = 1; day <= remaining; day++) {
    const month = viewMonth === 11 ? 0 : viewMonth + 1;
    const year = viewMonth === 11 ? viewYear + 1 : viewYear;
    cells.push({ day, isCurrentMonth: false, dateStr: toDateString(year, month, day) });
  }

  return (
    <div className={cn('w-72 select-none', className)}>
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={goToPrevMonth}
          className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-base-800 transition-colors"
          aria-label="이전 달"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-bold text-base-200">{viewYear}년 {viewMonth + 1}월</span>
        <button
          type="button"
          onClick={goToNextMonth}
          className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-base-800 transition-colors"
          aria-label="다음 달"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((w) => (
          <span key={w} className="text-[11px] font-medium text-gray-500 text-center">{w}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((cell, idx) => {
          const isSelected = cell.dateStr === value;
          const isToday = cell.dateStr === todayStr;
          return (
            <button
              type="button"
              key={idx}
              onClick={() => onChange(cell.dateStr)}
              className={cn(
                'w-9 h-9 mx-auto flex items-center justify-center rounded-full text-xs font-medium transition-colors',
                cell.isCurrentMonth ? 'text-gray-200' : 'text-gray-700',
                isSelected
                  ? 'bg-primary text-background-main font-bold'
                  : isToday
                    ? 'border border-primary/60 text-primary'
                    : 'hover:bg-base-800'
              )}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </div>
  );
};
