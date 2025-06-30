import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone; // Return original if not 10 digits
}

export function getCurrentDayHours(hours: Record<string, string> | null): string | null {
  if (!hours) return null;
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[new Date().getDay()];
  
  return hours[today] || null;
}

export function isBusinessOpen(hours: Record<string, string> | null): boolean {
  const todayHours = getCurrentDayHours(hours);
  if (!todayHours || todayHours.toLowerCase() === 'closed') return false;
  
  // Simple check - in real app would parse actual times
  return todayHours !== 'Closed';
}
