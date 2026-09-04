---
name: "Bingo Mixer Design Guide"
description: "Use when designing or modifying the Bingo Mixer React interface, components, themes, responsive layouts, or visual states. Enforces the Swiss-editorial Minimalist Mono design system and accessible theme behavior."
applyTo: ["src/**/*.tsx", "src/**/*.css"]
---
# Bingo Mixer Design Guide

## Visual Direction

- Use a Swiss-editorial Minimalist Mono aesthetic: strict grids, strong typographic hierarchy, deliberate whitespace, thin rules, and high contrast.
- Keep the interface monochromatic. Communicate state through inversion, line weight, pattern, spacing, and typography instead of hue.
- Use a cool paper-like surface and near-black ink in light mode; reverse those roles in dark mode.
- Avoid gradients, decorative blobs, glass effects, soft shadows, oversized rounded cards, emoji decoration, and colorful status accents.
- Keep corners square or minimally rounded. Prefer unframed sections separated by rules over nested cards.

## Typography And Layout

- Use local grotesque and monospace font stacks only. Do not add web-font downloads or font packages.
- Use uppercase labels and monospace metadata sparingly for editorial structure; keep prompts readable in sentence case.
- Do not scale font sizes with viewport width. Use fixed responsive steps and ensure long board prompts wrap without overlap.
- Keep the game in a centered single-column composition on mobile and desktop.
- Render the board as a strict edge-to-edge 5x5 matrix with shared rules and no gutters. Preserve its square aspect ratio and stable cell geometry.

## Theme Behavior

- Provide an accessible segmented control with three modes: `Auto`, `Light`, and `Dark`.
- Default to `Auto`, resolving through `prefers-color-scheme`.
- Apply explicit light or dark overrides through a root `data-theme` attribute. Returning to `Auto` must remove the override.
- Keep the theme choice in React state for the current app session only. Preserve it across app screen transitions, but reset to `Auto` after a full page reload.
- Never write the theme preference to `localStorage` or alter the persisted game-state schema.
- Define semantic color variables in `src/index.css` and expose them through Tailwind CSS v4 `@theme inline`. Do not add a Tailwind v3 configuration file.

## Components And States

- Keep primary actions high contrast and full width where the mobile flow benefits from it.
- Use familiar symbols or concise labels for compact controls. Every unfamiliar icon-only control needs an accessible name and tooltip.
- Distinguish board states without color:
  - Unmarked: paper surface with ink text.
  - Marked: ink-filled cell with inverse text and a compact check indicator.
  - Free space: disabled, always marked, and typographically distinct.
  - Winning: distinguish from ordinary marked cells with a monochrome hatch, double rule, or similarly clear pattern.
- Present a win as a restrained editorial announcement rather than a colorful celebration card. Avoid emoji and bounce effects.
- Preserve all game behavior and component boundaries described in `AGENTS.md`; visual work must not change board rules, state transitions, or persistence.

## Interaction And Accessibility

- Provide visible `:focus-visible` treatment for every interactive element in both themes.
- Keep touch targets comfortably usable and provide distinct hover, active, selected, disabled, and focus states.
- Preserve semantic buttons, `aria-pressed` on bingo squares, and the disabled free-space behavior.
- Implement the win overlay with dialog semantics and a clear dismissal action.
- Respect `prefers-reduced-motion`; use restrained entrance motion and avoid layout-shifting animation.
- Verify contrast and state recognition without relying on color alone.

## Verification

- Check start, playing, marked, free-space, winning-line, and modal states at mobile and desktop sizes.
- Verify `Auto` under light and dark system preferences, both manual overrides, and returning to `Auto`.
- Confirm theme changes survive screen transitions but reset after reload, while game persistence remains unchanged.
- Check keyboard focus, long prompt wrapping, and board geometry before completing UI work.
- Run `npm run lint`, `npm run test`, and `npm run build`; for substantial UI changes, run the app and inspect the affected flow in a browser.
