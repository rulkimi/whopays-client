import { ReactNode } from "react";

export default function AuthLayout({ children } : { children: ReactNode }) {
  return (
    <main className="min-h-screen flex justify-center items-center p-4 bg-primary/10">
      {children}
    </main>
  )
}