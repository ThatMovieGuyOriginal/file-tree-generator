// src/lib/sampleData.ts

export const sampleFileTree = `my-nextjs-app/
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── .env.local
├── .gitignore
├── README.md
├── public/
│   ├── favicon.ico
│   └── images/
│       └── logo.png
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── api/
│   │       ├── hello/
│   │       │   └── route.ts
│   │       └── auth/
│   │           └── route.ts
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   └── modal.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   └── features/
│   │       ├── auth/
│   │       │   ├── LoginForm.tsx
│   │       │   └── SignupForm.tsx
│   │       └── dashboard/
│   │           ├── Dashboard.tsx
│   │           └── Stats.tsx
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── auth.ts
│   │   ├── api.ts
│   │   └── validations.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useLocalStorage.ts
│   │   └── useApi.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   └── api.ts
│   └── styles/
│       └── components.css
└── tests/
    ├── components/
    │   ├── Header.test.tsx
    │   └── Button.test.tsx
    ├── lib/
    │   └── utils.test.ts
    └── setup.ts`;

export const sampleReactTree = `my-react-app/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── .env
├── .gitignore
├── README.md
├── index.html
├── public/
│   ├── favicon.ico
│   └── assets/
│       └── logo.svg
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   └── Input.tsx
│   │   ├── Layout.tsx
│   │   └── Header.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   └── Contact.tsx
│   ├── hooks/
│   │   └── useCounter.ts
│   ├── lib/
│   │   └── utils.ts
│   └── types/
│       └── index.ts
└── tests/
    ├── App.test.tsx
    └── setup.ts`;

export const sampleNodeTree = `my-node-api/
├── package.json
├── tsconfig.json
├── .env
├── .gitignore
├── README.md
├── src/
│   ├── index.ts
│   ├── app.ts
│   ├── config/
│   │   ├── database.ts
│   │   └── env.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   └── userController.ts
│   ├── models/
│   │   ├── User.ts
│   │   └── index.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   └── index.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── cors.ts
│   │   └── validation.ts
│   ├── services/
│   │   ├── authService.ts
│   │   └── userService.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   └── helpers.ts
│   └── types/
│       └── index.ts
├── tests/
│   ├── auth.test.ts
│   ├── users.test.ts
│   └── setup.ts
└── docs/
    ├── API.md
    └── SETUP.md`;

export const getSampleByType = (type: string): string => {
  switch (type) {
    case 'nextjs':
      return sampleFileTree;
    case 'react':
      return sampleReactTree;
    case 'node':
      return sampleNodeTree;
    default:
      return sampleFileTree;
  }
};

// Add a simple fallback function for backward compatibility
export const getDefaultSample = (): string => sampleFileTree;
