"use client";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
// no unused imports

export default function ShareButton({
  title,
  mode,
  receiptId,
  onShareImage,
}: {
  title: string;
  mode: "simple" | "detailed";
  receiptId: number;
  onShareImage?: () => Promise<boolean>;
}) {
  // removed unused helpers

  async function captureAndShare() {
    if (onShareImage) {
      const ok = await onShareImage();
      if (ok) return;
    }
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/api/og/receipts/${receiptId}/splits?mode=${mode}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      throw new Error("Failed to fetch share image");
    }
    const blob = await res.blob();
    const file = new File([blob], `${title.replace(/\s+/g, "_")}.png`, {
      type: "image/png",
    });

    try {
      const navAny = navigator as Navigator & {
        canShare?: (data: ShareData) => boolean;
        share?: (data: ShareData) => Promise<void>;
      };
      if (navAny.canShare && navAny.canShare({ files: [file] })) {
        await navAny.share?.({ files: [file], title });
        return;
      }
    } catch {}

    // Fallback: trigger download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${title.replace(/\s+/g, "_")}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={captureAndShare}
      className="gap-2"
    >
      <Share2 className="size-4" /> Share
    </Button>
  );
}
