import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isValidPassword = (password: string) => {
  const minLength = 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  return password.length >= minLength && hasUpper && hasDigit;
};
