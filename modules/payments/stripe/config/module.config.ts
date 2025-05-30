// modules/payments/stripe/config/module.config.ts
export const stripeModuleConfig = {
  name: 'Stripe Payments',
  version: '1.0.0',
  description: 'Stripe payment processing module',
  dependencies: {
    runtime: ['stripe', '@stripe/stripe-js'],
    devDependencies: []
  },
  envVariables: {
    required: [
      'STRIPE_SECRET_KEY',
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'
    ],
    optional: [
      'STRIPE_WEBHOOK_SECRET'
    ]
  },
  apiRoutes: [
    '/api/create-checkout-session',
    '/api/webhooks/stripe'
  ]
};
