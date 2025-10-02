import Header from "@/components/header";
import HeroSection from "./_components/hero-section";

export default async function Home() {
  return (
    <main className="relative">
      <Header />
      <div className="max-w-5xl mx-auto p-3.5">
        <HeroSection />
      </div>
    </main>
  );
}
