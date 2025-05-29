// src/lib/fileTreeParser.ts
import { TreeNode } from '@/types/fileTree';

export const parseFileTree = (input: string): TreeNode => {
  const lines = input.trim().split('\n');
  const root: TreeNode = { name: '', type: 'folder', children: [], level: -1 };
  const stack: TreeNode[] = [root];

  lines.forEach(line => {
    const trimmed = line.replace(/^[│├└─\s]+/, '');
    if (!trimmed) return;

    const level = (line.length - trimmed.length) / 4;
    const isFolder = trimmed.endsWith('/');
    const name = isFolder ? trimmed.slice(0, -1) : trimmed;

    const node: TreeNode = {
      name,
      type: isFolder ? 'folder' : 'file',
      children: isFolder ? [] : undefined,
      level,
      expanded: true
    };

    while (stack.length > 1 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }

    const parent = stack[stack.length - 1];
    if (parent.children) {
      parent.children.push(node);
    }

    if (isFolder) {
      stack.push(node);
    }
  });

  return root.children?.[0] || { name: 'project', type: 'folder', children: [], level: 0 };
};

export const countNodes = (node: TreeNode): { files: number; folders: number } => {
  let files = 0;
  let folders = 0;

  if (node.type === 'file') {
    files = 1;
  } else {
    folders = 1;
    if (node.children) {
      node.children.forEach(child => {
        const counts = countNodes(child);
        files += counts.files;
        folders += counts.folders;
      });
    }
  }

  return { files, folders };
};
