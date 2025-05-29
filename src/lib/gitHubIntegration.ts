// src/lib/gitHubIntegration.ts
import { TreeNode } from '@/types/fileTree';
import { ProjectSettings } from '@/types/project';

export const createGitHubUrl = (parsedTree: TreeNode, settings: ProjectSettings): string => {
  const repoName = settings.name || parsedTree.name || 'my-project';
  const description = settings.description || 'Generated with File Tree Generator';
  const isPrivate = settings.private;
  
  const githubUrl = new URL('https://github.com/new');
  githubUrl.searchParams.set('name', repoName);
  githubUrl.searchParams.set('description', description);
  githubUrl.searchParams.set('visibility', isPrivate ? 'private' : 'public');
  
  // Don't auto-initialize since we generate comprehensive README
  githubUrl.searchParams.set('auto_init', 'false');
  
  if (settings.gitignore && settings.gitignore !== 'none') {
    githubUrl.searchParams.set('gitignore_template', settings.gitignore);
  }
  
  if (settings.license && settings.license !== 'none') {
    githubUrl.searchParams.set('license_template', settings.license);
  }

  return githubUrl.toString();
};

export const createGitHubRepository = async (
  parsedTree: TreeNode, 
  settings: ProjectSettings,
  accessToken: string
) => {
  const response = await fetch('https://api.github.com/user/repos', {
    method: 'POST',
    headers: {
     'Authorization': `token ${accessToken}`,
     'Content-Type': 'application/json',
   },
   body: JSON.stringify({
     name: settings.name || parsedTree.name || 'my-project',
     description: settings.description || 'Generated with File Tree Generator',
     private: settings.private,
     auto_init: false, // We generate our own README
     gitignore_template: settings.gitignore !== 'none' ? settings.gitignore : undefined,
     license_template: settings.license !== 'none' ? settings.license : undefined,
   }),
 });

 if (!response.ok) {
   throw new Error('Failed to create GitHub repository');
 }

 return await response.json();
};
