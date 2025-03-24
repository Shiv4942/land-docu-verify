
import React, { useState, useRef } from 'react';
import { FileUp, File, X, Check, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface UploadAreaProps {
  onFileUpload: (file: File) => void;
  className?: string;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onFileUpload, className }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setUploadError(null);
    
    // Check file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Please upload a valid PDF or image file (JPEG, PNG)');
      return;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds the 10MB limit');
      return;
    }

    setFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onFileUpload(file);
      toast.success('Document uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to upload document. Please try again.');
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      {!file ? (
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 transition-all duration-200 ease-in-out text-center cursor-pointer",
            isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-border bg-background/50 hover:bg-background/80",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            className="sr-only"
          />
          
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <FileUp className="h-8 w-8 text-primary animate-pulse-slow" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Upload 7/12 Document</h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop your document here or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports PDF, JPEG, and PNG formats (max 10MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-6 bg-background/70 backdrop-blur-xs animate-fade-in">
          <div className="flex items-start space-x-4">
            <div className="p-2 rounded-md bg-primary/10">
              <File className="h-6 w-6 text-primary" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium truncate">{file.name}</h4>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type.split('/')[1].toUpperCase()}
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemoveFile}
              className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove file</span>
            </Button>
          </div>
          
          {uploadError && (
            <div className="mt-4 p-3 rounded-md bg-destructive/10 flex items-center space-x-2 text-sm text-destructive animate-fade-in">
              <AlertTriangle className="h-4 w-4" />
              <span>{uploadError}</span>
            </div>
          )}
          
          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleUpload}
              disabled={isUploading || !!uploadError}
              className="relative overflow-hidden group"
            >
              {isUploading ? (
                <>
                  <span className="opacity-0">Upload Document</span>
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    Upload Document
                  </span>
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadArea;
