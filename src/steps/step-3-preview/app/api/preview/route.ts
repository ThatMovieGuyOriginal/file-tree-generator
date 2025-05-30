// src/steps/step-3-preview/app/api/preview/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPreviewTemplate } from '@/lib/preview-templates';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const template = searchParams.get('template') || 'nextjs-saas-complete';
  
  try {
    const previewHtml = getPreviewTemplate(template);
    
    return new NextResponse(previewHtml, {
      headers: {
        'Content-Type': 'text/html',
        'X-Frame-Options': 'SAMEORIGIN',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      }
    });
  } catch (error) {
    console.error('Error generating preview:', error);
    
    // Return a fallback preview
    const fallbackHtml = getPreviewTemplate('nextjs-saas-complete');
    return new NextResponse(fallbackHtml, {
      headers: {
        'Content-Type': 'text/html',
        'X-Frame-Options': 'SAMEORIGIN'
      }
    });
  }
}
