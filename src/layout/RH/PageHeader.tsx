// frontend/src/layout/RH/PageHeader.tsx
import React from 'react';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  /** área à direita do header: botões, filtros, etc. */
  actions?: React.ReactNode;
  className?: string;
};

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions, className = '' }) => {
  return (
    <header
      className={[
        'mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm',
        'dark:border-slate-700 dark:bg-slate-800 sm:p-6',
        className,
      ].join(' ')}
    >
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-innova-gradient">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
};

export default PageHeader;
