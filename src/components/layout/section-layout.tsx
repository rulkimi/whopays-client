import { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function Section({
	children,
	className,
}: {
	children: ReactNode
	className?: string
}) {
	return (
		<section className={cn("", className)}>
			{children}
		</section>
	)
}

export function SectionHeader({
	children,
	className,
}: {
	children: ReactNode
	className?: string
}) {
	return (
		<header className={cn("flex items-center px-4 pb-2", className)}>
			{children}
		</header>
	)
}

export function SectionTitle({
	children,
	className,
}: {
	children: ReactNode
	className?: string
}) {
	return (
		<span
			className={cn(
				"text-sm font-semibold text-muted-foreground leading-[18px] uppercase",
				className
			)}
		>
			{children}
		</span>
	)
}
SectionTitle.displayName = "SectionTitle"

export function SectionContent({
	children,
	className,
}: {
	children: ReactNode
	className?: string
}) {
	return (
		<div className={cn("", className)}>
			{children}
		</div>
	)
}
