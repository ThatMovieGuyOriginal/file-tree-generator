// src/lib/preview-templates/api-preview.ts
import { generateBaseHTML } from './base-template';

export const generateAPIPreview = (): string => {
  const additionalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');
    .font-mono { font-family: 'JetBrains Mono', monospace; }
  `;

  const content = `
    <div class="min-h-screen">
        <!-- Header -->
        <header class="bg-white shadow-sm border-b">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center py-4">
                    <div class="flex items-center">
                        <div class="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg mr-3"></div>
                        <h1 class="text-2xl font-bold text-gray-900">API Documentation</h1>
                    </div>
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
                        </ul>
                    </nav>
                </aside>

                <!-- Main Content -->
                <main class="lg:col-span-3 space-y-8">
                    <!-- Introduction -->
                    <div class="bg-white rounded-lg shadow-sm border p-8">
                        <h1 class="text-3xl font-bold text-gray-900 mb-4">FastAPI Backend Documentation</h1>
                        <p class="text-gray-600 mb-6">
                            A high-performance REST API built with FastAPI, featuring authentication and comprehensive documentation.
                        </p>
                        
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                    <!-- API Endpoint Example -->
                    <div class="bg-white rounded-lg shadow-sm border">
                        <div class="p-6 border-b">
                            <h2 class="text-2xl font-bold text-gray-900">Authentication</h2>
                        </div>
                        
                        <div class="p-6">
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
                                    <pre class="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
{
  "email": "user@example.com",
  "password": "securepassword"
}</pre>
                                    
                                    <h4 class="font-semibold mb-2 mt-4">Response:</h4>
                                    <pre class="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "expires_in": 3600
}</pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    </div>
  `;

  return generateBaseHTML('API Documentation Preview', content, additionalStyles);
};
