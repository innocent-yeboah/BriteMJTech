import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
  as: Component = "div",
}: {
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
}) {
  return (
    <Component className={cn("container", className)}>{children}</Component>
  );
}
