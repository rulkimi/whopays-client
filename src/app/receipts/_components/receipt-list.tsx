"use client"

import {
	Section,
	SectionHeader,
	SectionTitle,
	SectionContent,
} from "@/components/layout/section-layout";
import ReceiptCard from "./receipt-card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { Receipt } from "@/types";

type ReceiptListProps = {
	receipts: Receipt[];
	href?: string;
};

export default function ReceiptList({ receipts, href = "" }: ReceiptListProps) {
	return (
		<Section>
			<SectionHeader className="flex justify-between gap-1">
				<SectionTitle>Receipts</SectionTitle>
				<Link
					href={href}
					className={cn(
						"flex items-center gap-1 rounded-md",
						"text-primary font-medium text-sm",
						"active:bg-muted/60 active:opacity-80 transition",
						"select-none tap-transparent",
						"tracking-[0] uppercase",
						"ios-link-shadow",
						!href && "opacity-0 pointer-events-none"
					)}
					style={{
						WebkitTapHighlightColor: "transparent",
					}}
				>
					<span className="pr-0.5">All receipts</span>
					<ChevronRight className="w-4 h-4 text-primary" />
				</Link>
			</SectionHeader>
			<SectionContent>
				{receipts.map((receipt, idx) => (
					<ReceiptCard
						key={receipt.id}
						index={idx}
						length={receipts.length}
						receipt={receipt}
					/>
				))}
			</SectionContent>
		</Section>
	);
}