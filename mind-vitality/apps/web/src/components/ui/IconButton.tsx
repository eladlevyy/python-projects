'use client';

// Temporary stub component for IconButton
// Will be properly implemented in packages/ui in task 2
interface IconButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  'aria-label': string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export function IconButton({ 
  children, 
  onClick, 
  'aria-label': ariaLabel,
  variant = 'ghost', 
  size = 'md', 
  disabled = false,
  className = '' 
}: IconButtonProps) {
  const baseClasses = 'tap-target inline-flex items-center justify-center rounded-xl focus-visible-only transition-all duration-200';
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 disabled:bg-gray-300',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:bg-gray-100',
    ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:text-gray-300'
  };
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-11 h-11 text-base', // 44px minimum tap target
    lg: 'w-12 h-12 text-lg'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
}
