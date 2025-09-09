"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, convertToBase64 } from "@/lib/utils";
import FriendAvatar from "@/components/friend-avatar";
import { uploadReceipt } from "@/actions/receipt";
import { Friend } from "@/types";

export default function UploadReceipt({
	friends
}: {
	friends: Friend[]
}) {
	const [open, setOpen] = useState(false);
	const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
	const [file, setFile] = useState<File | null>(null);

	const handleFriendToggle = (id: number) => {
		setSelectedFriends((prev) =>
			prev.includes(id)
				? prev.filter((fid) => fid !== id)
				: [...prev, id]
		);
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0]);
		}
	};



	const handleSubmit = () => {
		console.log("Selected friends:", selectedFriends);
		if (file) {
			convertToBase64(file, async (result) => {
				console.log("File metadata with base64:", result);
				// You can now use result as needed

        await uploadReceipt(result, selectedFriends);
				setOpen(false);
				setSelectedFriends([]);
				setFile(null);
			});
		} else {
			setOpen(false);
			setSelectedFriends([]);
			setFile(null);
		}
	};

	return (
		<>
			<div
				className="border border-dashed border-primary p-4 rounded-md text-primary cursor-pointer transition hover:bg-primary/10 hover:shadow-md flex items-center justify-center gap-2 select-none"
				style={{ WebkitTapHighlightColor: "transparent" }}
				tabIndex={0}
				role="button"
				aria-label="Upload Receipt"
				onClick={() => setOpen(true)}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") setOpen(true);
				}}
			>
				<Upload className="w-5 h-5 text-primary" />
				<span>Upload Receipt</span>
			</div>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Upload Receipt</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<Label className="mb-2 block">Add Friends</Label>
							<div className="flex flex-wrap gap-2">
								{friends.map((friend) => (
									<button
										type="button"
										key={friend.id}
										className={cn(
											"pl-1 pr-2 py-1 rounded-full border transition flex items-center gap-1",
											selectedFriends.includes(friend.id)
												? "bg-primary text-primary-foreground border-primary"
												: "bg-muted text-muted-foreground border-muted"
										)}
										onClick={() => handleFriendToggle(friend.id)}
									>
										<FriendAvatar friend={friend} />
										<span>{friend.name}</span>
									</button>
								))}
							</div>
						</div>
						<div>
							<Label htmlFor="receipt-upload" className="mb-2 block">
								Upload Image
							</Label>
							<Input
								id="receipt-upload"
								type="file"
								accept="image/*"
								onChange={handleFileChange}
							/>
							{file && (
								<div className="mt-2 text-sm text-muted-foreground">
									Selected: {file.name}
								</div>
							)}
						</div>
					</div>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline" type="button">
								Cancel
							</Button>
						</DialogClose>
						<Button
							type="button"
							onClick={handleSubmit}
							disabled={!file}
						>
							Submit
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}