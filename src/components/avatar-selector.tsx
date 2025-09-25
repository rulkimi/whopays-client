"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { avatarOptions } from "@/lib/avatars";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AvatartBuilder from "./avatar-builder";

interface AvatarSelectorProps {
	selectedAvatarId?: string;
	onSelect: (avatarId: string) => void;
	className?: string;
}

export default function AvatarSelector({
	selectedAvatarId,
	onSelect,
	className,
}: AvatarSelectorProps) {
	const [dialogOpen, setDialogOpen] = useState(false);

	return (
		<div className={cn("space-y-3", className)}>
			<div className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
				Choose an avatar
			</div>
			<div className="grid grid-cols-5 gap-3">
				{/* + Create Avatar button as the first element */}
				<button
					type="button"
					onClick={() => setDialogOpen(true)}
					className={cn(
						"relative aspect-square rounded-full border-2 border-dashed border-primary/60 flex flex-col items-center justify-center transition-all duration-200 bg-primary/5 hover:bg-primary/10 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
					)}
					aria-label="Create new avatar"
				>
					<span className="text-2xl font-bold text-primary">+</span>
					<span className="text-[10px] font-medium text-primary mt-0.5">Create</span>
				</button>
				{avatarOptions.map((avatar) => (
					<button
						key={avatar.id}
						type="button"
						onClick={() => onSelect(avatar.id)}
						className={cn(
							"relative aspect-square rounded-full overflow-hidden border-2 transition-all duration-200",
							"hover:scale-105 active:scale-95",
							"focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
							selectedAvatarId === avatar.id
								? "border-primary ring-2 ring-primary ring-offset-2"
								: "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
						)}
					>
						<Image
							src={avatar.src}
							alt={avatar.name}
							fill
							className="object-cover"
							sizes="(max-width: 768px) 60px, 60px"
						/>
						{selectedAvatarId === avatar.id && (
							<div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
								<div className="w-4 h-4 rounded-full bg-primary" />
							</div>
						)}
					</button>
				))}
			</div>
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create Avatar</DialogTitle>
					</DialogHeader>
					<div className="py-4 text-center text-sm text-muted-foreground">
						{/* You can place your create avatar form or instructions here */}
						{/* To create a custom avatar, please upload a photo or use the form above. */}
            <AvatartBuilder />
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setDialogOpen(false)}>
							Close
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
