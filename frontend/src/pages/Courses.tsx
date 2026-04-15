import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getAllCourses } from '@/data/courses';
import { Card, CardContent } from '@/components/ui/card';

export function Courses() {
  const courses = getAllCourses();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 mb-6">
              <BookOpen className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Senarai Modul Pembelajaran
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Pilih modul untuk mula mempelajari keselamatan siber. Setiap modul 
              mengandungi video pembelajaran dan kandungan yang komprehensif.
            </p>
          </div>

          {/* Courses grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link key={course.id} to={`/course/${course.id}`}>
                <Card className="h-full bg-card/50 border-border/50 card-hover cursor-pointer overflow-hidden group">
                  <CardContent className="p-6 space-y-4">
                    {/* Module number badge */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-primary uppercase tracking-wider">
                          Modul
                        </span>
                        <div className="text-3xl font-bold htb-accent">
                          {course.number}
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-5 h-5 text-primary" />
                      </div>
                    </div>

                    {/* Module content */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        Modul {parseInt(course.number)}: {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {course.description}
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

          {/* Additional info */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-sm text-primary">
                {courses.length} modul tersedia untuk pembelajaran
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
