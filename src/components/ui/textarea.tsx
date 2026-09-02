import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full resize-none rounded-2xl bg-card px-4 py-3 text-sm text-foreground outline-none hairline placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-primary/50",
        className,
      )}
      {...props}
    />
  );
}
