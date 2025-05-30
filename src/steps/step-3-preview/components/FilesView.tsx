// src/steps/step-3-preview/components/FilesView.tsx
import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { FileList } from './FileList';
import { FileContent } from './FileContent';

interface FilesViewProps {
  files: Record<string, string>;
}

export const FilesView: React.FC<FilesViewProps> = ({ files }) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  return (
    <div className="h-full flex">
      <FileList 
        files={files}
        selectedFile={selectedFile}
        onFileSelect={setSelectedFile}
      />
      <FileContent 
        filename={selectedFile}
        content={selectedFile ? files[selectedFile] : null}
      />
    </div>
  );
};
