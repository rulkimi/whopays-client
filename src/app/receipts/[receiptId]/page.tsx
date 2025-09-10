import { fetchReceiptById } from "@/actions/receipt";
import {
	PageContent,
	PageHeader,
	PageLayout,
	PageTitle,
} from "@/components/layout/page-layout";
import { cn, formatCurrency, formatDateTime } from "@/lib/utils";
import { Users } from "lucide-react";
import FriendAvatar from "@/components/friend-avatar";
import { AvatarGroup } from "@/components/ui/avatar";
import ItemInfo from "./_components/item-info";
import ReceiptImage from "./_components/receipt-image";
import { Item } from "@/types";

export default async function ReceiptPage({
	params,
}: {
	params: { receiptId: string };
}) {
	const { receiptId } = params;
	const receipt = await fetchReceiptById(receiptId);

	const persons =
		receipt.friends.length === 0
			? "Just you"
			: `${receipt.friends.length} ${receipt.friends.length === 1 ? "person" : "persons"}`;

	return (
		<PageLayout>
			<PageHeader backHref="/receipts">
				<PageTitle>Receipt</PageTitle>
			</PageHeader>
			<PageContent>
				<div
					className={cn(
						"mx-auto max-w-3xl w-full bg-white border border-dashed border-gray-300 rounded-[20px] shadow-xl relative overflow-hidden",
						"before:content-[''] before:absolute before:inset-0 before:bg-[repeating-linear-gradient(135deg,#fafafa_0px,#fafafa_6px,#f8f8f8_6px,#f8f8f8_12px)] before:opacity-60 before:pointer-events-none"
					)}
					style={{
						fontFamily: "'SF Mono', 'Monaco', 'Consolas', 'monospace', 'SF Pro Display', sans-serif",
						boxShadow: "0 8px 40px 0 rgba(0,0,0,0.12), 0 2px 8px 0 rgba(0,0,0,0.08)",
						padding: "0 0 28px 0",
					}}
				>
					{/* Receipt Top Perforation */}
					<div className="absolute left-0 right-0 top-0 flex justify-between z-10 px-2">
						{Array.from({ length: 20 }).map((_, i) => (
							<div
								key={i}
								className="w-2 h-2 bg-white rounded-full border border-gray-300 -mt-1 shadow-sm"
								style={{ marginLeft: i === 0 ? 0 : -1.5 }}
							/>
						))}
					</div>
					{/* Receipt Bottom Perforation */}
					<div className="absolute left-0 right-0 bottom-0 flex justify-between z-10 px-2">
						{Array.from({ length: 20 }).map((_, i) => (
							<div
								key={i}
								className="w-2 h-2 bg-white rounded-full border border-gray-300 -mb-1 shadow-sm"
								style={{ marginLeft: i === 0 ? 0 : -1.5 }}
							/>
						))}
					</div>
					{/* Main Content */}
					<div className="relative z-20 px-8 pt-10 pb-4 flex flex-col gap-5">
						{/* Header */}
						<div className="flex flex-col items-center gap-2 border-b border-dashed border-gray-300 pb-4">
							<span className="text-xl font-bold tracking-widest uppercase text-gray-900">
								{receipt.restaurant_name}
							</span>
							<span className="text-sm text-gray-500 tracking-wide font-mono">
								{formatDateTime(receipt.created_at)}
							</span>
						</div>
						
						{/* People Info */}
						<div className="flex items-center justify-center gap-3 text-sm text-gray-600">
							<Users className="size-4" />
							<span className="font-medium">{persons}</span>
							{receipt.friends.length > 0 && (
								<AvatarGroup>
									{receipt.friends.map(friend => (
										<FriendAvatar key={friend.id} friend={friend} />
									))}
								</AvatarGroup>
							)}
						</div>
						
						{/* Items List */}
						{receipt.items && receipt.items.length > 0 && (
							<div className="flex flex-col gap-3">
								<div className="font-semibold text-lg text-gray-800 tracking-wide text-center border-b border-dashed border-gray-300 pb-2">
									ITEMS ORDERED
								</div>
								<div className="flex flex-col gap-3">
									{receipt.items.map((item: Item) => (
										<ItemInfo key={item.item_id} item={item} currency={receipt.currency} />
									))}
								</div>
							</div>
						)}
						
						{/* Subtotal Section */}
						<div className="border-t-2 border-dashed border-gray-400 pt-4">
							<div className="flex flex-col gap-2 text-sm font-mono">
								{/* Subtotal calculation */}
								{receipt.items && receipt.items.length > 0 && (
									<div className="flex justify-between">
										<span className="text-gray-600 uppercase tracking-wide">Subtotal</span>
										<span className="tabular-nums font-semibold">
											{formatCurrency(
												receipt.total_amount - receipt.service_charge - receipt.tax,
												receipt.currency
											)}
										</span>
									</div>
								)}
								<div className="flex justify-between">
									<span className="text-gray-600 uppercase tracking-wide">Service Charge</span>
									<span className="tabular-nums font-semibold">
										{formatCurrency(receipt.service_charge, receipt.currency)}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600 uppercase tracking-wide">Tax</span>
									<span className="tabular-nums font-semibold">
										{formatCurrency(receipt.tax, receipt.currency)}
									</span>
								</div>
								<div className="border-t border-dashed border-gray-400 pt-3 mt-2">
									<div className="flex justify-between font-bold text-xl">
										<span className="tracking-widest uppercase text-gray-900">Total</span>
										<span className="tabular-nums text-primary">
											{formatCurrency(receipt.total_amount, receipt.currency)}
										</span>
									</div>
								</div>
							</div>
						</div>
						
						{/* Receipt Image */}
						{receipt.receipt_url && (
							<ReceiptImage 
								receiptUrl={receipt.receipt_url} 
								restaurantName={receipt.restaurant_name}
							/>
						)}
						
						{/* Footer */}
						<div className="mt-8 text-center text-xs text-gray-400 tracking-widest uppercase border-t border-dashed border-gray-300 pt-4">
							Thank you for dining with us!
							<br />
							<span className="text-xs font-mono mt-1 block">Receipt #{receiptId.slice(0, 8)}</span>
						</div>
					</div>
				</div>
			</PageContent>
		</PageLayout>
	);
}