import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'ref' | 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'
  > {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-600 hover:to-blue-700',
  secondary: 'bg-slate-900 text-white hover:bg-slate-800',
  outline: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
  danger: 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700'
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm gap-1.5',
  md: 'h-11 px-6 text-base gap-2',
  lg: 'h-13 px-8 text-lg gap-2.5'
};

/**
 * Primary interactive control used across Naviora. Wraps a native
 * <button> in motion.button for a subtle press/hover feel — every
 * button in the product should feel identical to the touch.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref}
        disabled={isDisabled}
        whileHover={isDisabled ? undefined : { scale: 1.02 }}
        whileTap={isDisabled ? undefined : { scale: 0.98 }}
        transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold',
          'shadow-sm transition-all duration-300 ease-out hover:shadow-xl',
          'hover:-translate-y-0.5 active:translate-y-0 active:scale-95',
          'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0',
          'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
