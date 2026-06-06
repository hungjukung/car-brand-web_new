import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n?: number, unit = ""): string {
  if (n == null) return "—";
  return `${n.toLocaleString()}${unit}`;
}
