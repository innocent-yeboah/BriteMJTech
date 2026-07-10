import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-ink placeholder:text-slate-400 shadow-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 disabled:bg-slate-100 aria-[invalid=true]:border-accent aria-[invalid=true]:focus:ring-accent/30";

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cn(fieldBase, className)} {...props} />;
});

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(fieldBase, "min-h-[130px] resize-y", className)}
      {...props}
    />
  );
});

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className, children, ...props }, ref) {
  return (
    <select ref={ref} className={cn(fieldBase, "appearance-none", className)} {...props}>
      {children}
    </select>
  );
});

export function Label({
  htmlFor,
  children,
  required,
  className,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("mb-1.5 block text-sm font-semibold text-brand-950", className)}
    >
      {children}
      {required ? <span className="ml-0.5 text-accent">*</span> : null}
    </label>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1.5 text-sm font-medium text-accent">
      {message}
    </p>
  );
}
