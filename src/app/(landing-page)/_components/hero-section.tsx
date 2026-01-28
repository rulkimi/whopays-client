import { Button } from "@/components/ui/button";
import { ArrowRight, Maximize, Zap } from "lucide-react";
import Link from "next/link";

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
];

export default function HeroSection() {
  return (
    <section className="min-h-[calc(100vh-100px)] flex items-center">
      <div className="w-full space-y-24">
        <div className="flex flex-col items-center gap-6 md:gap-12 px-2 sm:px-8">
          <p className="flex items-center gap-2 text-base sm:text-lg border rounded-full w-fit px-4 sm:px-5 py-1.5 sm:py-2">
            <Zap className="text-primary size-6 sm:size-8" />
            <span className="text-muted-foreground text-base sm:text-lg">
              AI-Powered Bill Splitting
            </span>
          </p>
          <div className="space-y-5 md:space-y-8 max-w-xl sm:max-w-4xl text-center">
            <h1 className="font-bold text-3xl sm:text-5xl md:text-7xl leading-tight">
              The easiest way to split and see&nbsp;
              <span className="text-primary">WhoPays</span> what.
            </h1>
            <h2 className="text-base sm:text-xl md:text-2xl text-muted-foreground">
              Scan any receipt and let our AI instantly extract items, calculate splits, and settle up with your group. No more awkward math or forgotten payments.
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center mt-3 sm:mt-0 w-full sm:w-auto">
            <Button asChild size="xl" className="text-lg sm:text-xl w-full sm:w-auto">
              <Link href="/login">
                Start Splitting
                <ArrowRight className="ml-2 size-5 sm:size-6" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" className="text-lg sm:text-xl w-full sm:w-auto">
              <Maximize className="mr-2 size-5 sm:size-6" />
              See Demo
            </Button>
          </div>
        </div>
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-8 max-w-xs sm:max-w-2xl md:max-w-none mx-auto">
          {HERO_STATS.map((item) => (
            <li key={item.stat} className="text-center py-2 sm:py-0">
              <p className="text-xl sm:text-4xl md:text-5xl text-primary font-semibold">
                {item.stat}
              </p>
              <p className="font-semibold text-base sm:text-2xl mt-1 sm:mt-2">
                {item.label}
              </p>
              <p className="text-muted-foreground text-sm sm:text-lg mt-0.5 sm:mt-1">
                {item.detail}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
