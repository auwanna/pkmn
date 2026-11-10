import { IconLoader } from "@tabler/icons-react";
import type React from "react";
import { cn } from "@/cva";

export function Spinner({
  className,
  ...props
}: React.ComponentProps<typeof IconLoader>): React.ReactElement {
  return (
    <IconLoader
      aria-label="Loading"
      className={cn("animate-spin", className)}
      role="status"
      {...props}
    />
  );
}
