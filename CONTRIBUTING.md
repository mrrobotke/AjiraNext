# Contributing to AjiraNext

## Getting Started

```bash
pnpm install
pnpm dev
```

## Available Scripts

| Script                 | Description                          |
| ---------------------- | ------------------------------------ |
| `pnpm dev`             | Start Next.js development server     |
| `pnpm build`           | Production build                     |
| `pnpm lint`            | Run ESLint                           |
| `pnpm lint:fix`        | Run ESLint with auto-fix             |
| `pnpm format`          | Format all files with Prettier       |
| `pnpm format:check`    | Check formatting without writing     |
| `pnpm typecheck`       | Type-check with TypeScript (no emit) |
| `pnpm test`            | Run Vitest in watch mode             |
| `pnpm test:run`        | Run Vitest once (CI)                 |
| `pnpm storybook`       | Start Storybook dev server           |
| `pnpm build-storybook` | Build Storybook for static export    |

## Design System Conventions

- **Atomic Design**: Atoms → Molecules → Organisms → Templates
- **No upward imports**: Atoms cannot import molecules/organisms/templates
- **No business data in templates**: Templates accept data via props; pages own the data
- **No arbitrary Tailwind values**: Use `@theme inline` tokens in `globals.css`
- **Z-index scale**: `z-sticky` (100) → `z-dropdown` (200) → `z-modal` (300) → `z-toast` (400) → `z-tooltip` (500)
- **Focus styles**: All interactive elements must have `focus-visible:` ring styles
- **Accessibility**: All interactive elements must have correct ARIA roles and keyboard support

## Pre-commit Hooks

This project uses `husky` + `lint-staged` to run linting and formatting on staged files before each commit.

## Commit Message Convention

Use conventional commits:

- `feat:` — New feature
- `fix:` — Bug fix
- `refactor:` — Code change that neither fixes a bug nor adds a feature
- `docs:` — Documentation changes
- `test:` — Adding or updating tests
- `chore:` — Maintenance tasks

## Pull Request Checklist

- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm format:check` passes
- [ ] `pnpm test:run` passes
- [ ] `pnpm build` passes
- [ ] Storybook stories added/updated for design-system changes
