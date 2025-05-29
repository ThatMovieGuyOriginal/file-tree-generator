// src/lib/utils/project-stats.ts
export interface ProjectStats {
  totalFiles: number;
  totalLines: number;
  totalSize: number;
  fileTypes: Record<string, number>;
}

export const calculateProjectStats = (files: Record<string, string>): ProjectStats => {
  const totalFiles = Object.keys(files).length;
  const totalLines = Object.values(files).reduce((acc, content) => 
    acc + content.split('\n').length, 0
  );
  const totalSize = Object.values(files).reduce((acc, content) => 
    acc + content.length, 0
  );

  const fileTypes: Record<string, number> = {};
  Object.keys(files).forEach(filename => {
    const ext = filename.split('.').pop()?.toLowerCase() || 'no-extension';
    fileTypes[ext] = (fileTypes[ext] || 0) + 1;
  });

  return { totalFiles, totalLines, totalSize, fileTypes };
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};
