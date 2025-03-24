
import React from 'react';
import { FileCheck, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md",
      className
    )}>
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <FileCheck className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold tracking-tight">DocuVerify</span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">Home</a>
          <a href="#" className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">About</a>
          <a href="#" className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">Services</a>
          <a href="#" className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">Contact</a>
          <Button className="ml-4" size="sm">Get Started</Button>
        </nav>

        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 border-b border-border/40 bg-background/95 backdrop-blur-md md:hidden animate-slide-down">
            <nav className="container flex flex-col py-4 px-4 gap-4">
              <a href="#" className="py-2 text-sm font-medium transition-colors hover:text-primary">Home</a>
              <a href="#" className="py-2 text-sm font-medium transition-colors hover:text-primary">About</a>
              <a href="#" className="py-2 text-sm font-medium transition-colors hover:text-primary">Services</a>
              <a href="#" className="py-2 text-sm font-medium transition-colors hover:text-primary">Contact</a>
              <Button className="mt-2" size="sm">Get Started</Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
