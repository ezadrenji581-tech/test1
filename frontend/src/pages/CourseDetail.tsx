import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Shield, Presentation, BookOpen, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getApiUrl } from '@/lib/api';

interface Module {
  title: string;
  content: string;
  slideUrl: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  modules: Module[];
}

export function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      try {
        const response = await fetch(getApiUrl(`/courses/${id}`));
        if (response.ok) {
          const data = await response.json();
          setCourse(data);
          if (data.modules && data.modules.length > 0) {
            const firstModule = data.modules[0];
            setActiveSlide(firstModule.slideUrl || (firstModule as any).videoUrl);
          }
        }
      } catch (error) {
        console.error('Failed to fetch course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('docs.google.com/presentation')) {
      // Convert share link to embed link
      let embedUrl = url.split('/edit')[0];
      if (!embedUrl.endsWith('/embed')) {
        embedUrl = `${embedUrl}/embed`;
      }
      return embedUrl;
    }
    return url;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Memuatkan kandungan modul...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return <Navigate to="/courses" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Kembali ke Senarai Modul
          </Link>

          <div className="mb-10">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-medium text-primary uppercase tracking-wider">
                    {course.category}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                  {course.title}
                </h1>
                <p className="text-muted-foreground max-w-2xl">
                  {course.description}
                </p>
              </div>
            </div>
          </div>

          {activeSlide && (
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <Presentation className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">
                  Slaid Pembelajaran
                </h2>
              </div>
              
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border bg-card shadow-lg">
                <iframe
                  src={getEmbedUrl(activeSlide)}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                ></iframe>
              </div>
              
              <div className="mt-4 flex justify-end">
                <a 
                  href={activeSlide} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  <Presentation className="w-3 h-3" /> Buka Slaid di Tab Baru
                </a>
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                Kandungan Pembelajaran
              </h2>
            </div>

            <div className="space-y-6">
              {course.modules.map((module, index) => (
                <Card
                  key={index}
                  className={`bg-card/50 border-border/50 overflow-hidden transition-all ${activeSlide === module.slideUrl ? 'border-primary/50 ring-1 ring-primary/20' : ''}`}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="flex-shrink-0">
                        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium uppercase tracking-wider">
                          Modul {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-foreground">
                            {module.title}
                          </h3>
                          {(module.slideUrl || (module as any).videoUrl) && (
                             <Button 
                               variant="ghost" 
                               size="sm" 
                               className={`text-xs ${activeSlide === (module.slideUrl || (module as any).videoUrl) ? 'text-primary' : ''}`}
                               onClick={() => setActiveSlide(module.slideUrl || (module as any).videoUrl)}
                             >
                               Buka Slaid
                             </Button>
                          )}
                        </div>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {module.content}
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
