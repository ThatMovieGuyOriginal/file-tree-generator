// src/components/preview/FileContent.tsx
import React from 'react';
import { FileText } from 'lucide-react';

interface FileContentProps {
  filename: string | null;
  content: string | null;
}

export const FileContent: React.FC<FileContentProps> = ({
  filename,
  content
}) => {
  if (!filename || !content) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <FileText size={48} className="mx-auto mb-4 opacity-50" />
          <p>Select a file to view its content</p>
        </div>
      </div>
    );
  }

  const isCode = filename.match(/\.(tsx?|jsx?|css|scss|json|md|py|go|rs)$/i);

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-gray-600" />
          <span className="font-medium">{filename}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {content.split('\n').length} lines
          </span>
          <button
            onClick={() => navigator.clipboard.writeText(content)}
            className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
          >
            Copy
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        {isCode ? (
          <pre className="p-4 text-sm font-mono bg-gray-50 min-h-full">
            <code>{content}</code>
          </pre>
        ) : (
          <div className="p-4 whitespace-pre-wrap text-sm">
            {content}
          </div>
        )}
      </div>
    </div>
  );
};
