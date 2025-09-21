"use client"

import { usePathname } from "next/navigation"
import { AnimatePresence, motion, Variants } from "motion/react"
import { ReactNode, useRef, useEffect, useState } from "react"

type PageTransitionProps = {
	children: ReactNode
}

// Helper to determine direction based on pathnames
function getDirection(prev: string | null, next: string): "forward" | "backward" {
	if (!prev) return "forward"
	const prevParts = prev.split("/").filter(Boolean)
	const nextParts = next.split("/").filter(Boolean)
	// If next is a parent of prev, it's backward
	if (
		nextParts.length < prevParts.length &&
		prevParts.slice(0, nextParts.length).join("/") === nextParts.join("/")
	) {
		return "backward"
	}
	// If prev is a parent of next, it's forward
	if (
		nextParts.length > prevParts.length &&
		nextParts.slice(0, prevParts.length).join("/") === prevParts.join("/")
	) {
		return "forward"
	}
	// Otherwise, fallback to alphabetical
	return next > prev ? "forward" : "backward"
}

const iosPageVariants = (direction: "forward" | "backward"): Variants => ({
	initial: {
		x: direction === "forward" ? "100%" : "-33%",
		transition: {
			duration: 0.35,
			ease: [0.32, 0.72, 0, 1]
		}
	},
	animate: {
		x: 0,
		transition: {
			duration: 0.35,
			ease: [0.32, 0.72, 0, 1]
		}
	},
	exit: {
		x: direction === "forward" ? "-33%" : "100%",
		transition: {
			duration: 0.35,
			ease: [0.32, 0.72, 0, 1]
		}
	}
})

export default function PageTransition({ children }: PageTransitionProps) {
	const pathname = usePathname()
	const prevPathRef = useRef<string | null>(null)
	const [direction, setDirection] = useState<"forward" | "backward">("forward")

	useEffect(() => {
		const prev = prevPathRef.current
		setDirection(getDirection(prev, pathname))
		prevPathRef.current = pathname
	}, [pathname])

	return (
		<div style={{
			position: "relative",
			width: "100%",
			height: "100%",
		}}>
			<AnimatePresence mode="wait">
				<motion.div
					key={pathname}
					variants={iosPageVariants(direction)}
					initial="initial"
					animate="animate"
					exit="exit"
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						backgroundColor: "#ffffff",
						willChange: "transform"
					}}
				>
					{children}
				</motion.div>
			</AnimatePresence>
		</div>
	)
}