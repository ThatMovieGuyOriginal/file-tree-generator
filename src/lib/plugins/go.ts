// src/lib/plugins/go.ts
import { LanguagePlugin } from '@/types/plugin';

export default {
  id: 'go',
  name: 'Go',
  description: 'Go web service with Gin framework',
  version: '1.0.0',
  category: 'backend',
  extensions: ['.go'],
  configFiles: ['go.mod', 'go.sum'],
  sampleTree: `my-go-app/
├── go.mod
├── main.go
├── handlers/
└── models/`,
  generateContent: () => '// Go content',
  dependencies: { runtime: [], devDependencies: [] },
  metadata: { author: 'File Tree Generator', tags: ['api'], difficulty: 'intermediate' }
} as LanguagePlugin;
