# Bingo Mixer Agent Guidelines

## Development Workflow

- Use Node.js 22 or later. Follow [README.md](README.md) for initial setup and deployment context; use the [setup skill](.github/skills/setup/SKILL.md) for the complete local setup workflow.
- Run `npm install` when dependencies are not installed.
- Before completing code changes, run `npm run lint`, `npm run test`, and `npm run build`.
- For UI work, run `npm run dev` and verify the affected flow in a browser at desktop and mobile sizes.

## Architecture

- Keep [src/App.tsx](src/App.tsx) focused on composing screens and connecting the game hook to presentational components.
- Keep game lifecycle, React state, and versioned `localStorage` persistence in `useBingoGame` in [src/hooks/useBingoGame.ts](src/hooks/useBingoGame.ts).
- Keep board generation, square toggling, and win detection as pure functions in [src/utils/bingoLogic.ts](src/utils/bingoLogic.ts).
- Keep bingo prompt content in [src/data/questions.ts](src/data/questions.ts) and shared domain contracts in [src/types/index.ts](src/types/index.ts).
- Prefer presentational components under `src/components/`; move reusable game rules into `bingoLogic.ts` rather than embedding them in JSX.

## Game Invariants

- A board has 25 squares. Index 12 is the always-marked free space and cannot be toggled.
- Treat board updates as immutable. Preserve object identity for untouched squares where practical.
- `checkBingo` returns the first completed row, column, or diagonal according to the existing line order.
- When persisted state changes shape, update `STORAGE_VERSION`, `StoredGameData`, and `validateStoredData` together. Invalid or incompatible saved state must fail closed and be cleared.

## Tests

- Add or update focused Vitest coverage in [src/utils/bingoLogic.test.ts](src/utils/bingoLogic.test.ts) for changes to game rules, including immutability and free-space behavior.
- Add focused hook or component tests when behavior belongs to persistence, lifecycle, or user interaction rather than pure game logic.
- Keep tests deterministic; restore mocked globals such as `Math.random` after each test.

## Styling

- This project uses Tailwind CSS v4 through Vite and a CSS-first theme in [src/index.css](src/index.css). Do not introduce a Tailwind v3 configuration pattern.
- Read the [Tailwind v4 instructions](.github/instructions/tailwind-4.instructions.md) before changing Tailwind CSS. Reuse existing `@theme` tokens before adding new colors.
- Use the [frontend design skill](.github/skills/frontend-design/SKILL.md) for substantial interface work and verify responsive behavior in the running app.

## Project Workflows

- The lab path and customization exercises are documented in [workshop/GUIDE.md](workshop/GUIDE.md). Link to those guides instead of duplicating them.
- Use the agents in [.github/agents/](.github/agents/) for their intended specialized flows: TDD orchestration, question curation, visual design, and UI review.
- Treat files under `.github/agents/`, `.github/skills/`, `.github/hooks/`, and `workshop/` as teaching assets. Change them only when the task explicitly targets the lab or a customization.
- Follow [CONTRIBUTING.md](CONTRIBUTING.md) for contribution and CLA requirements.