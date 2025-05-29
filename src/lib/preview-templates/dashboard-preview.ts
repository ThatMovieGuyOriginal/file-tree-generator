// src/lib/preview-templates/dashboard-preview.ts
import { generateBaseHTML } from './base-template';

export const generateDashboardPreview = (): string => {
  const content = `
    <div class="flex h-screen">
        <!-- Sidebar -->
        <aside class="w-64 bg-white shadow-sm border-r">
            <div class="p-6">
                <div class="flex items-center">
                    <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg mr-3"></div>
                    <h1 class="text-xl font-bold text-gray-900">Analytics</h1>
                </div>
            </div>
            <nav class="mt-6">
                <div class="px-6 space-y-2">
                    <a href="#" class="flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg">
                        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2"></path>
                        </svg>
                        Dashboard
                    </a>
                    <a href="#" class="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                        Analytics
                    </a>
                </div>
            </nav>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 overflow-auto">
            <!-- Header -->
            <header class="bg-white border-b px-6 py-4">
                <div class="flex items-center justify-between">
                    <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        Export Report
                    </button>
                </div>
            </header>

            <!-- Dashboard Content -->
            <div class="p-6">
                <!-- Stats Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white p-6 rounded-lg shadow-sm border">
                        <p class="text-sm font-medium text-gray-600">Total Revenue</p>
                        <p class="text-2xl font-bold text-gray-900">$45,231.89</p>
                        <p class="text-xs text-green-600">+20.1% from last month</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-sm border">
                        <p class="text-sm font-medium text-gray-600">Subscriptions</p>
                        <p class="text-2xl font-bold text-gray-900">+2350</p>
                        <p class="text-xs text-green-600">+180.1% from last month</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-sm border">
                        <p class="text-sm font-medium text-gray-600">Sales</p>
                        <p class="text-2xl font-bold text-gray-900">+12,234</p>
                        <p class="text-xs text-green-600">+19% from last month</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-sm border">
                        <p class="text-sm font-medium text-gray-600">Active Now</p>
                        <p class="text-2xl font-bold text-gray-900">+573</p>
                        <p class="text-xs text-green-600">+201 since last hour</p>
                    </div>
                </div>

                <!-- Chart Placeholder -->
                <div class="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Analytics Overview</h3>
                    <div class="h-64 bg-gradient-to-t from-blue-50 to-white rounded-lg flex items-center justify-center">
                        <p class="text-gray-500">Interactive charts would go here</p>
                    </div>
                </div>
            </div>
        </main>
    </div>
  `;

  return generateBaseHTML('Analytics Dashboard Preview', content);
};
