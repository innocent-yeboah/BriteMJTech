import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "accent" | "outline" | "ghost" | "white";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-heading font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-700 text-white shadow-sm hover:bg-brand-800 hover:shadow-md active:scale-[0.98]",
  accent:
    "bg-accent text-white shadow-sm hover:bg-accent-600 hover:shadow-md active:scale-[0.98]",
  outline:
    "border-2 border-brand-700 text-brand-700 hover:bg-brand-700 hover:text-white",
  ghost: "text-brand-700 hover:bg-brand-50",
  white:
    "bg-white text-brand-800 shadow-sm hover:bg-brand-50 active:scale-[0.98]",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm md:text-base",
  lg: "px-7 py-3.5 text-base",
};

interface StyleProps {
  variant?: Variant;
  size?: Size;
}

function classesFor({ variant = "primary", size = "md" }: StyleProps, className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonAsButton = StyleProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = StyleProps & {
  href: string;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function Button(props: ButtonAsButton | ButtonAsLink) {
  if ("href" in props && props.href !== undefined) {
    const { href, external, variant, size, className, children } = props;
    const classes = classesFor({ variant, size }, className);
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  const { variant, size, className, children, ...rest } = props;
  return (
    <button className={classesFor({ variant, size }, className)} {...rest}>
      {children}
    </button>
  );
}
