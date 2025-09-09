"use client"

import FriendAvatar from "@/components/friend-avatar";
import { Section, SectionContent, SectionHeader, SectionTitle } from "@/components/layout/section-layout";
import { AvatarGroup } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Friend } from "@/types";
import { ChevronRight, CirclePlus } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTrigger,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import AddFriendForm from "./add-friend-form";

export default function HomeFriendsList({
	friends
}: {
	friends: Friend[];
}) {
	return (
		<Section>
			<SectionHeader className="flex justify-between gap-1">
				<SectionTitle>Friends</SectionTitle>
				<Link
					href="/friends"
					className={cn(
						"flex items-center gap-1 rounded-md",
						"text-primary font-medium text-sm",
						"active:bg-muted/60 active:opacity-80 transition",
						"select-none tap-transparent",
						"tracking-[0] uppercase",
						"ios-link-shadow",
					)}
					style={{
						WebkitTapHighlightColor: "transparent",
					}}
				>
					<span className="pr-0.5">All friends</span>
					<ChevronRight className="w-4 h-4 text-primary" />
				</Link>
			</SectionHeader>
			<SectionContent>
				<Card>
					<CardContent>
						<div className="flex items-center gap-2">
							<Dialog>
								<DialogTrigger asChild>
									<button
										type="button"
										className={cn(
											"flex items-center justify-center rounded-md",
											"text-primary font-medium text-sm",
											"active:bg-muted/60 active:opacity-80 transition",
											"select-none tap-transparent",
											"w-8 h-8",
											"ios-link-shadow"
										)}
										style={{
											WebkitTapHighlightColor: "transparent",
										}}
										aria-label="Add friend"
									>
										<CirclePlus className="size-12" />
									</button>
								</DialogTrigger>
								<DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Friend</DialogTitle>
                  </DialogHeader>
                  <AddFriendForm />
								</DialogContent>
							</Dialog>
							<AvatarGroup>
								{friends.map((friend) => (
									<FriendAvatar key={friend.id} friend={friend} />
								))}
							</AvatarGroup>
						</div>
					</CardContent>
				</Card>
			</SectionContent>
		</Section>
	)
}