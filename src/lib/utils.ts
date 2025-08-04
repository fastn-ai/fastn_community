import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Tag color utility function
export function getTagColor(tag: string): string {
  // Create a simple hash from the tag string to ensure consistent colors
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    const char = tag.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use the hash to select from a predefined set of colors
  const colors = [
    "bg-blue-100 text-blue-800 border-blue-200",
    "bg-green-100 text-green-800 border-green-200", 
    "bg-purple-100 text-purple-800 border-purple-200",
    "bg-orange-100 text-orange-800 border-orange-200",
    "bg-pink-100 text-pink-800 border-pink-200",
    "bg-indigo-100 text-indigo-800 border-indigo-200",
    "bg-teal-100 text-teal-800 border-teal-200",
    "bg-red-100 text-red-800 border-red-200",
    "bg-yellow-100 text-yellow-800 border-yellow-200",
    "bg-emerald-100 text-emerald-800 border-emerald-200",
    "bg-cyan-100 text-cyan-800 border-cyan-200",
    "bg-violet-100 text-violet-800 border-violet-200",
  ];
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}
