"use client";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

export default function ShareButton({ title }: { title: string }) {
  async function onShare() {
    const shareData: ShareData = {
      title,
      url: typeof window !== "undefined" ? window.location.href : undefined,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url || "");
        // optionally toast
      }
    } catch (e) {
      // noop
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={onShare} className="gap-2">
      <Share2 className="size-4" /> Share
    </Button>
  );
}
