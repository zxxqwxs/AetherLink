import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
}

export default function Card({ title, children, className = '', footer }: CardProps) {
  return (
    <div className={`bg-black/40 backdrop-blur-sm rounded-lg border border-purple-500/20 overflow-hidden ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-purple-500/20">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-purple-500/20 bg-black/20">
          {footer}
        </div>
      )}
    </div>
  );
}
