"use client"

import Link from "next/link";
import { Button } from "./ui/button";
import { useViewport } from "@/hooks/use-viewport";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Menu } from "lucide-react";

// const NAV_MENUS = [
//   { label: "Features", href: "/features" },
//   { label: "How it Works", href: "/how-it-works" },
//   { label: "API docs", href: "/api/docs" },
// ];
const NAV_MENUS: { label: string; href: string }[] = [
  // { label: "Features", href: "/features" },
  // { label: "How it Works", href: "/how-it-works" },
  // { label: "API docs", href: "/api/docs" }
];

export default function Header() {
  const { isMobile } = useViewport();

  return (
    <>
      {/* Development banner */}
      <div className="w-full bg-yellow-100 border-b border-yellow-300 py-2 px-4 text-sm text-yellow-800 text-center z-30">
        🚧 This website is still in development. You can register and try it out, but responses may not be very accurate sometimes.
        <br />
        You can also just use the email and password already autofilled on the login page to check it out!
      </div>
      <header className="sticky top-0 p-3.5 shadow-sm z-20 bg-background">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          {/* Title always visible */}
          <p className="font-bold text-lg">WhoPays</p>
          {isMobile ? (
            // Mobile: burger menu only
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="ghost" aria-label="Open navigation menu">
                  <Menu className="size-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-6 px-2">
                  {NAV_MENUS.map((menu) => (
                    <Link
                      key={menu.href}
                      href={menu.href}
                      className="text-base font-medium text-foreground px-2 py-1 rounded hover:bg-accent transition"
                    >
                      {menu.label}
                    </Link>
                  ))}
                  <div className="flex flex-col gap-2 px-2">
                    <Button asChild variant="outline" >
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/signup">Get Started</Link>
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          ) : (
            // Desktop: normal navigation/bar
            <>
              <div className="flex gap-8 items-center">
                <ul className="flex gap-3">
                  {NAV_MENUS.map((menu) => (
                    <Link
                      key={menu.href}
                      href={menu.href}
                      className="text-foreground text-base font-medium px-2 py-1 rounded hover:bg-accent transition"
                    >
                      {menu.label}
                    </Link>
                  ))}
                </ul>
              </div>
              <div className="flex gap-3 items-center">
                <Button asChild variant="link" className="text-foreground">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </header>
    </>
  );
}