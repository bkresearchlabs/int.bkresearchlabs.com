import React from 'react';
import { ExternalLink } from 'lucide-react';
import { handleSmartLinkClick } from '../../lib/navigation';

export interface UniversalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  onNavigate?: () => void;
  showNewTabIndicator?: boolean;
  children: React.ReactNode;
  active?: boolean;
  className?: string;
  tabTitle?: string;
}

export const UniversalLink: React.FC<UniversalLinkProps> = ({
  href,
  onNavigate,
  showNewTabIndicator = false,
  children,
  active = false,
  className = '',
  tabTitle,
  onClick,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }
    if (onNavigate) {
      handleSmartLinkClick(e, href, onNavigate);
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      title={tabTitle || (typeof children === 'string' ? children : undefined)}
      className={`inline-flex items-center gap-1.5 transition-all select-none cursor-pointer ${className}`}
      {...props}
    >
      {children}
      {showNewTabIndicator && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            window.open(href, '_blank', 'noopener,noreferrer');
          }}
          title="Open in separate browser tab"
          className="p-1 hover:bg-white/20 rounded-md transition-colors opacity-70 hover:opacity-100 shrink-0"
        >
          <ExternalLink className="w-3 h-3 text-current" />
        </span>
      )}
    </a>
  );
};
