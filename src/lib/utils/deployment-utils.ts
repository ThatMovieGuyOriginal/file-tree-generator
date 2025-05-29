/ src/lib/utils/deployment-utils.ts
import { DeploymentPlatform } from '@/lib/deployment-manager';

export const getDeploymentUrl = (platform: DeploymentPlatform['id'], projectName: string): string => {
  const encodedName = encodeURIComponent(projectName);
  
  switch (platform) {
    case 'vercel':
      return `https://vercel.com/new/clone?repository-url=https://github.com/yourusername/${encodedName}`;
    case 'netlify':
      return `https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/${encodedName}`;
    case 'railway':
      return `https://railway.app/new/template?template=https://github.com/yourusername/${encodedName}`;
    case 'digitalocean':
      return `https://cloud.digitalocean.com/apps/new?repo=https://github.com/yourusername/${encodedName}`;
    default:
      return 'https://github.com';
  }
};
