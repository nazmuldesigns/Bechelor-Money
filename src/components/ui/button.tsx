import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "press inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-opacity duration-150 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground",
        solid: "bg-foreground text-background",
        ghost: "bg-transparent text-foreground hover:bg-card",
        outline: "hairline bg-transparent text-foreground",
        danger: "bg-danger text-danger-foreground",
        muted: "bg-card text-foreground",
      },
      size: {
        default: "h-12 rounded-xl px-5 text-sm",
        sm: "h-10 rounded-lg px-3.5 text-sm",
        lg: "h-14 rounded-2xl px-6 text-base",
        icon: "size-12 rounded-xl",
        pill: "h-9 rounded-full px-3.5 text-xs",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "default",
    },
  },
);

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
