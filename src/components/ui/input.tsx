import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-xl bg-card px-4 text-sm text-foreground outline-none hairline placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-primary/50",
        className,
      )}
      {...props}
    />
  );
}
