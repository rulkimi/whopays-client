import { ApiResponse } from "@/types/api-responses";

/**
 * Extracts a safe and descriptive error message from any thrown error,
 * and returns a typed error response.
 */
export function getErrorResponse<T>(error: unknown): ApiResponse<T> {
  let message = "An unknown error occurred.";

  if (typeof error === "string") {
    message = error;
  } else if (error instanceof Error) {
    message = error.message || message;
  } else if (error && typeof error === 'object' && 'message' in error) {
    // For cases like errors thrown by libraries that have custom shapes
    const msg = (error as { message?: string }).message;
    if (typeof msg === "string") message = msg;
  }

  return {
    success: false,
    message,
    data: undefined as unknown as T,
  };
}
