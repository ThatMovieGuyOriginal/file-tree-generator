// src/lib/preview-templates/blog-preview.ts
import { generateBaseHTML } from './base-template';

export const generateBlogPreview = (): string => {
  const content = `
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
        </div>
    </section>

    <!-- Featured Article -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
            <div class="md:flex">
                <div class="md:w-1/2">
                    <div class="bg-gradient-to-br from-orange-100 to-red-100 h-64 md:h-full flex items-center justify-center">
                        <svg class="w-24 h-24 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                </div>
                <div class="md:w-1/2 p-8">
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">Building Modern Web Applications</h2>
                    <p class="text-gray-600 mb-6">
                        Discover the latest trends and best practices for creating fast, secure, and scalable web applications.
                    </p>
                    <button class="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                        Read More
                    </button>
                </div>
            </div>
        </div>

        <!-- Articles Grid -->
        <div class="grid gap-8">
            ${Array.from({length: 3}, (_, i) => `
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
                            <h3 class="text-xl font-bold text-gray-900 mb-3 hover:text-orange-600 cursor-pointer">
                                ${['The Future of Web Development', 'Design Systems That Scale', 'Building Great Products'][i]}
                            </h3>
                            <p class="text-gray-600 mb-4">
                                ${['Exploring emerging technologies that will shape development.', 'Learn how to create maintainable design systems.', 'Key strategies for building products users love.'][i]}
                            </p>
                            <div class="text-sm text-gray-500">
                                <span>${Math.floor(Math.random() * 7) + 1} days ago</span>
                                <span class="mx-2">•</span>
                                <span>${Math.floor(Math.random() * 10) + 3} min read</span>
                            </div>
                        </div>
                    </div>
                </article>
            `).join('')}
        </div>
    </section>
  `;

  return generateBaseHTML('Blog & CMS Preview', content);
};
