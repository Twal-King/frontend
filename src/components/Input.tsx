import { forwardRef } from 'react';
import { cn } from '../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-xs text-secondary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full bg-input border border-border rounded-xl px-4 py-2.5 text-sm text-primary',
            'placeholder:text-disabled outline-none',
            'focus:border-border-focus transition-colors',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';
