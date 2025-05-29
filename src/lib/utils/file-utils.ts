// src/lib/utils/file-utils.ts
export const getFileIconColor = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase();
  const colorMap: Record<string, string> = {
    'tsx': 'text-blue-600',
    'jsx': 'text-blue-600',
    'ts': 'text-yellow-600',
    'js': 'text-yellow-600',
    'css': 'text-pink-600',
    'scss': 'text-pink-600',
    'json': 'text-green-600',
    'md': 'text-gray-600',
    'py': 'text-green-700',
    'go': 'text-cyan-600',
    'rs': 'text-orange-600',
    'vue': 'text-green-500',
    'html': 'text-red-500',
    'xml': 'text-red-500',
    'yml': 'text-purple-600',
    'yaml': 'text-purple-600'
  };
  
  return colorMap[ext || ''] || 'text-gray-500';
};

export const isCodeFile = (filename: string): boolean => {
  const codeExtensions = [
    'tsx', 'ts', 'jsx', 'js', 'py', 'go', 'rs', 'vue', 'css', 'scss', 
    'json', 'md', 'html', 'xml', 'yml', 'yaml', 'toml', 'sh', 'php', 'rb'
  ];
  
  const ext = filename.split('.').pop()?.toLowerCase();
  return codeExtensions.includes(ext || '');
};
