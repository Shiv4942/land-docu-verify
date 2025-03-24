
import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { FileQuestion, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedBackground from "@/components/AnimatedBackground";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative px-4">
      <AnimatedBackground />
      
      <div className="glass-panel rounded-xl p-8 md:p-12 text-center max-w-md w-full animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
          <FileQuestion className="h-8 w-8 text-primary" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          The page you're looking for cannot be found
        </p>
        
        <Button className="w-full" size="lg" asChild>
          <a href="/" className="flex items-center justify-center">
            <Home className="mr-2 h-4 w-4" />
            Return to Home
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
