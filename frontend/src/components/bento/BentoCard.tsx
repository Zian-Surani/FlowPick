import React from 'react';

interface BentoCardProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: 'lavender' | 'blue' | 'mint' | 'peach' | 'yellow' | 'neutral';
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  title,
  subtitle,
  badge,
  badgeColor = 'neutral',
  action,
  children,
  className = '',
  headerClassName = '',
}) => {
  const badgeColors = {
    lavender: 'bg-[#EFEBFD] text-[#5941C8] border-[#DDD4FB]',
    blue: 'bg-[#E8F2FE] text-[#2563EB] border-[#CCE2FC]',
    mint: 'bg-[#E7F9F0] text-[#1E744E] border-[#C4F2DB]',
    peach: 'bg-[#FFF0E6] text-[#C05621] border-[#FBDBC6]',
    yellow: 'bg-[#FEF8E3] text-[#975A16] border-[#FCE5A4]',
    neutral: 'bg-[#F1F3F5] text-[#475569] border-[#E2E5E9]',
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-[#E8EAED] p-5 shadow-xs transition-all duration-200 hover:border-[#D7DBDF] hover:shadow-xs flex flex-col ${className}`}
    >
      {(title || subtitle || badge || action) && (
        <div className={`flex items-start justify-between gap-3 mb-4 pb-1 border-b border-[#F1F3F5] ${headerClassName}`}>
          <div>
            <div className="flex items-center gap-2">
              {title && (
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#495057]">
                  {title}
                </h3>
              )}
              {badge && (
                <span
                  className={`text-[0.625rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeColors[badgeColor]}`}
                >
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-[0.8125rem] text-[#6C757D] font-normal mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
};
