"use client"

import React, { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft } from "lucide-react"
import PageTransition from "../motions/page-transition"

export function PageLayout({
	children,
	className,
}: {
	children: ReactNode
	className?: string
}) {
	return (
		<main
			className={cn(
				"min-h-screen flex flex-col bg-gradient-to-b from-background to-muted",
				className
			)}
		>
			{children}
		</main>
	)
}

export function PageHeader({
	children,
	className,
	backHref,
	backLabel = "Back",
}: {
	children: ReactNode
	className?: string
	backHref?: string
	backLabel?: string
}) {
	// Helper to check if a child is a PageTitle
	const getPageTitle = (children: ReactNode) => {
		let title = null;
		const rest: ReactNode[] = [];
		React.Children.forEach(children, (child) => {
			if (
				React.isValidElement(child) &&
				child.type &&
				(child.type as { displayName?: string }).displayName === "PageTitle"
			) {
				title = child;
			} else {
				rest.push(child);
			}
		});
		return { title, rest };
	};

	const { title, rest } = getPageTitle(children);

	return (
		<header
			className={cn(
				"sticky top-0 z-30 px-0 py-0 border-b bg-white/80 backdrop-blur-md flex items-center h-[56px] shadow-none border-border",
				"backdrop-blur-[12px]",
				"shadow-[0_1px_0_0_var(--border,#e5e5ea)]",
				className
			)}
		>
			<div className="flex items-center w-full relative h-full max-w-4xl mx-auto">
				{backHref && (
					<button
						type="button"
						onClick={() => window.history.back()}
						className={cn(
							"absolute left-0 top-0 z-10 h-full flex items-center px-4 text-[17px] font-medium text-primary active:opacity-60 transition-opacity",
							"select-none",
							"tap-transparent",
							"tracking-[0]"
						)}
						style={{
							WebkitTapHighlightColor: "transparent",
							background: "none",
							border: "none",
							padding: 0,
							cursor: "pointer"
						}}
					>
						<span
							className={cn(
								"inline-flex items-center font-normal text-[17px] leading-[22px]"
							)}
						>
							<ChevronLeft className="mr-1" size={20} />
							{backLabel}
						</span>
					</button>
				)}
				<div className="flex-1 flex items-center justify-center relative h-full">
					{title && (
						<div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
							{title}
						</div>
					)}
					<div className={title ? "w-full" : ""}>
						{rest}
					</div>
				</div>
			</div>
		</header>
	)
}

export function PageTitle({
	children,
	className,
}: {
	children: ReactNode
	className?: string
}) {
	return (
		<span
			className={cn(
				"text-[17px] font-semibold text-foreground tracking-tight leading-[22px]",
				className
			)}
		>
			{children}
		</span>
	)
}
PageTitle.displayName = "PageTitle";

export function PageContent({
	children,
	className,
}: {
	children: ReactNode
	className?: string
}) {
	return (
    <PageTransition>
      <ScrollArea
        className={cn("flex-1 px-0 py-0 bg-transparent")}
      >
        <section
          className={cn(
            "w-full",
            "overflow-auto",
            "px-4 pt-5 pb-0",
            "mx-auto",
            "max-w-4xl mx-auto",
            className
            // "webkit-overflow-scrolling-touch"
          )}
        >
          {children}
        </section>
      </ScrollArea>
    </PageTransition>
	)
}