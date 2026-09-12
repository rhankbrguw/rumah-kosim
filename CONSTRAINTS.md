# Constraints

Last reviewed: 2026-09-12 by @team

## Floor (always enforced, no setup required)

- No new suppression comments: `@ts-ignore`, `eslint-disable`
- No unimplemented stubs: `throw new Error("Not implemented")`, empty `catch {}`
- No skipped or deleted tests without a reason in the commit message
- No secrets in source or tracked `.env`
- No inline color values, string literals, or magic numbers outside `src/lib/constants/`
- This file does not get weakened to make a change pass

## Enforced with numbers

| Dimension       | Rule                             | Checked by                           | Runs at      |
| --------------- | -------------------------------- | ------------------------------------ | ------------ |
| Types           | Zero type errors                 | `npm run check`                      | task end, CI |
| Lint & Format   | Zero lint & style warnings       | `npm run lint`                       | task end, CI |
| File Length     | Max 150 lines per file           | `find src/ -type f -exec wc -l {} +` | every edit   |
| Function Length | Max 30 lines per function        | AST / code review                    | every edit   |
| Build           | Production bundle compiles clean | `npm run build`                      | task end, CI |
| Security        | Secrets audit & .env gitignored  | `.github/workflows/ci.yml`           | CI           |

Every row names the command that produces the verdict.

## Measured, not yet enforced

| Metric                       | Today     | Direction           |
| ---------------------------- | --------- | ------------------- |
| Max file length in `src/`    | 146 lines | must not exceed 150 |
| ESLint / Svelte-check errors | 0         | must remain 0       |
| Hardcoded constants count    | 0         | must remain 0       |

## Exceptions

None.
