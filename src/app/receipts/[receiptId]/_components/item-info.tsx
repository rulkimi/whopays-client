import { Item } from "@/types";
import FriendAvatar from "@/components/friend-avatar";
import { AvatarGroup } from "@/components/ui/avatar";
import { cn, formatCurrency } from "@/lib/utils";

type ItemInfoProps = {
	item: Item;
	currency: string;
};

export default function ItemInfo({ item, currency }: ItemInfoProps) {
	const hasVariations = item.variation && item.variation.length > 0;

	// Calculate total price
	const totalPrice = hasVariations
		? item.variation.reduce((sum, v) => sum + v.price, 0) * item.quantity
		: item.unit_price * item.quantity;

	return (
		<div className="border-b border-dotted border-gray-300 pb-3 last:border-b-0">
			{/* Item name and total */}
			<div className="flex justify-between items-start gap-2">
				<div className="flex-1">
					<div className="flex items-center gap-2">
						{item.quantity > 1 && (
							<span className="text-sm font-mono font-semibold text-gray-600 bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center text-xs">
								{item.quantity}
							</span>
						)}
						<span className="font-semibold text-gray-900 text-base leading-tight">
							{item.item_name}
						</span>
					</div>
				</div>
				<div className="text-right">
					<div className="font-bold text-base text-gray-900 font-mono tabular-nums">
						{formatCurrency(totalPrice, currency)}
					</div>
				</div>
			</div>

			{/* Variations or unit price details */}
			{hasVariations ? (
				<div className="mt-2 ml-8 text-sm text-gray-600 space-y-1">
					{item.variation.map((v, idx) => (
						<div key={idx} className="flex justify-between font-mono">
							<span className="text-gray-500">• {v.variation_name}</span>
							<span className="tabular-nums">
								{formatCurrency(v.price, currency)}
								{item.quantity > 1 && ` × ${item.quantity}`}
							</span>
						</div>
					))}
				</div>
			) : (
				item.quantity > 1 && (
					<div className="mt-1 ml-8 text-sm text-gray-500 font-mono">
						{formatCurrency(item.unit_price, currency)} × {item.quantity}
					</div>
				)
			)}

			{/* Shared with friends */}
			{item.friends && item.friends.length > 0 && (
				<div className="mt-3 ml-8 flex items-center gap-2 text-xs text-gray-500">
					<span className="uppercase tracking-wide font-semibold">Shared with:</span>
					<AvatarGroup>
						{item.friends.map(friend => (
							<FriendAvatar key={friend.id} friend={friend} />
						))}
					</AvatarGroup>
					<span className="font-medium">
						{item.friends.map(friend => friend.name).join(", ")}
					</span>
				</div>
			)}
		</div>
	);
}