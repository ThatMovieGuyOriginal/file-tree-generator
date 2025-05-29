// src/types/fileTree.ts
export interface TreeNode {
  name: string;
  type: 'file' | 'folder';
  children?: TreeNode[];
  level: number;
  content?: string;
  expanded?: boolean;
}

export interface ParsedTreeResult {
  tree: TreeNode;
  totalFiles: number;
  totalFolders: number;
}
