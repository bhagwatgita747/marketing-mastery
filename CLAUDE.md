# Claude Code Instructions

> Instructions for Claude Code when working on this project.

## User Permissions (IMPORTANT - Remember Always)

The user has granted **full authority** to execute non-destructive operations without asking for permission. This includes:
- All file operations within this project folder
- All Supabase database operations (queries, inserts, updates, table creation)
- All API calls to external services (xAI, Supabase, etc.)
- Running npm commands, dev servers, builds
- Any common development operations

**DO NOT ask for permission** for these operations. Just execute them directly.
Only ask permission for truly destructive operations (like deleting the entire project, force-pushing to main, etc.).

## Project Documentation

All project documentation is in the `/tracker` folder:

| File | Purpose |
|------|---------|
| **tracker/CHECKLIST.md** | Master list of all tracker systems (start here to see everything) |
| **tracker/SESSION.md** | Recent work context, open items, decisions (read this first!) |
| **tracker/CONTEXT.md** | Project overview, features, tech stack, environment setup |
| **tracker/ARCHITECTURE.md** | Code structure, quality scores, data flow, known issues |
| **tracker/TESTING.md** | Manual test checklist, workflow tests, integration status |
| **tracker/MILESTONES.md** | Feature backlog, prioritized roadmap, completed milestones |
| **tracker/CONNECTIONS.md** | External services status, credentials location, health checks |

## Tracker System

All trackers are registered in `tracker/CHECKLIST.md`.

**When adding a new tracker file:**
1. Create file in `/tracker` folder
2. Register in CHECKLIST.md with purpose and date
3. Add reference in this file (CLAUDE.md)

## Starting a New Session

1. Read `tracker/SESSION.md` to restore recent context
2. Check open items and continue where we left off

## Before Making Changes

1. Read `tracker/CONTEXT.md` for project understanding
2. Check `tracker/ARCHITECTURE.md` for code structure and known issues
3. Follow existing patterns and naming conventions

## Architecture Audit

Run an architecture audit when:
- User asks for "architecture audit" or "architecture review"
- Every 2 weeks (check last audit date in tracker/ARCHITECTURE.md)
- After major features are added

Audit checklist:
1. Check for dead code (unused files, exports)
2. Check for duplicate code
3. Verify folder structure
4. Review function sizes
5. Update scores in tracker/ARCHITECTURE.md
6. Update the audit date

## Testing

Test checklist is in `tracker/TESTING.md`.

**After adding a new feature:**
1. Add test cases to TESTING.md (happy path + errors + edge cases)
2. Mark new tests as "Untested" until user verifies

**Status icons:**
- Working
- Broken
- Untested

## BrowserBase Testing (IMPORTANT - Use After Every Change)

**After making any change to the website, run BrowserBase tests:**
```bash
node test-browser.js
```

This will:
- Load the production site (https://marketing-mastery.vercel.app/)
- Test login functionality
- Verify modules display correctly
- Take a screenshot
- Provide a session replay link

**BrowserBase Credentials:**
- Project ID: `ec860b83-22ca-4178-ad1d-c92db14f01b2`
- API Key: `bb_live_Zhua5CEpTPxKL4m3yJatp1q30YE`

## Milestones

Feature backlog is in `tracker/MILESTONES.md`.

**When user adds a feature idea:**
1. Add to MILESTONES.md
2. Auto-organize by: dependencies → architecture → complexity
3. Unless user specifies explicit order

**Priority rules (highest to lowest):**
1. Blockers (dependencies for other features)
2. Architecture fixes (tech debt)
3. Security/stability improvements
4. Small features
5. Large features
6. Nice-to-haves

## Code Style

- Use functional React components with hooks
- Follow existing naming: `useX` for hooks, PascalCase for components
- Keep functions small (< 50 lines preferred)
- Handle errors at boundaries (API calls, user input)
- Be explicit with data shapes

## Key Commands

```bash
npm run dev      # Frontend development
npm run build    # Production build
```

## Deployment

- Push to GitHub main branch
- Auto-deploys via CI/CD
