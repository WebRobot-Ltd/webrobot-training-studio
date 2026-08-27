'use client';

// Minimal, accessible, self-contained button. Replaces the host app's `@/app/ui/button` so the
// package pulls in no app UI kit (and no clsx). Tailwind utility classes are used because the
// intended hosts render Tailwind, matching the rest of the wizard's styling.
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
}

const VARIANT: Record<ButtonVariant, string> = {
  default: 'bg-purple-600 text-white hover:bg-purple-700 focus-visible:outline-purple-500',
  destructive: 'bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-500',
  outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus-visible:outline-gray-500',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:outline-gray-500',
  ghost: 'text-gray-700 hover:bg-gray-100 focus-visible:outline-gray-500',
  link: 'text-purple-600 underline-offset-4 hover:underline focus-visible:outline-purple-500',
};

export function Button({ children, className = '', variant = 'default', type = 'button', ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      className={[
        'inline-flex h-10 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        VARIANT[variant],
        className,
      ].join(' ')}
    >
      {children}
    </button>
  );
}

export default Button;
