// src/lib/preview-templates/index.ts
import { generateSaaSPreview } from './saas-preview';
import { generateEcommercePreview } from './ecommerce-preview';
import { generateDashboardPreview } from './dashboard-preview';
import { generateBlogPreview } from './blog-preview';
import { generateAPIPreview } from './api-preview';

export { generateSaaSPreview, generateEcommercePreview, generateDashboardPreview, generateBlogPreview, generateAPIPreview };

export const getPreviewTemplate = (template: string): string => {
  switch (template) {
    case 'nextjs-saas-complete':
    case 'saas':
      return generateSaaSPreview();
    case 'nextjs-ecommerce-advanced':
    case 'ecommerce':
      return generateEcommercePreview();
    case 'react-dashboard-pro':
    case 'dashboard':
      return generateDashboardPreview();
    case 'nextjs-blog-cms':
    case 'blog':
      return generateBlogPreview();
    case 'fastapi-backend':
    case 'api':
      return generateAPIPreview();
    default:
      return generateSaaSPreview();
  }
};
