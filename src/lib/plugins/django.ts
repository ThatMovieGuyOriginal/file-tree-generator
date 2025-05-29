// src/lib/plugins/django.ts
export default {
  id: 'django',
  name: 'Django',
  description: 'Python web framework with batteries included',
  version: '1.0.0',
  category: 'fullstack',
  extensions: ['.py', '.html'],
  configFiles: ['requirements.txt', 'settings.py', 'urls.py'],
  
  sampleTree: `my-django-app/
├── manage.py
├── requirements.txt
├── myproject/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── myapp/
│   ├── __init__.py
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   └── templates/
│       └── myapp/
│           └── index.html
└── static/
    ├── css/
    ├── js/
    └── images/`,
    
  generateContent: (filename: string, settings: ProjectSettings) => {
    if (filename === 'settings.py') {
      return generateDjangoSettings(settings);
    }
    if (filename === 'models.py') {
      return generateDjangoModels(settings);
    }
    // ... more Django-specific generation
  },
  
  hooks: {
    beforeGeneration: (tree, settings) => {
      // Add Django-specific folders
      return enhanceTreeWithDjangoStructure(tree);
    },
    afterGeneration: (files, settings) => {
      // Add Django migration files
      return addDjangoMigrations(files);
    }
  }
} as LanguagePlugin;
