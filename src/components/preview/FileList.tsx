// src/components/preview/FileList.tsx
import React from 'react';
import { FileText } from 'lucide-react';

interface FileListProps {
  files: Record<string, string>;
  selectedFile: string | null;
  onFileSelect: (file: string) => void;
}

const getFileIconColor = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'tsx':
    case 'jsx':
      return 'text-blue-600';
    case 'ts':
    case 'js':
      return 'text-yellow-600';
    case 'css':
    case 'scss':
      return 'text-pink-600';
    case 'json':
      return 'text-green-600';
    case 'md':
      return 'text-gray-600';
    default:
      return 'text-gray-500';
  }
};

export const FileList: React.FC<FileListProps> = ({
  files,
  selectedFile,
  onFileSelect
}) => {
  return (
    <div className="w-1/3 border-r overflow-auto">
      <div className="p-2">
        <h4 className="font-medium text-gray-900 mb-2">Files</h4>
        <div className="space-y-1">
          {Object.keys(files).map((filePath) => (
            <button
              key={filePath}
              onClick={() => onFileSelect(filePath)}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                selectedFile === filePath
                  ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-500'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText size={14} className={getFileIconColor(filePath)} />
                <span className="truncate">{filePath}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
