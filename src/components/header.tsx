import Link from "next/link"
import { Button } from "./ui/button"

const NAV_MENUS = [
	{ label: "Features", href: "/features" },
	{ label: "How it Works", href: "/how-it-works" },
	{ label: "API docs", href: "/api/docs" }
]

export default function Header() {
	return (
		<header className="sticky top-0 p-3.5 shadow-sm z-20 bg-background">
			<div className="flex items-center justify-between max-w-5xl mx-auto">
				<div className="flex gap-8">
					<p>WhoPays</p>
					<ul className="flex gap-3">
						{NAV_MENUS.map(menu => (
							<Link
								key={menu.href}
								href={menu.href}
								className="text-foreground"
							>
								{menu.label}
							</Link>
						))}
					</ul>
				</div>
				<div className="flex gap-3">
					<Button asChild variant="link" className="text-foreground">
						<Link href="/login">Login</Link>
					</Button>
					<Button asChild>
						<Link href="/signup">Get Started</Link>
					</Button>
				</div>
			</div>
		</header>
	)
}