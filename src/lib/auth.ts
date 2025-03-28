import { db } from '@/db';
import { account, session, user, verification } from '@/db/schema';
import { stripe } from '@better-auth/stripe';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import Stripe from 'stripe';
import { resetPasswordEmail } from '@/components/email-templates/reset-password';
import { verifyEmail } from '@/components/email-templates/verify-email';
import { welcomeEmail } from '@/components/email-templates/welcome';
import { sendEmail } from '@/lib/resend';
import { PROFESSION_PRICE_ID, STARTER_PRICE_ID } from '@/lib/stripe';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: { user, session, account, verification },
  }),
  user: {
    deleteUser: {
      enabled: true,
    },
  },
  emailVerification: {
    callbackUrl: '/dashboard',
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: 'Verify your email',
        template: verifyEmail({
          username: user.email,
          url: url,
        }),
      });
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    async sendResetPassword({ user, url }) {
      await sendEmail({
        to: user.email,
        subject: 'Reset your password',
        template: resetPasswordEmail({
          username: user.email,
          resetLink: url,
        }),
      });
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await sendEmail({
            to: user.email,
            subject: 'Welcome to MyApp',
            template: welcomeEmail({
              username: user.name || user.email,
            }),
          });
        },
      },
    },
  },
  plugins: [
    nextCookies(),
    stripe({
      stripeClient: new Stripe(process.env.STRIPE_KEY || 'sk_test_'),
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        plans: [
          {
            name: 'Starter',
            priceId: STARTER_PRICE_ID.default,
            annualDiscountPriceId: STARTER_PRICE_ID.annual,
          },
          {
            name: 'Professional',
            priceId: PROFESSION_PRICE_ID.default,
            annualDiscountPriceId: PROFESSION_PRICE_ID.annual,
          },
        ],
      },
    }),
  ],
});
