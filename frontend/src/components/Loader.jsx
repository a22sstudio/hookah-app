import React from 'react';

export default function Loader({ size = 'default', className = '' }) {
  const sizes = {
    sm: 'w-5 h-5',
    default: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`
        ${sizes[size]}
        border-2 border-surface-elevated
        border-t-accent-green
        rounded-full
        animate-spin
      `} />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <Loader size="lg" />
        <p className="text-text-secondary text-subheadline">Загрузка...</p>
      </div>
    </div>
  );
}
