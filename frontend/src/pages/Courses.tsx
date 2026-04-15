import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { getApiUrl } from '@/lib/api';

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  image: string;
}

export function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(getApiUrl('/courses'));
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Memuatkan kursus...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <Link key={course._id} to={`/course/${course._id}`}>
                  <Card className="h-full bg-card/50 border-border/50 card-hover cursor-pointer overflow-hidden group">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <span className="text-xs font-medium text-primary uppercase tracking-wider">
                            {course.category}
                          </span>
                          <div className="text-3xl font-bold htb-accent">
                            {(index + 1).toString().padStart(2, '0')}
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight className="w-5 h-5 text-primary" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          Modul {index + 1}: {course.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {course.description}
                        </p>
                      </div>

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
          )}

          {!loading && courses.length > 0 && (
            <div className="mt-16 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-sm text-primary">
                  {courses.length} modul tersedia untuk pembelajaran
                </span>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
