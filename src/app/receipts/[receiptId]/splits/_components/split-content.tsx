"use client";

import { useState } from "react";
import { useToPng } from "@hugocxl/react-to-image";
import { Receipt, ReceiptSplitsResponse } from "@/types";
import SplitSummary from "./split-summary";
import SplitPerFriend from "./split-per-friend";
import SplitItems from "./split-items";
import ShareButton from "./share-button";
import SplitViewToggle from "./split-view-toggle";

type ViewMode = "simple" | "detailed";

export default function SplitContent({
  receipt,
  splits,
}: {
  receipt: Receipt;
  splits: ReceiptSplitsResponse;
}) {
  const [mode, setMode] = useState<ViewMode>("detailed");
  const [, convertToPng, hookRef] = useToPng<HTMLDivElement>({
    onError: () => {},
    onSuccess: async (dataUrl: string) => {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File(
        [blob],
        `${receipt.restaurant_name.replace(/\s+/g, "_")}.png`,
        { type: "image/png" }
      );
      try {
        const nav = navigator as Navigator & {
          canShare?: (data: ShareData & { files?: File[] }) => boolean;
          share?: (data: ShareData & { files?: File[] }) => Promise<void>;
        };
        if (nav.canShare && nav.canShare({ files: [file] })) {
          await nav.share?.({
            files: [file],
            title: `Split for ${receipt.restaurant_name}`,
          });
          return;
        }
      } catch {}
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${receipt.restaurant_name.replace(/\s+/g, "_")}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
  });

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-end gap-2">
        <SplitViewToggle initialMode={mode} onChange={setMode} />
        <ShareButton
          title={`Split for ${receipt.restaurant_name}`}
          mode={mode}
          receiptId={receipt.id}
          onShareImage={async () => {
            await convertToPng();
            return true;
          }}
        />
      </div>
      <div ref={hookRef} data-detailed={mode === "detailed"}>
        <SplitSummary splits={splits} />
        <SplitPerFriend splits={splits} showItems={mode === "detailed"} />
        {mode === "detailed" && <SplitItems splits={splits} />}
      </div>
    </div>
  );
}
