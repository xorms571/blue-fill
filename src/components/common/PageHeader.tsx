import React from 'react';
import Button from './Button';
import { cn } from '../../lib/utils';

interface PageHeaderProps {
  /** 상단 작은 카테고리 텍스트 (예: LIBRARY, LOG ROOMS) */
  category?: string;
  /** 메인 타이틀 */
  title: string;
  /** 상세 설명 */
  description?: React.ReactNode;
  /** 우측 또는 하단에 배치될 액션 버튼 설정 */
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    variant?: "solid" | "Outline" | "Darkoutline" | "Rectangleoutline";
  };
  /** 추가적인 커스텀 클래스 */
  className?: string;
}

/**
 * 페이지 최상단 공통 헤더 컴포넌트
 */
const PageHeader: React.FC<PageHeaderProps> = ({
  category,
  title,
  description,
  action,
  className
}) => {
  return (
    <header className={cn("mb-16 space-y-4", className)}>
      {category && (
        <span className="text-caption-1 text-base-500 font-bold tracking-[0.3em] uppercase">
          {category}
        </span>
      )}
      
      <h1 className="text-display-2 font-bold tracking-tight text-base-50">
        {title}
      </h1>
      
      {description && (
        <p className="text-body-2 text-base-500 max-w-3xl leading-relaxed">
          {description}
        </p>
      )}
      
      {action && (
        <div className="pt-2">
          <Button
            variant={action.variant || "solid"}
            size="m"
            className="rounded-full px-10 h-11 text-base-950 font-bold"
            leftIcon={action.icon}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        </div>
      )}
    </header>
  );
};

export default PageHeader;
