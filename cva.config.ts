import { defineConfig, type VariantProps } from "cva/config";
import { cn as merge } from "cn";

export const { cva, cx: cn } = defineConfig({ cx: merge });
export type { VariantProps };
