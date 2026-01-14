import React from 'react';

const variants = {
  default: 'bg-surface-elevated text-text-secondary',
  green: 'bg-accent-green/15 text-accent-green',
  orange: 'bg-accent-orange/15 text-accent-orange',
  red: 'bg-accent-red/15 text-accent-red',
  blue: 'bg-accent-blue/15 text-accent-blue',
  purple: 'bg-accent-purple/15 text-accent-purple',
};

export default function Badge({ 
  children, 
  variant = 'default',
  className = '',
  ...props 
}) {
  return (
    <span
      className={`
        inline-flex items-center
        px-2.5 py-1
        text-caption-1 font-medium
        rounded-full
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
}
