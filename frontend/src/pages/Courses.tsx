import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Loader2, Edit, Trash2, Plus, Save, X, Package, AlertCircle, Presentation } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getApiUrl } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

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
  level: string;
  image: string;
  modules: Module[];
}

export function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Partial<Course>>({
    title: '',
    description: '',
    category: 'Web',
    level: 'Beginner',
    image: '',
    modules: [{ title: '', content: '', slideUrl: '' }]
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch(getApiUrl('/courses'));
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      toast.error('Gagal memuatkan kursus');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Adakah anda pasti mahu memadam kursus ini?')) return;

    try {
      const resp = await fetch(getApiUrl(`/courses/${id}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });

      if (resp.ok) {
        toast.success('Kursus dipadam');
        fetchCourses();
      }
    } catch (err) {
      toast.error('Gagal memadam kursus');
    }
  };

  const handleEditCourse = (e: React.MouseEvent, course: Course) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentCourse(course);
    setIsEditing(true);
  };

  const handleAddModule = () => {
    setCurrentCourse({
      ...currentCourse,
      modules: [...(currentCourse.modules || []), { title: '', content: '', slideUrl: '' }]
    });
  };

  const handleModuleChange = (index: number, field: keyof Module, value: string) => {
    const updatedModules = [...(currentCourse.modules || [])];
    updatedModules[index] = { ...updatedModules[index], [field]: value };
    setCurrentCourse({ ...currentCourse, modules: updatedModules });
  };

  const handleDeleteModule = (index: number) => {
    const updatedModules = currentCourse.modules?.filter((_, i) => i !== index);
    setCurrentCourse({ ...currentCourse, modules: updatedModules });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !currentCourse._id;
    const url = isNew ? getApiUrl('/courses') : getApiUrl(`/courses/${currentCourse._id}`);
    const method = isNew ? 'POST' : 'PUT';

    try {
      const resp = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify(currentCourse)
      });

      if (resp.ok) {
        toast.success(isNew ? 'Kursus berjaya ditambah' : 'Kursus berjaya dikemaskini');
        setIsEditing(false);
        fetchCourses();
      } else {
        const errorData = await resp.json();
        throw new Error(errorData.message);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal menyimpan kursus';
      toast.error(message);
    }
  };

  if (isEditing) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">{currentCourse._id ? 'Edit Kursus' : 'Tambah Kursus Baru'}</h1>
              <Button variant="ghost" onClick={() => setIsEditing(false)}>
                <X className="w-5 h-5 mr-2" /> Batal
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Card className="bg-card/50 backdrop-blur-sm border-border">
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tajuk Kursus</label>
                      <Input 
                        value={currentCourse.title} 
                        onChange={(e) => setCurrentCourse({...currentCourse, title: e.target.value})}
                        placeholder="Contoh: Belajar OSINT"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Kategori</label>
                      <select 
                        className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md"
                        value={currentCourse.category}
                        onChange={(e) => setCurrentCourse({...currentCourse, category: e.target.value})}
                      >
                        {['Web', 'OSINT', 'Forensic', 'Pwn', 'Crypto', 'Reverse', 'Misc/Puzzle'].map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Penerangan</label>
                    <textarea 
                      className="w-full min-h-[100px] px-3 py-2 bg-background border border-input rounded-md"
                      value={currentCourse.description}
                      onChange={(e) => setCurrentCourse({...currentCourse, description: e.target.value})}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tahap (Level)</label>
                      <select 
                        className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md"
                        value={currentCourse.level}
                        onChange={(e) => setCurrentCourse({...currentCourse, level: e.target.value})}
                      >
                        {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                          <option key={lvl} value={lvl}>{lvl}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">URL Gambar (Opsional)</label>
                      <Input 
                        value={currentCourse.image}
                        onChange={(e) => setCurrentCourse({...currentCourse, image: e.target.value})}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Package className="w-5 h-5" /> Kandungan Modul
                  </h2>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddModule}>
                    <Plus className="w-4 h-4 mr-2" /> Tambah Modul
                  </Button>
                </div>

                {currentCourse.modules?.map((mod, idx) => (
                  <Card key={idx} className="bg-card/30 border-dashed">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-primary">Modul {idx + 1}</span>
                        {currentCourse.modules!.length > 1 && (
                          <Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={() => handleDeleteModule(idx)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div className="space-y-4">
                        <Input 
                          placeholder="Tajuk Modul" 
                          value={mod.title}
                          onChange={(e) => handleModuleChange(idx, 'title', e.target.value)}
                          required
                        />
                        <textarea 
                          className="w-full min-h-[80px] px-3 py-2 bg-background border border-input rounded-md text-sm"
                          placeholder="Kandungan nota / penerangan"
                          value={mod.content}
                          onChange={(e) => handleModuleChange(idx, 'content', e.target.value)}
                        />
                        <div className="space-y-1">
                           <label className="text-xs text-muted-foreground flex items-center gap-1">
                             <Presentation className="w-3 h-3" /> Pautan Google Slide (Gunakan pautan 'Share')
                           </label>
                           <Input 
                             placeholder="Ex: https://docs.google.com/presentation/d/..." 
                             value={mod.slideUrl}
                             onChange={(e) => handleModuleChange(idx, 'slideUrl', e.target.value)}
                           />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button type="submit" className="w-full mt-8" size="lg">
                <Save className="w-5 h-5 mr-2" /> Simpan Kursus
              </Button>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 mb-6 md:mb-4">
                <BookOpen className="w-7 h-7 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Senarai Modul Pembelajaran
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                Setiap modul mengandungi pautan slaid pembelajaran dan kandungan yang komprehensif.
              </p>
            </div>
            
            {user?.role === 'admin' && (
              <div className="flex gap-2">
                <Button variant="outline" size="lg" onClick={async () => {
                  try {
                    const resp = await fetch(getApiUrl('/courses/seed'), {
                      method: 'POST',
                      headers: { 'Authorization': `Bearer ${user?.token}` }
                    });
                    if (resp.ok) {
                      toast.success('Modul asal telah dipulihkan');
                      fetchCourses();
                    }
                  } catch (err) {
                    toast.error('Gagal memulihkan modul');
                  }
                }}>
                  Pulihkan 7 Modul Asal
                </Button>
                <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={() => {
                  setCurrentCourse({ title: '', description: '', category: 'Web', level: 'Beginner', image: '', modules: [{ title: '', content: '', slideUrl: '' }] });
                  setIsEditing(true);
                }}>
                  <Plus className="w-5 h-5 mr-2" /> Tambah Kursus
                </Button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Memuatkan kursus...</p>
            </div>
          ) : courses.length === 0 ? (
             <div className="text-center py-20 border-2 border-dashed rounded-xl">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">Tiada kursus tersedia</h3>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <div key={course._id} className="relative group">
                  <Link to={`/course/${course._id}`}>
                    <Card className="h-full bg-card/50 border-border/50 card-hover cursor-pointer overflow-hidden group">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <span className="text-xs font-medium text-primary uppercase tracking-wider">
                              {course.category}
                            </span>
                            <div className="text-3xl font-bold htb-accent font-mono">
                              {(index + 1).toString().padStart(2, '0')}
                            </div>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowRight className="w-5 h-5 text-primary" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {course.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <span className="text-sm font-medium text-primary group-hover:underline">
                            Mula Belajar
                          </span>
                          <span className="px-2 py-0.5 bg-muted rounded uppercase text-[10px] font-bold">
                            {course.level}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  {user?.role === 'admin' && (
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="bg-background/80 backdrop-blur-md hover:bg-primary hover:text-white"
                        onClick={(e) => handleEditCourse(e, course)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="bg-background/80 backdrop-blur-md hover:bg-destructive hover:text-white"
                        onClick={(e) => handleDeleteCourse(e, course._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
