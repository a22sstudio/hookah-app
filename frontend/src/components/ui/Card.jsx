import React from 'react';

export default function Card({ 
  children, 
  className = '', 
  variant = 'default',
  padding = 'default',
  onClick,
  ...props 
}) {
  const variants = {
    default: 'bg-surface-solid border border-border',
    glass: 'glass',
    elevated: 'bg-surface-elevated shadow-ios-md',
  };

  const paddings = {
    none: '',
    sm: 'p-3',
    default: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      className={`
        rounded-ios-xl
        transition-all duration-200
        ${variants[variant]}
        ${paddings[padding]}
        ${onClick ? 'cursor-pointer press-effect' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
