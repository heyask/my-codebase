import * as React from 'react';

import { cn } from '@my-workspace/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, wrapperClassName, type, ...props }, ref) => {
    return (
      <div
        className={cn(
          'flex items-center justify-center h-9 rounded-md box-border shadow-sm transition-colors border border-input bg-transparent ring-offset-background focus-within:ring-1 focus-within:ring-ring data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50',
          wrapperClassName
        )}
      >
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
