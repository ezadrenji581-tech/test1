import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { courses as modules } from '../data/courses';

export function Modules() {
  return (
    <section className="relative py-20 bg-background">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Modul Pembelajaran
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pilih modul untuk mula mempelajari keselamatan siber
          </p>
        </div>

        {/* Modules grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Link key={module.id} to={`/course/${module.id}`}>
              <Card className="h-full bg-card/50 border-border/50 card-hover cursor-pointer overflow-hidden group">
                <CardContent className="p-6 space-y-4">
                  {/* Module number badge */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-primary uppercase tracking-wider">
                        Modul
                      </span>
                      <div className="text-3xl font-bold htb-accent">
                        {module.number}
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-5 h-5 text-primary" />
                    </div>
                  </div>

                  {/* Module content */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      Modul {parseInt(module.number)}: {module.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {module.description}
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="pt-2">
                    <span className="text-sm font-medium text-primary group-hover:underline">
                      Mula Belajar
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* View all button */}
        <div className="mt-12 text-center">
          <Link to="/courses">
            <Button
              variant="outline"
              size="lg"
              className="border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground gap-2"
            >
              Lihat Semua Modul
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
