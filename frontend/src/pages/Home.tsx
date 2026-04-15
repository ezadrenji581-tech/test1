import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Hero } from '@/sections/Hero';
import { Stats } from '@/sections/Stats';
import { Modules } from '@/sections/Modules';

export function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Modules />
      </main>
      <Footer />
    </div>
  );
}
