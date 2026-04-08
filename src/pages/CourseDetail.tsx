import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Shield, Presentation, BookOpen } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getCourseById } from '@/data/courses';
import { Card, CardContent } from '@/components/ui/card';

export function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const course = id ? getCourseById(id) : undefined;

  if (!course) {
    return <Navigate to="/courses" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Senarai Modul
          </Link>

          {/* Course header */}
          <div className="mb-10">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-medium text-primary uppercase tracking-wider">
                    Modul {course.number}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                  Modul {parseInt(course.number)}: {course.title}
                </h1>
                <p className="text-muted-foreground max-w-2xl">
                  {course.description}
                </p>
              </div>
            </div>
          </div>

          {/* Slide section */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Presentation className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                Slaid Pembelajaran
              </h2>
            </div>
            <a
              href={course.slideUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors w-full sm:w-auto justify-center"
            >
              <Presentation className="w-5 h-5" />
              <span className="font-medium">Buka Slaid Pembelajaran</span>
            </a>
          </div>

          {/* Content sections */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                Kandungan Pembelajaran
              </h2>
            </div>

            <div className="space-y-6">
              {course.content.map((section, index) => (
                <Card
                  key={index}
                  className="bg-card/50 border-border/50 overflow-hidden"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium uppercase tracking-wider">
                          {section.section}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {section.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {section.text}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
