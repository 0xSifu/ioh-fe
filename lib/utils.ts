import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRandomPassword() {
  const length = 10;
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numericChars = "0123456789";
  const specialChars = "!@#$%^&*()_+-={}[];',./<>?~`|:\"\\";

  let password = "";

  // Add one uppercase letter
  password += uppercaseChars.charAt(
    Math.floor(Math.random() * uppercaseChars.length)
  );

  // Add one numeric digit
  password += numericChars.charAt(
    Math.floor(Math.random() * numericChars.length)
  );

  // Add at least one special character
  password += specialChars.charAt(
    Math.floor(Math.random() * specialChars.length)
  );

  // Add remaining characters randomly
  const remainingChars =
    uppercaseChars + uppercaseChars.toLowerCase() + numericChars + specialChars;
  for (let i = 3; i < length; i++) {
    password += remainingChars.charAt(
      Math.floor(Math.random() * remainingChars.length)
    );
  }

  // Shuffle the password to make it more random
  password = password
    .split("")
    .sort(function () {
      return 0.5 - Math.random();
    })
    .join("");

  return password;
}

export async function safeAsync<T = unknown>(
  promise: Promise<T>,
): Promise<{ success: true; data: T } | { success: false; error: any }> {
  try {
    const data = await promise;
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
}

export function safeSync<T = unknown>(
  operation: () => T,
): { success: true; data: T } | { success: false; error: any } {
  try {
    const data = operation();
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
}

export const sleep = (timeout: number) => {
  return new Promise<void>((resolve) => setTimeout(resolve, timeout));
};