import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Layout, BookOpen, Video, Save, X, ChevronRight, Package, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { getApiUrl } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

interface Module {
  title: string;
  content: string;
  videoUrl: string;
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

export function AdminDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Partial<Course>>({
    title: '',
    description: '',
    category: 'Web',
    level: 'Beginner',
    image: '',
    modules: [{ title: '', content: '', videoUrl: '' }]
  });

  const { user } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const resp = await fetch(getApiUrl('/courses'));
      const data = await resp.json();
      setCourses(data);
    } catch (err) {
      toast.error('Gagal memuatkan kursus');
    } finally {
      setLoading(false);
    }
  };

  const handleAddModule = () => {
    setCurrentCourse({
      ...currentCourse,
      modules: [...(currentCourse.modules || []), { title: '', content: '', videoUrl: '' }]
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
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan kursus');
    }
  };

  const handleDeleteCourse = async (id: string) => {
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

  if (isEditing) {
    return (
      <div className="min-h-screen bg-background p-6 pt-24">
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
                      <Input 
                        placeholder="Pautan Video (YouTube/Vimeo)" 
                        value={mod.videoUrl}
                        onChange={(e) => handleModuleChange(idx, 'videoUrl', e.target.value)}
                      />
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 pt-24 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Urus semua modul pembelajaran CyberEdu</p>
          </div>
          <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={() => {
            setCurrentCourse({ title: '', description: '', category: 'Web', level: 'Beginner', image: '', modules: [{ title: '', content: '', videoUrl: '' }] });
            setIsEditing(true);
          }}>
            <Plus className="w-5 h-5 mr-2" /> Tambah Kursus
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-64 bg-muted rounded-xl animate-pulse"></div>)}
          </div>
        ) : courses.length === 0 ? (
          <Card className="border-dashed py-12">
            <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <CardTitle>Tiada Kursus Dijumpai</CardTitle>
                <CardDescription>Mula tambah modul pertama anda hari ini</CardDescription>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course._id} className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300">
                <div className="aspect-video relative overflow-hidden">
                  <img src={course.image} alt={course.title} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 bg-background/80 backdrop-blur-sm rounded text-xs font-bold uppercase tracking-wider text-primary">
                      {course.category}
                    </span>
                  </div>
                </div>
                <CardContent className="p-5 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold line-clamp-1">{course.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{course.description}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {course.modules.length} Modul</span>
                    <span className="px-2 py-0.5 bg-muted rounded uppercase text-[10px] font-bold">{course.level}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => {
                        setCurrentCourse(course);
                        setIsEditing(true);
                    }}>
                      <Edit className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" className="bg-destructive/5 hover:bg-destructive/10 text-destructive border-destructive/20" onClick={() => handleDeleteCourse(course._id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
