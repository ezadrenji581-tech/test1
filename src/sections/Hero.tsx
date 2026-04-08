import { Link } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Clean accents */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-2xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary tracking-wide uppercase">
                Platform E-Learning Keselamatan Siber
              </span>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                Keselamatan Siber
              </h1>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold htb-accent">
                TD
              </h2>
            </div>

            {/* Description */}
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Memperkasakan anggota Tentera Darat Malaysia dengan pengetahuan keselamatan siber 
              melalui pembelajaran interaktif dan kuiz.
            </p>

            {/* CTA Button */}
            <Link to="/courses">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg gap-3 group soft-shadow"
              >
                MULA BELAJAR
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Right content - Shield illustration */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative">
              {/* Outer rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-80 h-80 rounded-full border border-primary/20 animate-pulse" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-96 h-96 rounded-full border border-primary/10" />
              </div>
              
              {/* Main shield */}
              <div className="relative z-10">
                <Shield className="w-64 h-64 text-primary/80" strokeWidth={0.5} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield className="w-48 h-48 text-primary" strokeWidth={1} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-foreground">TD</span>
                </div>
              </div>

              {/* Decorative dots */}
              <div className="absolute -top-4 -right-4 w-3 h-3 bg-primary rounded-full animate-pulse" />
              <div className="absolute -bottom-8 -left-8 w-2 h-2 bg-primary/60 rounded-full animate-pulse delay-300" />
              <div className="absolute top-1/2 -right-12 w-2 h-2 bg-primary/40 rounded-full animate-pulse delay-700" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
