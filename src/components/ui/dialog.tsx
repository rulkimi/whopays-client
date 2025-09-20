"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"
import { motion, AnimatePresence, Variants } from "motion/react"

import { cn } from "@/lib/utils"

// Variants for smooth motion
const overlayVariants: Variants = {
	open: { opacity: 1, backdropFilter: "blur(6px)" },
	closed: { opacity: 0, backdropFilter: "blur(0px)" },
}

const contentVariants: Variants = {
	open: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", damping: 25, stiffness: 300 } },
	closed: { opacity: 0, y: 40, scale: 0.97, transition: { duration: 0.15 } },
}

// Overlay
function DialogOverlay({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
	return (
		<DialogPrimitive.Overlay asChild forceMount {...props}>
			<AnimatePresence>
				<motion.div
					data-slot="dialog-overlay"
					className={cn(
						"fixed inset-0 z-50 bg-black/20 transition-all",
						className
					)}
					variants={overlayVariants}
					initial="closed"
					animate="open"
					exit="closed"
				/>
			</AnimatePresence>
		</DialogPrimitive.Overlay>
	)
}

// Content
function DialogContent({
	className,
	children,
	showCloseButton = true,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
	showCloseButton?: boolean
}) {
	return (
		<DialogPortal>
			<DialogOverlay />
			<DialogPrimitive.Content asChild forceMount {...props}>
				<AnimatePresence>
					<motion.div
						data-slot="dialog-content"
						className={cn(
							"fixed left-1/2 z-50 w-full max-w-5xl bg-white/80 dark:bg-neutral-900/80 rounded-[22px] shadow-2xl",
							"backdrop-blur-[16px] border border-white/40 dark:border-neutral-800/60",
							"bottom-0 translate-x-[-50%] sm:top-1/2 sm:bottom-auto sm:translate-y-[-50%]",
							"sm:left-1/2 sm:translate-x-[-50%]",
							"p-0 overflow-hidden",
							className
						)}
						style={{ maxHeight: "calc(100dvh - 2rem)" }}
						variants={contentVariants}
						initial="closed"
						animate="open"
						exit="closed"
					>
						{/* Drag indicator */}
						<div className="w-full flex justify-center pt-3 pb-1">
							<div className="h-1.5 w-12 rounded-full bg-neutral-300/80 dark:bg-neutral-700/70" />
						</div>

						<div className="relative px-6 pt-2 pb-6 sm:pt-6 sm:pb-7">
							{showCloseButton && (
								<DialogPrimitive.Close
									data-slot="dialog-close"
									className="absolute right-3 top-3 rounded-full p-2 bg-white/80 dark:bg-neutral-800/80 shadow hover:bg-white/90 dark:hover:bg-neutral-800/90 focus:outline-none focus:ring-2 focus:ring-primary transition"
								>
									<XIcon className="w-5 h-5 text-neutral-500" />
									<span className="sr-only">Close</span>
								</DialogPrimitive.Close>
							)}
							{children}
						</div>
					</motion.div>
				</AnimatePresence>
			</DialogPrimitive.Content>
		</DialogPortal>
	)
}

// Portal wrapper
function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
	return <DialogPrimitive.Portal {...props} />
}

// Other exports unchanged...
function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
	return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
	return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
	return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="dialog-header"
			className={cn(
				"w-full flex flex-col items-center border-b border-neutral-200/70 dark:border-neutral-800/60 pb-2 mb-4 pt-1",
				className
			)}
			{...props}
		/>
	)
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="dialog-footer"
			className={cn(
				"w-full flex flex-col gap-2 pt-4 border-t border-neutral-200/70 dark:border-neutral-800/60 sm:flex-row sm:justify-end",
				className
			)}
			{...props}
		/>
	)
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
	return (
		<DialogPrimitive.Title
			data-slot="dialog-title"
			className={cn(
				"text-[18px] font-semibold text-center text-neutral-900 dark:text-neutral-100 tracking-tight",
				className
			)}
			{...props}
		/>
	)
}

function DialogDescription({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
	return (
		<DialogPrimitive.Description
			data-slot="dialog-description"
			className={cn(
				"text-neutral-500 dark:text-neutral-400 text-[15px] text-center mt-2 mb-1",
				className
			)}
			{...props}
		/>
	)
}

export {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
}
