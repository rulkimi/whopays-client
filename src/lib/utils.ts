import { Base64File } from "@/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = "USD", locale: string = "en-US"): string {
	let formatted: string;
	try {
		formatted = new Intl.NumberFormat(locale, {
			style: "currency",
			currency,
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(amount);
	} catch {
		// If invalid currency, fallback to MYR
		formatted = new Intl.NumberFormat(locale, {
			style: "currency",
			currency: "MYR",
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
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
	if (typeof File === "undefined" || typeof FileReader === "undefined" || !(file instanceof Object)) {
		throw new ReferenceError("File or FileReader is not defined in this environment.");
	}
	const reader = new (globalThis.FileReader || (require && require('filereader')))();
	reader.onloadend = () => {
		const base64String = reader.result as string;
		const result: Base64FileResult = {
			name: file.name,
			type: file.type,
			size: file.size,
			lastModified: file.lastModified,
			base64: base64String,
		};
		callback(result);
	};
	// @ts-ignore
	if (typeof reader.readAsDataURL === "function") {
		// @ts-ignore
		reader.readAsDataURL(file);
	} else {
		throw new ReferenceError("readAsDataURL is not available in this environment.");
	}
};

export function base64ToFile(base64File: Base64File) {
	const arr = base64File.base64.split(',');
	const mime = arr[0].match(/:(.*?);/)?.[1] || '';
	const bstr = atob(arr[1]);
	let n = bstr.length;
	const u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new File([u8arr], base64File.name, {
		type: mime,
		lastModified: base64File.lastModified
	});
}
