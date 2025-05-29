// src/lib/plugins/rust.ts
import { LanguagePlugin } from '@/types/plugin';

export default {
  id: 'rust',
  name: 'Rust',
  description: 'Rust web service with Actix',
  version: '1.0.0',
  category: 'backend',
  extensions: ['.rs'],
  configFiles: ['Cargo.toml'],
  sampleTree: `my-rust-app/
├── Cargo.toml
├── src/
│   ├── main.rs
│   └── lib.rs
└── tests/`,
  generateContent: () => '// Rust content',
  dependencies: { runtime: [], devDependencies: [] },
  metadata: { author: 'File Tree Generator', tags: ['performance'], difficulty: 'advanced' }
} as LanguagePlugin;
