# Tracker Checklist

> Master list of all tracking systems in this project.
> When a new tracker file is added, register it here.
> Say "show checklist" to see all systems at a glance.

---

## Last Reviewed
**2025-12-09**

---

## Tracker Systems

| # | File | Purpose | Last Updated | Status |
|---|------|---------|--------------|--------|
| 1 | **SESSION.md** | Recent work context, open items, decisions | 2025-12-09 | Active |
| 2 | **CONTEXT.md** | Project overview, tech stack, environment setup | 2025-12-09 | Active |
| 3 | **ARCHITECTURE.md** | Code structure, quality scores, known issues | 2025-12-09 | Active |
| 4 | **TESTING.md** | Manual test checklist, workflow & integration tests | 2025-12-09 | Active |
| 5 | **MILESTONES.md** | Feature backlog, prioritized roadmap | 2025-12-09 | Active |
| 6 | **CONNECTIONS.md** | External services status, credentials location | 2025-12-09 | Active |
| 7 | **CHECKLIST.md** | This file - master list of all trackers | 2025-12-09 | Active |

---

## Status Icons
- Active - File exists and is maintained
- Stale - Needs update (>2 weeks old)
- Missing - Should exist but doesn't
- New - Recently added

---

## Update Frequency

| File | How Often to Update |
|------|---------------------|
| SESSION.md | Every session (before closing Claude) |
| CONTEXT.md | When tech stack or setup changes |
| ARCHITECTURE.md | Every 2 weeks or after major changes |
| TESTING.md | After adding new features |
| MILESTONES.md | When adding/completing features |
| CONNECTIONS.md | When integrations change or break |
| CHECKLIST.md | When adding new tracker files |

---

## How to Add a New Tracker

When adding a new tracking system:

1. Create the file in `/tracker` folder
2. Add a row to the table above
3. Update `CLAUDE.md` to reference the new file

Example:
```markdown
| 8 | **NEWFILE.md** | Description of purpose | [DATE] | New |
```

---

## How to Use

| You Say | I Do |
|---------|------|
| "Show checklist" | Display all trackers with status |
| "Which trackers are stale?" | Check dates, flag old ones |
| "Add X tracker" | Create file, register here, update CLAUDE.md |
| "Remove X tracker" | Delete file, remove from this list |
