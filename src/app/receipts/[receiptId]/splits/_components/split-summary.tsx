"use client";

import { formatCurrency } from "@/lib/utils";
import { ReceiptSplitsResponse } from "@/types";

export default function SplitSummary({
  splits,
}: {
  splits: ReceiptSplitsResponse;
}) {
  return (
    <div className="border-t-2 border-dashed border-gray-400 pt-4">
      <div className="font-semibold text-lg text-gray-800 tracking-wide text-center border-b border-dashed border-gray-300 pb-2">
        SUMMARY
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm font-mono">
        <div className="flex justify-between">
          <span className="text-gray-600 uppercase tracking-wide">
            Subtotal
          </span>
          <span className="tabular-nums font-semibold">
            {formatCurrency(splits.summary.subtotal, splits.currency)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 uppercase tracking-wide">Tax</span>
          <span className="tabular-nums font-semibold">
            {formatCurrency(splits.summary.tax, splits.currency)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 uppercase tracking-wide">
            Service Charge
          </span>
          <span className="tabular-nums font-semibold">
            {formatCurrency(splits.summary.service_charge, splits.currency)}
          </span>
        </div>
        <div className="flex justify-between font-bold">
          <span className="tracking-widest uppercase text-gray-900">Total</span>
          <span className="tabular-nums text-primary">
            {formatCurrency(splits.summary.total, splits.currency)}
          </span>
        </div>
      </div>
      {splits.note && (
        <div className="mt-3 text-xs text-gray-500 text-center font-mono">
          {splits.note}
        </div>
      )}
    </div>
  );
}
