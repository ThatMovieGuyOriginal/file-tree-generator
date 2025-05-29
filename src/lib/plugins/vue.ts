// src/lib/plugins/vue.ts
import { LanguagePlugin } from '@/types/plugin';

export default {
  id: 'vue',
  name: 'Vue.js',
  description: 'Vue 3 application with Vite',
  version: '1.0.0',
  category: 'frontend',
  extensions: ['.vue', '.ts', '.js'],
  configFiles: ['vite.config.ts', 'tsconfig.json'],
  sampleTree: `my-vue-app/
├── package.json
├── vite.config.ts
├── src/
│   ├── App.vue
│   ├── main.ts
│   └── components/
└── public/`,
  generateContent: () => '// Vue content',
  dependencies: { runtime: ['vue'], devDependencies: ['@vitejs/plugin-vue'] },
  metadata: { author: 'File Tree Generator', tags: ['spa'], difficulty: 'beginner' }
} as LanguagePlugin;
