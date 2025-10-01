"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteReceipt } from "@/actions/receipt"
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction,
} from "@/components/ui/alert-dialog"

type DeleteReceiptButtonProps = {
	receiptId: number
	onDeleted?: () => void
}

export default function DeleteReceiptButton({ receiptId, onDeleted }: DeleteReceiptButtonProps) {
	const [isPending, startTransition] = useTransition()
	const [error, setError] = useState<string | null>(null)
	const [open, setOpen] = useState(false)

	const handleDelete = () => {
		setError(null)
		startTransition(async () => {
			try {
				await deleteReceipt(receiptId)
				setOpen(false)
				if (onDeleted) onDeleted()
				else window.location.reload()
			} catch (err) {
				setError((err && typeof err === "object" && "message" in err) ? (err as { message?: string }).message || "Failed to delete receipt." : "Failed to delete receipt.")
			}
		})
	}

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button
					variant="outline"
					size="icon"
					className="text-destructive border-destructive hover:bg-destructive/10"
					aria-label="Delete receipt"
					disabled={isPending}
				>
					<Trash2 className="w-5 h-5" />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Receipt?</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete this receipt? This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				{error && (
					<div className="mb-2 text-sm text-destructive">{error}</div>
				)}
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
					<AlertDialogAction
						asChild
					>
						<Button
							variant="destructive"
							onClick={handleDelete}
							disabled={isPending}
						>
							{isPending ? "Deleting..." : "Delete"}
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
