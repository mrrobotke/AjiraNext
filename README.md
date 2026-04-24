This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Quick Start

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env.local
   ```

3. Fill in the required environment variables (see **Environment Variables** below).

4. Run the development server:

   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Environment Variables

| Variable                        | Required | Description                                               |
| ------------------------------- | -------- | --------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`          | Yes      | Public base URL of the app (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_API_BASE_URL`      | Yes      | Public API base URL (e.g. `http://localhost:8085/v1`)     |
| `NEXT_PUBLIC_SUPABASE_URL`      | Yes      | Supabase project URL                                      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes      | Supabase anonymous key                                    |
| `MOCK_AUTH_ENABLED`             | No       | Set to `true` in development to bypass real auth          |
| `MOCK_AUTH_ROLE`                | No       | Role to use when `MOCK_AUTH_ENABLED=true`                 |

## Scripts

| Command                | Description                           |
| ---------------------- | ------------------------------------- |
| `pnpm dev`             | Start development server              |
| `pnpm build`           | Production build                      |
| `pnpm lint`            | Run ESLint                            |
| `pnpm typecheck`       | Run TypeScript check                  |
| `pnpm test:run`        | Run Storybook-integrated Vitest tests |
| `pnpm test:unit`       | Run unit tests (Vitest)               |
| `pnpm test:e2e`        | Run Playwright smoke tests            |
| `pnpm storybook`       | Start Storybook dev server            |
| `pnpm build-storybook` | Build Storybook                       |

## Marketing Architecture

See [docs/marketing-architecture.md](./docs/marketing-architecture.md) for details on the marketing layer (route groups, SEO, i18n, theme system, analytics, and quality gates).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
