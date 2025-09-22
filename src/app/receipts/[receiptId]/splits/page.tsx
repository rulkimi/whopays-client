import { fetchReceiptById, fetchReceiptSplits } from "@/actions/receipt";
import {
	PageContent,
	PageHeader,
	PageLayout,
	PageTitle,
} from "@/components/layout/page-layout";
import { cn, formatCurrency, formatDateTime } from "@/lib/utils";
import FriendAvatar from "@/components/friend-avatar";
import { AvatarGroup } from "@/components/ui/avatar";
import { Users } from "lucide-react";

export default async function ReceiptSplitsPage({
	params,
}: {
	params: Promise<{ receiptId: string }>;
}) {
	const { receiptId } = await params;
	const receipt = await fetchReceiptById(receiptId);
	const splits = await fetchReceiptSplits(receiptId);

	return (
		<PageLayout>
			<PageHeader backHref={`/receipts/${receiptId}`}>
				<PageTitle>Split Bill</PageTitle>
			</PageHeader>
			<PageContent>
				<div
					className={cn(
						"mx-auto max-w-3xl w-full bg-white border border-dashed border-gray-300 rounded-[20px] shadow-sm relative overflow-hidden",
						"before:content-[''] before:absolute before:inset-0 before:bg-[repeating-linear-gradient(135deg,#fafafa_0px,#fafafa_6px,#f8f8f8_6px,#f8f8f8_12px)] before:opacity-60 before:pointer-events-none"
					)}
					style={{
						fontFamily: "'SF Mono', 'Monaco', 'Consolas', 'monospace', 'SF Pro Display', sans-serif",
						padding: "0 0 28px 0",
					}}
				>
					{/* Header */}
					<div className="relative z-20 px-8 pt-10 pb-4 flex flex-col gap-5">
						<div className="flex flex-col items-center gap-2 border-b border-dashed border-gray-300 pb-4">
							<span className="text-xl font-bold tracking-widest uppercase text-gray-900">
								{receipt.restaurant_name}
							</span>
							<span className="text-sm text-gray-500 tracking-wide font-mono">
								{formatDateTime(receipt.created_at)}
							</span>
							<div className="flex items-center justify-center gap-3 text-sm text-gray-600">
								<Users className="size-4" />
								<span className="font-medium">
									{receipt.friends.length} {receipt.friends.length === 1 ? "person" : "persons"}
								</span>
								{receipt.friends.length > 0 && (
									<AvatarGroup>
										{receipt.friends.map(friend => (
											<FriendAvatar key={friend.id} friend={friend} />
										))}
									</AvatarGroup>
								)}
							</div>

              {/* Summary */}
              <div className="border-t-2 border-dashed border-gray-400 pt-4">
                <div className="font-semibold text-lg text-gray-800 tracking-wide text-center border-b border-dashed border-gray-300 pb-2">
                  SUMMARY
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-600 uppercase tracking-wide">Subtotal</span>
                    <span className="tabular-nums font-semibold">{formatCurrency(splits.summary.subtotal, splits.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 uppercase tracking-wide">Tax</span>
                    <span className="tabular-nums font-semibold">{formatCurrency(splits.summary.tax, splits.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 uppercase tracking-wide">Service Charge</span>
                    <span className="tabular-nums font-semibold">{formatCurrency(splits.summary.service_charge, splits.currency)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="tracking-widest uppercase text-gray-900">Total</span>
                    <span className="tabular-nums text-primary">{formatCurrency(splits.summary.total, splits.currency)}</span>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500 text-center font-mono">{splits.note}</div>
              </div>

              {/* Per-friend totals with items */}
              <div className="border-t-2 border-dashed border-gray-400 pt-6">
                <div className="font-semibold text-lg text-gray-800 tracking-wide text-center border-b border-dashed border-gray-300 pb-2">
                  PER-FRIEND TOTALS
                </div>
                <div className="mt-4 flex flex-col gap-4">
                  {splits.totals.map(friendTotal => (
                    <div key={friendTotal.id} className="border-b border-dotted border-gray-300 pb-3 last:border-b-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{friendTotal.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-base text-gray-900 font-mono tabular-nums">{formatCurrency(friendTotal.total, splits.currency)}</div>
                          <div className="text-[11px] text-gray-500 font-mono tabular-nums">
                            {formatCurrency(friendTotal.subtotal, splits.currency)} + {formatCurrency(friendTotal.tax, splits.currency)} + {formatCurrency(friendTotal.service_charge, splits.currency)}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 ml-2 text-sm text-gray-700">
                        {friendTotal.items.map(it => (
                          <div key={`${friendTotal.id}-${it.item_id}`} className="flex justify-between font-mono">
                            <span className="text-gray-600">• {it.item_name} × {it.quantity}</span>
                            <span className="tabular-nums">{formatCurrency(it.share, splits.currency)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Overall items with friend shares */}
              <div className="border-t-2 border-dashed border-gray-400 pt-6">
                <div className="font-semibold text-lg text-gray-800 tracking-wide text-center border-b border-dashed border-gray-300 pb-2">
                  ITEMS
                </div>
                <div className="mt-3 flex flex-col gap-2">
                  {splits.items.map(item => (
                    <div key={item.item_id} className="border-b border-dotted border-gray-300 pb-2 last:border-b-0">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">{item.item_name}</span>
                        <span className="font-mono tabular-nums">{formatCurrency(item.line_total, splits.currency)}</span>
                      </div>
                      <div className="ml-2 mt-1 text-xs text-gray-600 font-mono">
                        {item.friends.map(f => (
                          <div key={`${item.item_id}-${f.id}`} className="flex justify-between">
                            <span>• {f.name}</span>
                            <span className="tabular-nums">{formatCurrency(f.share, splits.currency)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
			</PageContent>
		</PageLayout>
	);
}
