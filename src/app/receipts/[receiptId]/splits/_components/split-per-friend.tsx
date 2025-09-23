"use client";

import FriendAvatar from "@/components/friend-avatar";
import { formatCurrency } from "@/lib/utils";
import { ReceiptSplitsResponse } from "@/types";

export default function SplitPerFriend({
  splits,
  showItems = true,
}: {
  splits: ReceiptSplitsResponse;
  showItems?: boolean;
}) {
  return (
    <div className="border-t-2 border-dashed border-gray-400 pt-6">
      <div className="font-semibold text-lg text-gray-800 tracking-wide text-center border-b border-dashed border-gray-300 pb-2">
        PER-FRIEND TOTALS
      </div>
      <div className="mt-4 flex flex-col gap-4">
        {splits.totals?.map((friendTotal) => (
          <div
            key={friendTotal.id}
            className="border-b border-dotted border-gray-300 pb-3 last:border-b-0"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FriendAvatar
                  friend={{
                    id: friendTotal.id,
                    name: friendTotal.name,
                    photo_url: friendTotal.photo_url || "",
                    user_id: 0,
                  }}
                />
                <span className="font-semibold text-gray-900">
                  {friendTotal.name}
                </span>
              </div>
              <div className="text-right">
                <div className="font-bold text-base text-gray-900 font-mono tabular-nums">
                  {formatCurrency(friendTotal.total, splits.currency)}
                </div>
                <div className="text-[11px] text-gray-500 font-mono tabular-nums">
                  {formatCurrency(friendTotal.subtotal, splits.currency)} +{" "}
                  {formatCurrency(friendTotal.tax, splits.currency)} +{" "}
                  {formatCurrency(friendTotal.service_charge, splits.currency)}
                </div>
              </div>
            </div>
            {showItems && (
              <div className="mt-2 ml-2 text-sm text-gray-700">
                {friendTotal.items.map((it) => (
                  <div
                    key={`${friendTotal.id}-${it.item_id}`}
                    className="flex justify-between font-mono"
                  >
                    <span className="text-gray-600">
                      • {it.item_name} × {it.quantity}
                    </span>
                    <span className="tabular-nums">
                      {formatCurrency(it.share, splits.currency)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
