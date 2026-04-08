import { Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative bg-background border-t border-border">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo and copyright */}
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <span className="text-sm text-muted-foreground">
              © 2026{' '}
              <span className="font-semibold text-foreground">LEARN CR99</span>
              {' '}— Platform E-Learning Keselamatan Siber
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Terma Penggunaan
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Polisi Privasi
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Hubungi Kami
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
