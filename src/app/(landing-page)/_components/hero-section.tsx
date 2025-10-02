import { Button } from "@/components/ui/button";
import { ArrowRight, Maximize, Zap } from "lucide-react";

const HERO_STATS = [
	{
		stat: "1000+",
		label: "Bills processed",
		detail: "In beta testing phase"
	},
	{
		stat: "5 min",
		label: "Time saved per bill",
		detail: "Compared to manual splitting"
	},
	{
		stat: "< 30 sec",
		label: "Processing speed",
		detail: "From scan to split"
	},
	{
		stat: "15+",
		label: "Receipt types",
		detail: "Restaurants, bars, groceries"
	}
]

export default function HeroSection() {
	return (
		<section className="min-h-[calc(100vh-100px)] flex items-center">
			<div className="space-y-60">
				<div className="flex flex-col items-center gap-12">
					<p className="flex items-center gap-2 text-lg border rounded-full w-fit px-5 py-2">
						<Zap className="text-primary size-8" />
						<span className="text-muted-foreground text-lg">AI-Powered Bill Splitting</span>
					</p>
					<div className="space-y-8 max-w-4xl text-center">
						<h1 className="font-bold text-7xl">
							The easiest way to split and see&nbsp;
							<span className="text-primary">WhoPays</span> what.
						</h1>
						<h2 className="text-2xl">
							Scan any receipt and let our AI instantly extract items, calculate splits, and settle up with your group. No more awkward math or forgotten payments.
						</h2>
					</div>
					<div className="flex gap-4 items-center">
						<Button size="xl" className="text-xl">
							Start Splitting
							<ArrowRight className="ml-2 size-6" />
						</Button>
						<Button variant="outline" size="xl" className="text-xl">
							<Maximize className="mr-2 size-6" />
							See Demo
						</Button>
					</div>
				</div>
				<ul className="grid grid-cols-4 gap-8">
					{HERO_STATS.map(item => (
						<div key={item.stat} className="text-center">
							<p className="text-5xl text-primary font-semibold">
								{item.stat}
							</p>
							<p className="font-semibold text-2xl">
								{item.label}
							</p>
							<p className="text-muted-foreground text-lg">
								{item.detail}
							</p>
						</div>
					))}
				</ul>
			</div>
		</section>
	)
}
