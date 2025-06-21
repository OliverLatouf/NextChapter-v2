import { loadStripe } from '@stripe/stripe-js'

// Client-side Stripe (for frontend)
export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// Server-side Stripe (for API routes only - don't import in client components)
export function getServerStripe() {
  const Stripe = require('stripe')
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20',
  })
}
