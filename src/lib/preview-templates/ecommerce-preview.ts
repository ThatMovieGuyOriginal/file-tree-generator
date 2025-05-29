// src/lib/preview-templates/ecommerce-preview.ts
import { generateBaseHTML } from './base-template';

export const generateEcommercePreview = (): string => {
  const content = `
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
            ${Array.from({length: 4}, (_, i) => `
                <div class="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-shadow">
                    <div class="bg-gradient-to-br from-gray-100 to-gray-200 h-48 flex items-center justify-center">
                        <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    <div class="p-4">
                        <h3 class="font-semibold text-gray-900 mb-2">Product ${i + 1}</h3>
                        <p class="text-gray-600 text-sm mb-3">High-quality product with amazing features</p>
                        <div class="flex items-center justify-between">
                            <span class="text-2xl font-bold text-purple-600">${(i + 1) * 25 + 49}</span>
                            <button class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    </section>
  `;

  return generateBaseHTML('E-commerce Store Preview', content);
};
