"use client";

import { useState } from "react";
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

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-end gap-2">
        <SplitViewToggle initialMode={mode} onChange={setMode} />
        <ShareButton title={`Split for ${receipt.restaurant_name}`} />
      </div>
      <SplitSummary splits={splits} />
      <SplitPerFriend splits={splits} showItems={mode === "detailed"} />
      {mode === "detailed" && <SplitItems splits={splits} />}
    </div>
  );
}
