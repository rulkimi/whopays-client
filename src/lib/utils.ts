import { Base64File } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  let formatted: string;
  try {
    formatted = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    // If invalid currency, fallback to MYR
    formatted = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "MYR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }
  return formatted;
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export interface Base64FileResult {
  name: string;
  type: string;
  size: number;
  lastModified: number;
  base64: string;
}

export const convertToBase64 = (
  file: { name: string; type: string; size: number; lastModified: number },
  callback: (result: Base64FileResult) => void
) => {
  console.log("convertToBase64 called with file:", file);

  if (
    typeof window === "undefined" ||
    typeof window.File === "undefined" ||
    typeof window.FileReader === "undefined" ||
    !(file instanceof Object)
  ) {
    console.error("File or FileReader is not defined in this environment.");
    throw new ReferenceError(
      "File or FileReader is not defined in this environment."
    );
  }
  const reader = new window.FileReader();
  console.log("FileReader initialized.");

  reader.onloadend = () => {
    const base64String = reader.result as string;
    console.log(
      "Base64 conversion complete. Base64 string length:",
      base64String?.length
    );

    const result: Base64FileResult = {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
      base64: base64String,
    };
    console.log("Base64FileResult constructed:", result);

    callback(result);
  };
  if (typeof reader.readAsDataURL === "function") {
    console.log("Calling reader.readAsDataURL...");
    reader.readAsDataURL(file as unknown as Blob);
  } else {
    console.error("readAsDataURL is not available in this environment.");
    throw new ReferenceError(
      "readAsDataURL is not available in this environment."
    );
  }
};

export function base64ToFile(base64File: Base64File) {
  const arr = base64File.base64.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], base64File.name, {
    type: mime,
    lastModified: base64File.lastModified,
  });
}

/**
 * Compresses an image file to reduce its size
 * @param file - The image file to compress
 * @param maxSizeMB - Maximum size in MB (default: 2)
 * @param maxWidth - Maximum width in pixels (default: 2000)
 * @param maxHeight - Maximum height in pixels (default: 2000)
 * @returns A Promise that resolves to the compressed File
 */
export async function compressImage(
  file: File,
  maxSizeMB: number = 2,
  maxWidth: number = 2000,
  maxHeight: number = 2000
): Promise<File> {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  // If file is already small enough, return as is
  if (file.size <= maxSizeBytes) {
    return file;
  }

  // Only compress image files
  if (!file.type.startsWith("image/")) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }

        // Create canvas and draw resized image
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Try different quality levels until we get under the max size
        const qualityLevels = [0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2];

        const tryCompress = (qualityIndex: number): void => {
          const quality = qualityLevels[qualityIndex];
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Failed to compress image"));
                return;
              }

              // If size is acceptable or we've tried all quality levels
              if (
                blob.size <= maxSizeBytes ||
                qualityIndex === qualityLevels.length - 1
              ) {
                const compressedFile = new File([blob], file.name, {
                  type: file.type || "image/jpeg",
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                // Try next lower quality level
                tryCompress(qualityIndex + 1);
              }
            },
            file.type || "image/jpeg",
            quality
          );
        };

        // Start with highest quality
        tryCompress(0);
      };
      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    reader.readAsDataURL(file);
  });
}
