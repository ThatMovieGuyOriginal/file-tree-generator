// src/lib/contentGenerator.ts
import { ProjectSettings } from '@/types/project';
import { pluginManager } from './pluginManager';

export const generateFileContent = async (filename: string, settings: ProjectSettings): Promise<string> => {
  // Ensure plugin manager is initialized
  await pluginManager.initialize();
  
  // Try to generate content using plugins first
  const pluginContent = pluginManager.generateContent(filename, settings);
  if (pluginContent && pluginContent !== generateGenericContent(filename)) {
    return pluginContent;
  }
  
  // Fallback to original content generation for common files
  return generateCommonFileContent(filename, settings);
};

// Common files that aren't language-specific
const generateCommonFileContent = (filename: string, settings: ProjectSettings): string => {
  switch (filename) {
    case '.gitignore':
      return generateGitignoreContent();
    case '.env':
    case '.env.local':
      return generateEnvContent(settings);
    case 'README.md':
      return generateMarkdownContent(filename, settings);
    case 'LICENSE':
      return generateLicenseContent(settings);
    case 'CHANGELOG.md':
      return generateChangelogContent(settings);
    case 'CONTRIBUTING.md':
      return generateContributingContent(settings);
    case '.editorconfig':
      return generateEditorConfigContent();
    case '.prettierrc':
      return generatePrettierConfig();
    default:
      return generateGenericContent(filename);
  }
};

const generateGitignoreContent = (): string => {
  return `# Dependencies
node_modules/
/vendor/
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
pip-log.txt
pip-delete-this-directory.txt
.tox
.coverage
.coverage.*
.cache
nosetests.xml
coverage.xml
*.cover
*.log
.git
.mypy_cache
.pytest_cache
.hypothesis

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Build outputs
/dist/
/build/
/out/
*.o
*.so
*.exe

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# Temporary folders
tmp/
temp/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity`;
};

const generateEnvContent = (settings: ProjectSettings): string => {
  return `# Environment variables
APP_NAME="${settings.name || 'My App'}"
APP_ENV="development"
APP_DEBUG=true
APP_URL="http://localhost:3000"

# Database (uncomment and configure as needed)
# DATABASE_URL="postgresql://user:password@localhost:5432/database"
# REDIS_URL="redis://localhost:6379"

# Authentication (generate secure keys for production)
# JWT_SECRET="your-jwt-secret"
# SESSION_SECRET="your-session-secret"

# External Services (add your API keys)
# STRIPE_SECRET_KEY=""
# SENDGRID_API_KEY=""
# AWS_ACCESS_KEY_ID=""
# AWS_SECRET_ACCESS_KEY=""

# Feature Flags
# FEATURE_NEW_UI=true
# FEATURE_ANALYTICS=false`;
};

const generateMarkdownContent = (filename: string, settings: ProjectSettings): string => {
  if (filename === 'README.md') {
    return `# ${settings.name || 'My Project'}

${settings.description || 'A project generated with File Tree Generator'}

## Quick Start

1. **Install dependencies**
2. **Configure environment variables**
3. **Run the development server**
4. **Visit your application**

## Features

- ✅ Modern development setup
- ✅ Best practices configuration
- ✅ Ready for deployment
- ✅ Comprehensive documentation

## Documentation

For detailed documentation, see the \`docs/\` directory.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the ${settings.license || 'MIT'} License - see the [LICENSE](LICENSE) file for details.`;
  }
  return `# ${filename.split('.')[0]}`;
};

const generateLicenseContent = (settings: ProjectSettings): string => {
  const year = new Date().getFullYear();
  const projectName = settings.name || 'My Project';
  
  switch (settings.license) {
    case 'MIT':
      return `MIT License

Copyright (c) ${year} ${projectName}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

    case 'Apache-2.0':
      return `Apache License
Version 2.0, January 2004
http://www.apache.org/licenses/

Copyright ${year} ${projectName}

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.`;

    default:
      return `Copyright (c) ${year} ${projectName}

All rights reserved.`;
  }
};

const generateChangelogContent = (settings: ProjectSettings): string => {
  return `# Changelog

All notable changes to ${settings.name || 'this project'} will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup
- Basic project structure
- Development environment configuration

### Changed
- N/A

### Deprecated
- N/A

### Removed
- N/A

### Fixed
- N/A

### Security
- N/A

## [1.0.0] - ${new Date().toISOString().split('T')[0]}

### Added
- Project initialized with File Tree Generator
- ${settings.description || 'Basic functionality implemented'}
- Documentation and setup instructions`;
};

const generateContributingContent = (settings: ProjectSettings): string => {
  return `# Contributing to ${settings.name || 'This Project'}

We love your input! We want to make contributing to ${settings.name || 'this project'} as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## Pull Requests

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. Fork the repo and create your branch from \`main\`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Any contributions you make will be under the ${settings.license || 'MIT'} Software License

In short, when you submit code changes, your submissions are understood to be under the same [${settings.license || 'MIT'} License](LICENSE) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using GitHub's [issue tracker]

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](../../issues/new); it's that easy!

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Use a Consistent Coding Style

* Follow the existing code style
* Run the linter before submitting
* Write meaningful commit messages

## License

By contributing, you agree that your contributions will be licensed under the ${settings.license || 'MIT'} License.

## References

This document was adapted from the open-source contribution guidelines for [Facebook's Draft](https://github.com/facebook/draft-js/blob/a9316a723f9e918afde44dea68b5f9f39b7d9b00/CONTRIBUTING.md).`;
};

const generateEditorConfigContent = (): string => {
  return `# EditorConfig is awesome: https://EditorConfig.org

# top-most EditorConfig file
root = true

# Unix-style newlines with a newline ending every file
[*]
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
charset = utf-8

# 2 space indentation
[*.{js,jsx,ts,tsx,json,css,scss,md,yml,yaml}]
indent_style = space
indent_size = 2

# 4 space indentation
[*.{py,go,rs,java,php}]
indent_style = space
indent_size = 4

# Tab indentation (no size specified)
[Makefile]
indent_style = tab

# Matches the exact files either package.json or .travis.yml
[{package.json,.travis.yml}]
indent_style = space
indent_size = 2`;
};

const generatePrettierConfig = (): string => {
  return JSON.stringify({
    semi: true,
    trailingComma: 'es5',
    singleQuote: true,
    printWidth: 80,
    tabWidth: 2,
    useTabs: false,
    bracketSpacing: true,
    bracketSameLine: false,
    arrowParens: 'avoid',
    endOfLine: 'lf'
  }, null, 2);
};

const generateGenericContent = (filename: string): string => {
  if (filename.startsWith('.')) {
    return `# ${filename} configuration file\n# Generated by File Tree Generator\n`;
  }
  
  const ext = filename.split('.').pop()?.toLowerCase();
  
  switch (ext) {
    case 'md':
      return `# ${filename.split('.')[0]}\n\nDocumentation for ${filename.split('.')[0]}.`;
    case 'txt':
      return `${filename.split('.')[0]} notes\n\nGenerated by File Tree Generator`;
    case 'yml':
    case 'yaml':
      return `# ${filename} configuration\n# Generated by File Tree Generator\n`;
    case 'json':
      return '{}';
    case 'xml':
      return '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generated by File Tree Generator -->';
    default:
      return `// ${filename}\n// Generated by File Tree Generator\n`;
  }
};
