"use client";

import { formatCurrency } from "@/lib/utils";
import { ReceiptSplitsResponse } from "@/types";

export default function SplitItems({
  splits,
}: {
  splits: ReceiptSplitsResponse;
}) {
  return (
    <div className="border-t-2 border-dashed border-gray-400 pt-6">
      <div className="font-semibold text-lg text-gray-800 tracking-wide text-center border-b border-dashed border-gray-300 pb-2">
        ITEMS
      </div>
      <div className="mt-3 flex flex-col gap-2">
        {splits.items.map((item) => (
          <div
            key={item.item_id}
            className="border-b border-dotted border-gray-300 pb-2 last:border-b-0"
          >
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">
                {item.item_name}
              </span>
              <span className="font-mono tabular-nums">
                {formatCurrency(item.line_total, splits.currency)}
              </span>
            </div>
            <div className="ml-2 mt-1 text-xs text-gray-600 font-mono">
              {item.friends.map((f) => (
                <div
                  key={`${item.item_id}-${f.id}`}
                  className="flex justify-between"
                >
                  <span>• {f.name}</span>
                  <span className="tabular-nums">
                    {formatCurrency(f.share, splits.currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
