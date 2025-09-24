"use client"

import { useState } from "react"
import { Item, Friend } from "@/types"
import FriendAvatar from "@/components/friend-avatar"
import { AvatarGroup } from "@/components/ui/avatar"
import { cn, formatCurrency } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { addFriendsToItem } from "@/actions/item"

type ItemInfoProps = {
	item: Item
	currency: string
	allFriends: Friend[]
	onFriendsUpdated?: (itemId: number, newFriends: Friend[]) => void
}

// Helper: Calculate total price for the item
function getItemTotalPrice(item: Item) {
	const hasVariations = item.variation && item.variation.length > 0
	if (hasVariations) {
		// If any variation has a price > 0, sum all variation prices
		const anyVariationHasPrice = item.variation.some(v => v.price > 0)
		if (anyVariationHasPrice) {
			return item.variation.reduce((sum, v) => sum + v.price, 0) * item.quantity
		}
		// All variations are zero, fallback to unit_price
		return item.unit_price * item.quantity
	}
	return item.unit_price * item.quantity
}

export default function ItemInfo({ item, currency, allFriends, onFriendsUpdated }: ItemInfoProps) {
	const hasVariations = item.variation && item.variation.length > 0
	const anyVariationHasPrice = hasVariations && item.variation.some(v => v.price > 0)

	const totalPrice = getItemTotalPrice(item)

	const [dialogOpen, setDialogOpen] = useState(false)
	const [selectedFriendIds, setSelectedFriendIds] = useState<number[]>(item.friends?.map(f => f.id) || [])
	const [submitting, setSubmitting] = useState(false)

	const handleFriendToggle = (friendId: number) => {
		setSelectedFriendIds(prev =>
			prev.includes(friendId)
				? prev.filter(id => id !== friendId)
				: [...prev, friendId]
		)
	}

	const handleSaveFriends = async () => {
		setSubmitting(true)
		const res = await addFriendsToItem(item.item_id, selectedFriendIds)
		setSubmitting(false)
		if (res.success && onFriendsUpdated) {
			const newFriends = allFriends.filter(f => selectedFriendIds.includes(f.id))
			onFriendsUpdated(item.item_id, newFriends)
		}
		setDialogOpen(false)
	}

	return (
		<div className="border-b border-dotted border-gray-300 pb-3 last:border-b-0">
			{/* Item name and total */}
			<div className="flex justify-between items-start gap-2">
				<div className="flex-1">
					<div className="flex items-center gap-2">
						{item.quantity > 1 && (
							<span className="font-mono font-semibold text-gray-600 bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center text-xs">
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
								{/* 
									Logic:
									- If any variation has price > 0, show v.price (should only show price for those with price > 0, others show 0)
									- If all variations are zero, show 0 for all (but main price comes from unit_price)
								*/}
								{anyVariationHasPrice
									? <>
										{formatCurrency(v.price, currency)}
										{item.quantity > 1 && ` × ${item.quantity}`}
									</>
									: <>
										{formatCurrency(0, currency)}
										{item.quantity > 1 && ` × ${item.quantity}`}
									</>
								}
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
			<div className="mt-3 ml-8 flex items-center gap-2 text-xs text-gray-500">
				<span className="uppercase tracking-wide font-semibold">Shared with:</span>
				<AvatarGroup>
					{item.friends && item.friends.length > 0
						? item.friends.map(friend => (
							<FriendAvatar key={friend.id} friend={friend} />
						))
						: <span className="italic text-gray-400">No friends</span>
					}
				</AvatarGroup>
				<span className="font-medium">
					{item.friends && item.friends.length > 0
						? item.friends.map(friend => friend.name).join(", ")
						: "—"
					}
				</span>
				<Button
					variant="ghost"
					size="sm"
					className="ml-2 px-2 py-1 text-xs"
					onClick={() => setDialogOpen(true)}
					type="button"
				>
					Edit
				</Button>
			</div>

			{/* Dialog for editing friends */}
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Edit Friends for &quot;{item.item_name}&quot;</DialogTitle>
					</DialogHeader>
					<div className="space-y-2 mt-2">
						{allFriends.length === 0 && (
							<div className="text-sm text-gray-400">No friends available.</div>
						)}
						{allFriends.map(friend => (
							<label
								key={friend.id}
								className={cn(
									"flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition-colors",
									selectedFriendIds.includes(friend.id)
										? "bg-gray-100"
										: "hover:bg-gray-50"
								)}
							>
								<input
									type="checkbox"
									checked={selectedFriendIds.includes(friend.id)}
									onChange={() => handleFriendToggle(friend.id)}
									className="accent-primary"
								/>
								<FriendAvatar friend={friend} />
								<span className="ml-2">{friend.name}</span>
							</label>
						))}
					</div>
					<DialogFooter>
						<Button
							variant="secondary"
							onClick={() => setDialogOpen(false)}
							type="button"
							disabled={submitting}
						>
							Cancel
						</Button>
						<Button
							onClick={handleSaveFriends}
							disabled={submitting}
							type="button"
						>
							Save
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}