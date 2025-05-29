// src/lib/plugins/node.ts
import { LanguagePlugin } from '@/types/plugin';

export default {
  id: 'node',
  name: 'Node.js + Express',
  description: 'Node.js backend with Express and TypeScript',
  version: '1.0.0',
  category: 'backend',
  extensions: ['.js', '.ts'],
  configFiles: ['package.json', 'tsconfig.json'],
  sampleTree: `my-node-api/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts
│   ├── routes/
│   └── middleware/
└── tests/`,
  generateContent: () => '// Node.js content',
  dependencies: { runtime: ['express'], devDependencies: ['@types/express'] },
  metadata: { author: 'File Tree Generator', tags: ['api'], difficulty: 'intermediate' }
} as LanguagePlugin;
