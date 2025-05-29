// src/lib/preview-templates/saas-preview.ts
import { generateBaseHTML, generateGrid } from './base-template';

export const generateSaaSPreview = (): string => {
  const statsData = [
    { title: 'Total Users', value: '12,345', trend: '+15% from last month', color: 'from-blue-50 to-blue-100 text-blue-900' },
    { title: 'Revenue', value: '$89,432', trend: '+22% from last month', color: 'from-green-50 to-green-100 text-green-900' },
    { title: 'Conversion', value: '3.2%', trend: '+0.5% from last month', color: 'from-purple-50 to-purple-100 text-purple-900' },
    { title: 'Growth', value: '+28%', trend: '+5% from last month', color: 'from-orange-50 to-orange-100 text-orange-900' }
  ];

  const content = `
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center py-6">
                <div class="flex items-center">
                    <div class="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg mr-3"></div>
                    <h1 class="text-2xl font-bold text-gray-900">SaaS Platform</h1>
                </div>
                <nav class="hidden md:flex space-x-8">
                    <a href="#" class="text-gray-500 hover:text-gray-900">Features</a>
                    <a href="#" class="text-gray-500 hover:text-gray-900">Pricing</a>
                    <a href="#" class="text-gray-500 hover:text-gray-900">About</a>
                    <a href="#" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Sign In</a>
                </nav>
            </div>
        </div>
    </header>

    <!-- Hero Section -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center">
            <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Build Something
                <span class="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Amazing
                </span>
            </h1>
            <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                The complete SaaS platform for modern businesses. Get started in minutes, scale to millions.
            </p>
            <div class="space-x-4">
                <button class="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 font-semibold">
                    Start Free Trial
                </button>
                <button class="border border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg hover:bg-indigo-50 font-semibold">
                    View Demo
                </button>
            </div>
        </div>

        <!-- Dashboard Preview -->
        <div class="mt-20 bg-white rounded-2xl shadow-xl border p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">Dashboard Preview</h2>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                ${generateGrid(statsData)}
            </div>
            
            <!-- Chart Placeholder -->
            <div class="bg-gray-50 h-64 rounded-lg flex items-center justify-center">
                <div class="text-center">
                    <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                    <p class="text-gray-500">Interactive charts and analytics</p>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t mt-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="text-center text-gray-500">
                <p>&copy; 2025 SaaS Platform. Built with File Tree Generator.</p>
            </div>
        </div>
    </footer>
  `;

  return generateBaseHTML('SaaS Platform Preview', content);
};
