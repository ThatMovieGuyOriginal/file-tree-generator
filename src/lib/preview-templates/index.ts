// src/lib/preview-templates/index.ts
export { generateSaaSPreview } from './saas-preview';
export { generateEcommercePreview } from './ecommerce-preview';
export { generateDashboardPreview } from './dashboard-preview';
export { generateBlogPreview } from './blog-preview';
export { generateAPIPreview } from './api-preview';

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
