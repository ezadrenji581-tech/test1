import { BookOpen, HelpCircle, Gift } from 'lucide-react';

const stats = [
  {
    icon: BookOpen,
    value: '10',
    label: 'Modul Pembelajaran',
  },
  {
    icon: HelpCircle,
    value: '50',
    label: 'Soalan Kuiz',
  },
  {
    icon: Gift,
    value: '100%',
    label: 'Percuma',
  },
];

export function Stats() {
  return (
    <section className="relative py-16 bg-background border-y border-border">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center space-y-4 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full group-hover:bg-primary/20 transition-colors" />
                <stat.icon className="relative w-10 h-10 text-primary transition-transform group-hover:scale-110" />
              </div>
              <div className="space-y-1">
                <div className="text-4xl md:text-5xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
              
              {/* Separator line for desktop */}
              {index < stats.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-16 bg-gradient-to-b from-transparent via-border to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
