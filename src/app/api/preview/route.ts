// src/app/api/preview/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const template = searchParams.get('template') || 'nextjs-saas-complete';
  
  // Generate preview HTML based on template
  const previewHtml = generatePreviewHtml(template);
  
  return new NextResponse(previewHtml, {
    headers: {
      'Content-Type': 'text/html',
      'X-Frame-Options': 'SAMEORIGIN'
    }
  });
}

function generatePreviewHtml(template: string): string {
  const templates: Record<string, string> = {
    'nextjs-saas-complete': generateSaaSPreview(),
    'nextjs-ecommerce-advanced': generateEcommercePreview(),
    'react-dashboard-pro': generateDashboardPreview(),
    'nextjs-blog-cms': generateBlogPreview(),
    'fastapi-backend': generateAPIPreview()
  };

  return templates[template] || templates['nextjs-saas-complete'];
}

function generateSaaSPreview(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SaaS Platform Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-gray-50">
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

        <!-- Features Grid -->
        <div class="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-white p-6 rounded-xl shadow-sm border">
                <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                </div>
                <h3 class="text-xl font-semibold mb-2">Lightning Fast</h3>
                <p class="text-gray-600">Built for speed and performance. Your users will love the experience.</p>
            </div>
            
            <div class="bg-white p-6 rounded-xl shadow-sm border">
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <h3 class="text-xl font-semibold mb-2">Secure by Default</h3>
                <p class="text-gray-600">Enterprise-grade security with authentication and authorization built-in.</p>
            </div>
            
            <div class="bg-white p-6 rounded-xl shadow-sm border">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                    </svg>
                </div>
                <h3 class="text-xl font-semibold mb-2">Analytics Ready</h3>
                <p class="text-gray-600">Comprehensive dashboard with real-time analytics and reporting.</p>
            </div>
        </div>

        <!-- Dashboard Preview -->
        <div class="mt-20 bg-white rounded-2xl shadow-xl border p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">Dashboard Preview</h2>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
                    <h3 class="text-sm font-medium text-blue-600">Total Users</h3>
                    <p class="text-3xl font-bold text-blue-900">12,345</p>
                    <p class="text-sm text-blue-600">+15% from last month</p>
                </div>
                <div class="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg">
                    <h3 class="text-sm font-medium text-green-600">Revenue</h3>
                    <p class="text-3xl font-bold text-green-900">$89,432</p>
                    <p class="text-sm text-green-600">+22% from last month</p>
                </div>
                <div class="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg">
                    <h3 class="text-sm font-medium text-purple-600">Conversion</h3>
                    <p class="text-3xl font-bold text-purple-900">3.2%</p>
                    <p class="text-sm text-purple-600">+0.5% from last month</p>
                </div>
                <div class="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg">
                    <h3 class="text-sm font-medium text-orange-600">Growth</h3>
                    <p class="text-3xl font-bold text-orange-900">+28%</p>
                    <p class="text-sm text-orange-600">+5% from last month</p>
                </div>
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
</body>
</html>`;
}

function generateEcommercePreview(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E-commerce Store Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center py-4">
                <div class="flex items-center">
                    <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-3"></div>
                    <h1 class="text-2xl font-bold text-gray-900">Store</h1>
                </div>
                <nav class="hidden md:flex items-center space-x-8">
                    <a href="#" class="text-gray-600 hover:text-gray-900">Products</a>
                    <a href="#" class="text-gray-600 hover:text-gray-900">Categories</a>
                    <a href="#" class="text-gray-600 hover:text-gray-900">About</a>
                    <button class="relative p-2">
                        <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4-2L7 13v1a1 1 0 001 1h9a1 1 0 001-1v-1m-10 2h.01M19 16h.01M6 20h.01"></path>
                        </svg>
                        <span class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">2</span>
                    </button>
                </nav>
            </div>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="text-5xl font-bold mb-4">Discover Amazing Products</h1>
            <p class="text-xl mb-8 opacity-90">Shop the latest trends with free shipping worldwide</p>
            <button class="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Shop Now
            </button>
        </div>
    </section>

    <!-- Featured Products -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 class="text-3xl font-bold text-center mb-12">Featured Products</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            ${[1, 2, 3, 4].map(i => `
                <div class="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-shadow">
                    <div class="bg-gradient-to-br from-gray-100 to-gray-200 h-48 flex items-center justify-center">
                        <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    <div class="p-4">
                        <h3 class="font-semibold text-gray-900 mb-2">Product ${i}</h3>
                        <p class="text-gray-600 text-sm mb-3">High-quality product with amazing features</p>
                        <div class="flex items-center justify-between">
                            <span class="text-2xl font-bold text-purple-600">$${(i * 25 + 49)}</span>
                            <button class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    </section>

    <!-- Categories -->
    <section class="bg-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="text-3xl font-bold text-center mb-12">Shop by Category</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                ${['Electronics', 'Fashion', 'Home', 'Sports'].map(category => `
                    <div class="text-center p-6 border border-gray-200 rounded-lg hover:border-purple-500 transition-colors cursor-pointer">
                        <div class="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                            </svg>
                        </div>
                        <h3 class="font-semibold text-gray-900">${category}</h3>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <div class="flex items-center mb-4">
                        <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-3"></div>
                        <h3 class="text-xl font-bold">Store</h3>
                    </div>
                    <p class="text-gray-400">Your one-stop shop for amazing products.</p>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Quick Links</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="#" class="hover:text-white">About Us</a></li>
                        <li><a href="#" class="hover:text-white">Contact</a></li>
                        <li><a href="#" class="hover:text-white">Support</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Categories</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="#" class="hover:text-white">Electronics</a></li>
                        <li><a href="#" class="hover:text-white">Fashion</a></li>
                        <li><a href="#" class="hover:text-white">Home</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Newsletter</h4>
                    <p class="text-gray-400 mb-4">Subscribe for updates and offers</p>
                    <div class="flex">
                        <input type="email" placeholder="Your email" class="flex-1 px-4 py-2 rounded-l-lg text-gray-900">
                        <button class="bg-purple-600 px-4 py-2 rounded-r-lg hover:bg-purple-700">Subscribe</button>
                    </div>
                </div>
            </div>
            <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2025 Store. Built with File Tree Generator.</p>
            </div>
        </div>
    </footer>
</body>
</html>`;
}

function generateDashboardPreview(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Analytics Dashboard Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-gray-50">
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
                    <a href="#" class="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                        </svg>
                        Users
                    </a>
                    <a href="#" class="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 
                                                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        Settings
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
                    <div class="flex items-center space-x-4">
                        <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            Export Report
                        </button>
                    </div>
                </div>
            </header>

            <!-- Dashboard Content -->
            <div class="p-6">
                <!-- Stats Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white p-6 rounded-lg shadow-sm border">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">Total Revenue</p>
                                <p class="text-2xl font-bold text-gray-900">$45,231.89</p>
                                <p class="text-xs text-green-600 flex items-center mt-1">
                                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                                    </svg>
                                    +20.1% from last month
                                </p>
                            </div>
                            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white p-6 rounded-lg shadow-sm border">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">Subscriptions</p>
                                <p class="text-2xl font-bold text-gray-900">+2350</p>
                                <p class="text-xs text-green-600 flex items-center mt-1">
                                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                                    </svg>
                                    +180.1% from last month
                                </p>
                            </div>
                            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white p-6 rounded-lg shadow-sm border">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">Sales</p>
                                <p class="text-2xl font-bold text-gray-900">+12,234</p>
                                <p class="text-xs text-green-600 flex items-center mt-1">
                                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                                    </svg>
                                    +19% from last month
                                </p>
                            </div>
                            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white p-6 rounded-lg shadow-sm border">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">Active Now</p>
                                <p class="text-2xl font-bold text-gray-900">+573</p>
                                <p class="text-xs text-green-600 flex items-center mt-1">
                                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                                    </svg>
                                    +201 since last hour
                                </p>
                            </div>
                            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Charts Section -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div class="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
                        <div class="h-64 bg-gradient-to-t from-blue-50 to-white rounded-lg flex items-end justify-center p-4">
                            <div class="flex items-end space-x-2 h-full">
                                ${Array.from({length: 12}, (_, i) => `
                                    <div class="bg-blue-500 rounded-t" style="height: ${20 + Math.random() * 60}%; width: 20px;"></div>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <div class="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">User Activity</h3>
                        <div class="h-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center">
                            <div class="relative w-32 h-32">
                                <div class="absolute inset-0 rounded-full border-8 border-purple-200"></div>
                                <div class="absolute inset-0 rounded-full border-8 border-purple-500 border-t-transparent transform rotate-45"></div>
                                <div class="absolute inset-4 rounded-full bg-white flex items-center justify-center">
                                    <div class="text-center">
                                        <div class="text-2xl font-bold text-purple-600">72%</div>
                                        <div class="text-xs text-gray-500">Active</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recent Activity -->
                <div class="bg-white rounded-lg shadow-sm border">
                    <div class="p-6 border-b">
                        <h3 class="text-lg font-semibold text-gray-900">Recent Activity</h3>
                    </div>
                    <div class="divide-y">
                        ${Array.from({length: 5}, (_, i) => `
                            <div class="p-6 flex items-center justify-between">
                                <div class="flex items-center">
                                    <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                                        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <p class="font-medium text-gray-900">User ${i + 1} signed up</p>
                                        <p class="text-sm text-gray-500">${Math.floor(Math.random() * 60)} minutes ago</p>
                                    </div>
                                </div>
                                <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">New</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </main>
    </div>
</body>
</html>`;
}

function generateBlogPreview(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog & CMS Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center py-6">
                <div class="flex items-center">
                    <div class="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg mr-3"></div>
                    <h1 class="text-2xl font-bold text-gray-900">Blog</h1>
                </div>
                <nav class="hidden md:flex space-x-8">
                    <a href="#" class="text-gray-600 hover:text-gray-900">Home</a>
                    <a href="#" class="text-gray-600 hover:text-gray-900">Articles</a>
                    <a href="#" class="text-gray-600 hover:text-gray-900">Categories</a>
                    <a href="#" class="text-gray-600 hover:text-gray-900">About</a>
                </nav>
            </div>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-orange-50 to-red-50 py-16">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Thoughts, Stories & Ideas
            </h1>
            <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Explore our collection of articles, tutorials, and insights on technology, design, and innovation.
            </p>
            <div class="flex justify-center">
                <div class="relative max-w-md w-full">
                    <input type="search" placeholder="Search articles..." class="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </div>
            </div>
        </div>
    </section>

    <!-- Featured Article -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div class="md:flex">
                <div class="md:w-1/2">
                    <div class="bg-gradient-to-br from-orange-100 to-red-100 h-64 md:h-full flex items-center justify-center">
                        <svg class="w-24 h-24 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                </div>
                <div class="md:w-1/2 p-8">
                    <div class="flex items-center mb-4">
                        <span class="bg-orange-100 text-orange-800 text-xs font-medium px-3 py-1 rounded-full">Featured</span>
                        <span class="text-gray-500 text-sm ml-4">5 min read</span>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">Building Modern Web Applications</h2>
                    <p class="text-gray-600 mb-6">
                        Discover the latest trends and best practices for creating fast, secure, and scalable web applications in 2025.
                    </p>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <div class="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                            <div>
                                <p class="font-medium text-gray-900">John Doe</p>
                                <p class="text-sm text-gray-500">2 days ago</p>
                            </div>
                        </div>
                        <button class="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                            Read More
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Articles Grid -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div class="flex items-center justify-between mb-8">
            <h2 class="text-2xl font-bold text-gray-900">Latest Articles</h2>
            <div class="flex space-x-2">
                <button class="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm">All</button>
                <button class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Tech</button>
                <button class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Design</button>
                <button class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Business</button>
            </div>
        </div>

        <div class="grid gap-8">
            ${Array.from({length: 4}, (_, i) => `
                <article class="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-shadow">
                    <div class="md:flex">
                        <div class="md:w-1/3">
                            <div class="bg-gradient-to-br from-gray-100 to-gray-200 h-48 md:h-full flex items-center justify-center">
                                <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                        </div>
                        <div class="md:w-2/3 p-6">
                            <div class="flex items-center mb-3">
                                <span class="bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded-full">${['Tech', 'Design', 'Business', 'Tutorial'][i]}</span>
                                <span class="text-gray-500 text-sm ml-4">${Math.floor(Math.random() * 10) + 3} min read</span>
                            </div>
                            <h3 class="text-xl font-bold text-gray-900 mb-3 hover:text-orange-600 cursor-pointer">
                                ${[
                                    'The Future of Web Development',
                                    'Design Systems That Scale',
                                    'Building Successful Products',
                                    'Advanced React Patterns'
                                ][i]}
                            </h3>
                            <p class="text-gray-600 mb-4">
                                ${[
                                    'Exploring emerging technologies and frameworks that will shape the future of web development.',
                                    'Learn how to create and maintain design systems that grow with your organization.',
                                    'Key strategies and insights for building products that users love and businesses need.',
                                    'Deep dive into advanced React patterns for building scalable applications.'
                                ][i]}
                            </p>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <div class="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                                    <div>
                                        <p class="font-medium text-gray-900 text-sm">${['Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'Tom Brown'][i]}</p>
                                        <p class="text-xs text-gray-500">${Math.floor(Math.random() * 7) + 1} days ago</p>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-4 text-gray-500">
                                    <div class="flex items-center">
                                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                        </svg>
                                        <span class="text-sm">${Math.floor(Math.random() * 100) + 20}</span>
                                    </div>
                                    <div class="flex items-center">
                                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                        </svg>
                                        <span class="text-sm">${Math.floor(Math.random() * 20) + 5}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            `).join('')}
        </div>

        <!-- Load More -->
        <div class="text-center mt-12">
            <button class="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                Load More Articles
            </button>
        </div>
    </section>

    <!-- Newsletter -->
    <section class="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-3xl font-bold mb-4">Stay Updated</h2>
            <p class="text-xl mb-8 opacity-90">Get the latest articles and insights delivered to your inbox.</p>
            <div class="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 max-w-md mx-auto">
                <input type="email" placeholder="Enter your email" class="w-full px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:ring-opacity-50">
                <button class="w-full sm:w-auto bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Subscribe
                </button>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-white border-t py-12">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <div class="flex items-center mb-4">
                        <div class="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg mr-3"></div>
                        <h3 class="text-xl font-bold text-gray-900">Blog</h3>
                    </div>
                    <p class="text-gray-600">Sharing knowledge and insights about technology, design, and innovation.</p>
                </div>
                <div>
                    <h4 class="font-semibold text-gray-900 mb-4">Categories</h4>
                    <ul class="space-y-2 text-gray-600">
                        <li><a href="#" class="hover:text-orange-600">Technology</a></li>
                        <li><a href="#" class="hover:text-orange-600">Design</a></li>
                        <li><a href="#" class="hover:text-orange-600">Business</a></li>
                        <li><a href="#" class="hover:text-orange-600">Tutorials</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold text-gray-900 mb-4">Connect</h4>
                    <ul class="space-y-2 text-gray-600">
                        <li><a href="#" class="hover:text-orange-600">Twitter</a></li>
                        <li><a href="#" class="hover:text-orange-600">LinkedIn</a></li>
                        <li><a href="#" class="hover:text-orange-600">GitHub</a></li>
                        <li><a href="#" class="hover:text-orange-600">RSS Feed</a></li>
                    </ul>
                </div>
            </div>
            <div class="border-t mt-8 pt-8 text-center text-gray-500">
                <p>&copy; 2025 Blog. Built with File Tree Generator.</p>
            </div>
        </div>
    </footer>
</body>
</html>`;
}

function generateAPIPreview(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Documentation Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
    </style>
</head>
<body class="bg-gray-50">
    <div class="min-h-screen">
        <!-- Header -->
        <header class="bg-white shadow-sm border-b">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center py-4">
                    <div class="flex items-center">
                        <div class="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg mr-3"></div>
                        <h1 class="text-2xl font-bold text-gray-900">API Documentation</h1>
                    </div>
                    <div class
                                            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        Settings
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
                    <div class="flex items-center space-x-4">
                        <span class="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">v1.0.0</span>
                        <button class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                            Try API
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <!-- Sidebar -->
                <aside class="lg:col-span-1">
                    <nav class="bg-white rounded-lg shadow-sm border p-4 sticky top-8">
                        <h3 class="font-semibold text-gray-900 mb-4">Endpoints</h3>
                        <ul class="space-y-2">
                            <li><a href="#auth" class="block px-3 py-2 text-green-600 bg-green-50 rounded-lg text-sm font-medium">Authentication</a></li>
                            <li><a href="#users" class="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm">Users</a></li>
                            <li><a href="#posts" class="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm">Posts</a></li>
                            <li><a href="#files" class="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm">File Upload</a></li>
                        </ul>
                    </nav>
                </aside>

                <!-- Main Content -->
                <main class="lg:col-span-3 space-y-8">
                    <!-- Introduction -->
                    <div class="bg-white rounded-lg shadow-sm border p-8">
                        <h1 class="text-3xl font-bold text-gray-900 mb-4">FastAPI Backend Documentation</h1>
                        <p class="text-gray-600 mb-6">
                            A high-performance REST API built with FastAPI, featuring authentication, 
                            database integration, and comprehensive documentation.
                        </p>
                        
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div class="bg-green-50 p-4 rounded-lg">
                                <h4 class="font-semibold text-green-900">Base URL</h4>
                                <code class="text-green-700 text-sm">https://api.example.com/v1</code>
                            </div>
                            <div class="bg-blue-50 p-4 rounded-lg">
                                <h4 class="font-semibold text-blue-900">Authentication</h4>
                                <code class="text-blue-700 text-sm">Bearer Token</code>
                            </div>
                            <div class="bg-purple-50 p-4 rounded-lg">
                                <h4 class="font-semibold text-purple-900">Rate Limit</h4>
                                <code class="text-purple-700 text-sm">1000/hour</code>
                            </div>
                        </div>
                    </div>

                    <!-- Authentication Endpoint -->
                    <div id="auth" class="bg-white rounded-lg shadow-sm border">
                        <div class="p-6 border-b">
                            <h2 class="text-2xl font-bold text-gray-900">Authentication</h2>
                            <p class="text-gray-600 mt-2">Manage user authentication and JWT tokens</p>
                        </div>
                        
                        <div class="p-6 space-y-6">
                            <!-- Login Endpoint -->
                            <div class="border border-gray-200 rounded-lg">
                                <div class="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
                                    <div class="flex items-center">
                                        <span class="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded mr-3">POST</span>
                                        <code class="font-mono text-sm">/auth/login</code>
                                    </div>
                                    <span class="text-sm text-gray-500">Authenticate user</span>
                                </div>
                                
                                <div class="p-4">
                                    <h4 class="font-semibold mb-2">Request Body:</h4>
                                    <pre class="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto font-mono">
{
  "email": "user@example.com",
  "password": "securepassword"
}</pre>
                                    
                                    <h4 class="font-semibold mb-2 mt-4">Response:</h4>
                                    <pre class="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto font-mono">
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "expires_in": 3600
}</pre>
                                </div>
                            </div>

                            <!-- Register Endpoint -->
                            <div class="border border-gray-200 rounded-lg">
                                <div class="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
                                    <div class="flex items-center">
                                        <span class="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded mr-3">POST</span>
                                        <code class="font-mono text-sm">/auth/register</code>
                                    </div>
                                    <span class="text-sm text-gray-500">Create new user</span>
                                </div>
                                
                                <div class="p-4">
                                    <h4 class="font-semibold mb-2">Request Body:</h4>
                                    <pre class="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto font-mono">
{
  "email": "newuser@example.com",
  "password": "securepassword",
  "name": "John Doe"
}</pre>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Users Endpoint -->
                    <div id="users" class="bg-white rounded-lg shadow-sm border">
                        <div class="p-6 border-b">
                            <h2 class="text-2xl font-bold text-gray-900">Users</h2>
                            <p class="text-gray-600 mt-2">User management and profile operations</p>
                        </div>
                        
                        <div class="p-6 space-y-6">
                            <div class="border border-gray-200 rounded-lg">
                                <div class="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
                                    <div class="flex items-center">
                                        <span class="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded mr-3">GET</span>
                                        <code class="font-mono text-sm">/users/me</code>
                                    </div>
                                    <span class="text-sm text-gray-500">Get current user</span>
                                </div>
                                
                                <div class="p-4">
                                    <h4 class="font-semibold mb-2">Headers:</h4>
                                    <pre class="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto font-mono">
Authorization: Bearer {access_token}</pre>
                                    
                                    <h4 class="font-semibold mb-2 mt-4">Response:</h4>
                                    <pre class="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto font-mono">
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2025-01-01T00:00:00Z",
  "is_active": true
}</pre>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Status Codes -->
                    <div class="bg-white rounded-lg shadow-sm border">
                        <div class="p-6 border-b">
                            <h2 class="text-2xl font-bold text-gray-900">Status Codes</h2>
                        </div>
                        
                        <div class="p-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="space-y-2">
                                    <div class="flex items-center">
                                        <span class="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded mr-3 w-12 text-center">200</span>
                                        <span class="text-sm">OK - Request successful</span>
                                    </div>
                                    <div class="flex items-center">
                                        <span class="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded mr-3 w-12 text-center">201</span>
                                        <span class="text-sm">Created - Resource created</span>
                                    </div>
                                    <div class="flex items-center">
                                        <span class="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded mr-3 w-12 text-center">400</span>
                                        <span class="text-sm">Bad Request - Invalid input</span>
                                    </div>
                                </div>
                                <div class="space-y-2">
                                    <div class="flex items-center">
                                        <span class="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded mr-3 w-12 text-center">401</span>
                                        <span class="text-sm">Unauthorized - Invalid token</span>
                                    </div>
                                    <div class="flex items-center">
                                        <span class="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded mr-3 w-12 text-center">404</span>
                                        <span class="text-sm">Not Found - Resource not found</span>
                                    </div>
                                    <div class="flex items-center">
                                        <span class="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded mr-3 w-12 text-center">500</span>
                                        <span class="text-sm">Server Error - Internal error</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Interactive API Tester -->
                    <div class="bg-white rounded-lg shadow-sm border">
                        <div class="p-6 border-b">
                            <h2 class="text-2xl font-bold text-gray-900">API Tester</h2>
                            <p class="text-gray-600 mt-2">Test API endpoints directly from the documentation</p>
                        </div>
                        
                        <div class="p-6">
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Endpoint</label>
                                <select class="w-full p-3 border border-gray-300 rounded-lg">
                                    <option>POST /auth/login</option>
                                    <option>GET /users/me</option>
                                    <option>POST /users</option>
                                </select>
                            </div>
                            
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Request Body</label>
                                <textarea 
                                    class="w-full h-32 p-3 border border-gray-300 rounded-lg font-mono text-sm"
                                    placeholder='{"email": "test@example.com", "password": "password"}'
                                ></textarea>
                            </div>
                            
                            <button class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                                Send Request
                            </button>
                            
                            <div class="mt-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Response</label>
                                <div class="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono h-24 flex items-center justify-center text-gray-500">
                                    Response will appear here...
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    </div>
</body>
</html>`;
}="flex items-center space-x-4">
                        <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            Export Report
                        </button>
                    </div>
                </div>
            </header>

            <!-- Dashboard Content -->
            <div class="p-6">
                <!-- Stats Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white p-6 rounded-lg shadow-sm border">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">Total Revenue</p>
                                <p class="text-2xl font-bold text-gray-900">$45,231.89</p>
                                <p class="text-xs text-green-600 flex items-center mt-1">
                                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                                    </svg>
                                    +20.1% from last month
                                </p>
                            </div>
                            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white p-6 rounded-lg shadow-sm border">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">Subscriptions</p>
                                <p class="text-2xl font-bold text-gray-900">+2350</p>
                                <p class="text-xs text-green-600 flex items-center mt-1">
                                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                                    </svg>
                                    +180.1% from last month
                                </p>
                            </div>
                            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white p-6 rounded-lg shadow-sm border">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">Sales</p>
                                <p class="text-2xl font-bold text-gray-900">+12,234</p>
                                <p class="text-xs text-green-600 flex items-center mt-1">
                                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                                    </svg>
                                    +19% from last month
                                </p>
                            </div>
                            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white p-6 rounded-lg shadow-sm border">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">Active Now</p>
                                <p class="text-2xl font-bold text-gray-900">+573</p>
                                <p class="text-xs text-green-600 flex items-center mt-1">
                                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                                    </svg>
                                    +201 since last hour
                                </p>
                            </div>
                            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Charts Section -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div class="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
                        <div class="h-64 bg-gradient-to-t from-blue-50 to-white rounded-lg flex items-end justify-center p-4">
                            <div class="flex items-end space-x-2 h-full">
                                ${Array.from({length: 12}, (_, i) => `
                                    <div class="bg-blue-500 rounded-t" style="height: ${20 + Math.random() * 60}%; width: 20px;"></div>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <div class="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">User Activity</h3>
                        <div class="h-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center">
                            <div class="relative w-32 h-32">
                                <div class="absolute inset-0 rounded-full border-8 border-purple-200"></div>
                                <div class="absolute inset-0 rounded-full border-8 border-purple-500 border-t-transparent transform rotate-45"></div>
                                <div class="absolute inset-4 rounded-full bg-white flex items-center justify-center">
                                    <div class="text-center">
                                        <div class="text-2xl font-bold text-purple-600">72%</div>
                                        <div class="text-xs text-gray-500">Active</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recent Activity -->
                <div class="bg-white rounded-lg shadow-sm border">
                    <div class="p-6 border-b">
                        <h3 class="text-lg font-semibold text-gray-900">Recent Activity</h3>
                    </div>
                    <div class="divide-y">
                        ${Array.from({length: 5}, (_, i) => `
                            <div class="p-6 flex items-center justify-between">
                                <div class="flex items-center">
                                    <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                                        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <p class="font-medium text-gray-900">User ${i + 1} signed up</p>
                                        <p class="text-sm text-gray-500">${Math.floor(Math.random() * 60)} minutes ago</p>
                                    </div>
                                </div>
                                <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">New</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </main>
    </div>
</body>
</html>`;
}

function generateBlogPreview(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog & CMS Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center py-6">
                <div class="flex items-center">
                    <div class="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg mr-3"></div>
                    <h1 class="text-2xl font-bold text-gray-900">Blog</h1>
                </div>
                <nav class="hidden md:flex space-x-8">
                    <a href="#" class="text-gray-600 hover:text-gray-900">Home</a>
                    <a href="#" class="text-gray-600 hover:text-gray-900">Articles</a>
                    <a href="#" class="text-gray-600 hover:text-gray-900">Categories</a>
                    <a href="#" class="text-gray-600 hover:text-gray-900">About</a>
                </nav>
            </div>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-orange-50 to-red-50 py-16">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Thoughts, Stories & Ideas
            </h1>
            <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Explore our collection of articles, tutorials, and insights on technology, design, and innovation.
            </p>
            <div class="flex justify-center">
                <div class="relative max-w-md w-full">
                    <input type="search" placeholder="Search articles..." class="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </div>
            </div>
        </div>
    </section>

    <!-- Featured Article -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div class="md:flex">
                <div class="md:w-1/2">
                    <div class="bg-gradient-to-br from-orange-100 to-red-100 h-64 md:h-full flex items-center justify-center">
                        <svg class="w-24 h-24 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                </div>
                <div class="md:w-1/2 p-8">
                    <div class="flex items-center mb-4">
                        <span class="bg-orange-100 text-orange-800 text-xs font-medium px-3 py-1 rounded-full">Featured</span>
                        <span class="text-gray-500 text-sm ml-4">5 min read</span>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">Building Modern Web Applications</h2>
                    <p class="text-gray-600 mb-6">
                        Discover the latest trends and best practices for creating fast, secure, and scalable web applications in 2025.
                    </p>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <div class="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                            <div>
                                <p class="font-medium text-gray-900">John Doe</p>
                                <p class="text-sm text-gray-500">2 days ago</p>
                            </div>
                        </div>
                        <button class="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                            Read More
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Articles Grid -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div class="flex items-center justify-between mb-8">
            <h2 class="text-2xl font-bold text-gray-900">Latest Articles</h2>
            <div class="flex space-x-2">
                <button class="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm">All</button>
                <button class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Tech</button>
                <button class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Design</button>
                <button class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Business</button>
            </div>
        </div>

        <div class="grid gap-8">
            ${Array.from({length: 4}, (_, i) => `
                <article class="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-shadow">
                    <div class="md:flex">
                        <div class="md:w-1/3">
                            <div class="bg-gradient-to-br from-gray-100 to-gray-200 h-48 md:h-full flex items-center justify-center">
                                <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                        </div>
                        <div class="md:w-2/3 p-6">
                            <div class="flex items-center mb-3">
                                <span class="bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded-full">${['Tech', 'Design', 'Business', 'Tutorial'][i]}</span>
                                <span class="text-gray-500 text-sm ml-4">${Math.floor(Math.random() * 10) + 3} min read</span>
                            </div>
                            <h3 class="text-xl font-bold text-gray-900 mb-3 hover:text-orange-600 cursor-pointer">
                                ${[
                                    'The Future of Web Development',
                                    'Design Systems That Scale',
                                    'Building Successful Products',
                                    'Advanced React Patterns'
                                ][i]}
                            </h3>
                            <p class="text-gray-600 mb-4">
                                ${[
                                    'Exploring emerging technologies and frameworks that will shape the future of web development.',
                                    'Learn how to create and maintain design systems that grow with your organization.',
                                    'Key strategies and insights for building products that users love and businesses need.',
                                    'Deep dive into advanced React patterns for building scalable applications.'
                                ][i]}
                            </p>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <div class="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                                    <div>
                                        <p class="font-medium text-gray-900 text-sm">${['Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'Tom Brown'][i]}</p>
                                        <p class="text-xs text-gray-500">${Math.floor(Math.random() * 7) + 1} days ago</p>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-4 text-gray-500">
                                    <div class="flex items-center">
                                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                        </svg>
                                        <span class="text-sm">${Math.floor(Math.random() * 100) + 20}</span>
                                    </div>
                                    <div class="flex items-center">
                                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                        </svg>
                                        <span class="text-sm">${Math.floor(Math.random() * 20) + 5}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            `).join('')}
        </div>

        <!-- Load More -->
        <div class="text-center mt-12">
            <button class="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                Load More Articles
            </button>
        </div>
    </section>

    <!-- Newsletter -->
    <section class="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-3xl font-bold mb-4">Stay Updated</h2>
            <p class="text-xl mb-8 opacity-90">Get the latest articles and insights delivered to your inbox.</p>
            <div class="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 max-w-md mx-auto">
                <input type="email" placeholder="Enter your email" class="w-full px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:ring-opacity-50">
                <button class="w-full sm:w-auto bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Subscribe
                </button>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-white border-t py-12">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <div class="flex items-center mb-4">
                        <div class="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg mr-3"></div>
                        <h3 class="text-xl font-bold text-gray-900">Blog</h3>
                    </div>
                    <p class="text-gray-600">Sharing knowledge and insights about technology, design, and innovation.</p>
                </div>
                <div>
                    <h4 class="font-semibold text-gray-900 mb-4">Categories</h4>
                    <ul class="space-y-2 text-gray-600">
                        <li><a href="#" class="hover:text-orange-600">Technology</a></li>
                        <li><a href="#" class="hover:text-orange-600">Design</a></li>
                        <li><a href="#" class="hover:text-orange-600">Business</a></li>
                        <li><a href="#" class="hover:text-orange-600">Tutorials</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold text-gray-900 mb-4">Connect</h4>
                    <ul class="space-y-2 text-gray-600">
                        <li><a href="#" class="hover:text-orange-600">Twitter</a></li>
                        <li><a href="#" class="hover:text-orange-600">LinkedIn</a></li>
                        <li><a href="#" class="hover:text-orange-600">GitHub</a></li>
                        <li><a href="#" class="hover:text-orange-600">RSS Feed</a></li>
                    </ul>
                </div>
            </div>
            <div class="border-t mt-8 pt-8 text-center text-gray-500">
                <p>&copy; 2025 Blog. Built with File Tree Generator.</p>
            </div>
        </div>
    </footer>
</body>
</html>`;
}

function generateAPIPreview(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Documentation Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
    </style>
</head>
<body class="bg-gray-50">
    <div class="min-h-screen">
        <!-- Header -->
        <header class="bg-white shadow-sm border-b">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center py-4">
                    <div class="flex items-center">
                        <div class="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg mr-3"></div>
                        <h1 class="text-2xl font-bold text-gray-900">API Documentation</h1>
                    </div>
                    <div class// src/app/api/preview/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const template = searchParams.get('template') || 'nextjs-saas-complete';
  
  // Generate preview HTML based on template
  const previewHtml = generatePreviewHtml(template);
  
  return new NextResponse(previewHtml, {
    headers: {
      'Content-Type': 'text/html',
      'X-Frame-Options': 'SAMEORIGIN'
    }
  });
}

function generatePreviewHtml(template: string): string {
  const templates: Record<string, string> = {
    'nextjs-saas-complete': generateSaaSPreview(),
    'nextjs-ecommerce-advanced': generateEcommercePreview(),
    'react-dashboard-pro': generateDashboardPreview(),
    'nextjs-blog-cms': generateBlogPreview(),
    'fastapi-backend': generateAPIPreview()
  };

  return templates[template] || templates['nextjs-saas-complete'];
}

function generateSaaSPreview(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SaaS Platform Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-gray-50">
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

        <!-- Features Grid -->
        <div class="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-white p-6 rounded-xl shadow-sm border">
                <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                </div>
                <h3 class="text-xl font-semibold mb-2">Lightning Fast</h3>
                <p class="text-gray-600">Built for speed and performance. Your users will love the experience.</p>
            </div>
            
            <div class="bg-white p-6 rounded-xl shadow-sm border">
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <h3 class="text-xl font-semibold mb-2">Secure by Default</h3>
                <p class="text-gray-600">Enterprise-grade security with authentication and authorization built-in.</p>
            </div>
            
            <div class="bg-white p-6 rounded-xl shadow-sm border">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                    </svg>
                </div>
                <h3 class="text-xl font-semibold mb-2">Analytics Ready</h3>
                <p class="text-gray-600">Comprehensive dashboard with real-time analytics and reporting.</p>
            </div>
        </div>

        <!-- Dashboard Preview -->
        <div class="mt-20 bg-white rounded-2xl shadow-xl border p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">Dashboard Preview</h2>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
                    <h3 class="text-sm font-medium text-blue-600">Total Users</h3>
                    <p class="text-3xl font-bold text-blue-900">12,345</p>
                    <p class="text-sm text-blue-600">+15% from last month</p>
                </div>
                <div class="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg">
                    <h3 class="text-sm font-medium text-green-600">Revenue</h3>
                    <p class="text-3xl font-bold text-green-900">$89,432</p>
                    <p class="text-sm text-green-600">+22% from last month</p>
                </div>
                <div class="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg">
                    <h3 class="text-sm font-medium text-purple-600">Conversion</h3>
                    <p class="text-3xl font-bold text-purple-900">3.2%</p>
                    <p class="text-sm text-purple-600">+0.5% from last month</p>
                </div>
                <div class="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg">
                    <h3 class="text-sm font-medium text-orange-600">Growth</h3>
                    <p class="text-3xl font-bold text-orange-900">+28%</p>
                    <p class="text-sm text-orange-600">+5% from last month</p>
                </div>
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
</body>
</html>`;
}

function generateEcommercePreview(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E-commerce Store Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center py-4">
                <div class="flex items-center">
                    <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-3"></div>
                    <h1 class="text-2xl font-bold text-gray-900">Store</h1>
                </div>
                <nav class="hidden md:flex items-center space-x-8">
                    <a href="#" class="text-gray-600 hover:text-gray-900">Products</a>
                    <a href="#" class="text-gray-600 hover:text-gray-900">Categories</a>
                    <a href="#" class="text-gray-600 hover:text-gray-900">About</a>
                    <button class="relative p-2">
                        <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4-2L7 13v1a1 1 0 001 1h9a1 1 0 001-1v-1m-10 2h.01M19 16h.01M6 20h.01"></path>
                        </svg>
                        <span class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">2</span>
                    </button>
                </nav>
            </div>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="text-5xl font-bold mb-4">Discover Amazing Products</h1>
            <p class="text-xl mb-8 opacity-90">Shop the latest trends with free shipping worldwide</p>
            <button class="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Shop Now
            </button>
        </div>
    </section>

    <!-- Featured Products -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 class="text-3xl font-bold text-center mb-12">Featured Products</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            ${[1, 2, 3, 4].map(i => `
                <div class="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-shadow">
                    <div class="bg-gradient-to-br from-gray-100 to-gray-200 h-48 flex items-center justify-center">
                        <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    <div class="p-4">
                        <h3 class="font-semibold text-gray-900 mb-2">Product ${i}</h3>
                        <p class="text-gray-600 text-sm mb-3">High-quality product with amazing features</p>
                        <div class="flex items-center justify-between">
                            <span class="text-2xl font-bold text-purple-600">$${(i * 25 + 49)}</span>
                            <button class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    </section>

    <!-- Categories -->
    <section class="bg-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="text-3xl font-bold text-center mb-12">Shop by Category</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                ${['Electronics', 'Fashion', 'Home', 'Sports'].map(category => `
                    <div class="text-center p-6 border border-gray-200 rounded-lg hover:border-purple-500 transition-colors cursor-pointer">
                        <div class="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                            </svg>
                        </div>
                        <h3 class="font-semibold text-gray-900">${category}</h3>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <div class="flex items-center mb-4">
                        <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-3"></div>
                        <h3 class="text-xl font-bold">Store</h3>
                    </div>
                    <p class="text-gray-400">Your one-stop shop for amazing products.</p>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Quick Links</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="#" class="hover:text-white">About Us</a></li>
                        <li><a href="#" class="hover:text-white">Contact</a></li>
                        <li><a href="#" class="hover:text-white">Support</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Categories</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="#" class="hover:text-white">Electronics</a></li>
                        <li><a href="#" class="hover:text-white">Fashion</a></li>
                        <li><a href="#" class="hover:text-white">Home</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Newsletter</h4>
                    <p class="text-gray-400 mb-4">Subscribe for updates and offers</p>
                    <div class="flex">
                        <input type="email" placeholder="Your email" class="flex-1 px-4 py-2 rounded-l-lg text-gray-900">
                        <button class="bg-purple-600 px-4 py-2 rounded-r-lg hover:bg-purple-700">Subscribe</button>
                    </div>
                </div>
            </div>
            <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2025 Store. Built with File Tree Generator.</p>
            </div>
        </div>
    </footer>
</body>
</html>`;
}

function generateDashboardPreview(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Analytics Dashboard Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-gray-50">
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
                    <a href="#" class="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                        </svg>
                        Users
                    </a>
                    <a href="#" class="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 
