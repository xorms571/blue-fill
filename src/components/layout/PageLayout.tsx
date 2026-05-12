import React from 'react';
import Sidebar from './Sidebar';
import { cn } from '../../lib/utils';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

const PageLayout = ({ children, className, containerClassName }: PageLayoutProps) => {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-background-main text-base-50 font-sans overflow-hidden">
      {/* 사이드바: Desktop(왼쪽), Mobile(하단 고정) */}
      <Sidebar />

      {/* 메인 콘텐츠 영역 */}
      <main className={cn(
        "flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar",
        // 모바일에서는 하단 탭바 높이만큼 여백 확보
        "pb-16 md:pb-0",
        className
      )}>
        {/* 중앙 정렬 컨테이너 */}
        <div className={cn(
          "max-w-350 mx-auto w-full px-6 md:px-16 py-10 md:py-20",
          containerClassName
        )}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default PageLayout;