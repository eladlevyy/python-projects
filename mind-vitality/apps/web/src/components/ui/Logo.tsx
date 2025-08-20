'use client';

// Temporary stub component for Logo
// Will be properly implemented in packages/ui in task 2
interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'text' | 'full';
  className?: string;
}

export function Logo({ 
  size = 'md', 
  variant = 'full',
  className = '' 
}: LogoProps) {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12'
  };

  return (
    <div className={`flex items-center ${className}`}>
      {/* Temporary logo - will be replaced with actual logo in task 2 */}
      <div 
        className={`${sizeClasses[size]} flex items-center text-primary-600 font-bold`}
        aria-label="Mind Vitality"
      >
        {variant === 'icon' ? (
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            MV
          </div>
        ) : variant === 'text' ? (
          <span className="text-xl">Mind Vitality</span>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              MV
            </div>
            <span className="text-xl">Mind Vitality</span>
          </div>
        )}
      </div>
    </div>
  );
}
