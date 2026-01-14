import React from 'react';

const variants = {
  primary: 'bg-accent-green text-white shadow-ios-glow',
  secondary: 'bg-surface-elevated text-text-primary border border-border',
  ghost: 'bg-transparent text-text-secondary hover:text-text-primary',
  danger: 'bg-accent-red/20 text-accent-red',
};

const sizes = {
  sm: 'px-4 py-2 text-subheadline',
  md: 'px-6 py-3 text-body',
  lg: 'px-8 py-4 text-headline',
};

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled = false,
  ...props 
}) {
  return (
    <button
      className={`
        font-heading font-semibold
        rounded-ios-xl
        flex items-center justify-center gap-2
        transition-all duration-200
        press-effect
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={18} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={18} />}
    </button>
  );
}
