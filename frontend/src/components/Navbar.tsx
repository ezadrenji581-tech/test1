import { Link, useLocation } from 'react-router-dom';
import { Shield, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Shield className="w-8 h-8 text-primary transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-foreground">LEARN </span>
              <span className="text-primary">CR99</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Utama
            </Link>
            <Link
              to="/courses"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/courses') || location.pathname.startsWith('/course/')
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              Kursus
            </Link>
          </div>

          {/* Auth Button */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-foreground">
                  <User className="w-4 h-4 text-primary" />
                  {user.name}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-muted-foreground hover:text-destructive gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Log Keluar
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button
                  variant="outline"
                  className="border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground gap-2"
                >
                  <User className="w-4 h-4" />
                  Log Masuk
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
