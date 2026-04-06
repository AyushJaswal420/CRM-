# Wed Us CRM - Product Requirements Document

## Original Problem Statement
Build a CRM web app called "Wed Us CRM" for a wedding design company with:
- FastAPI backend (Python) + React frontend + MongoDB
- JWT authentication with Admin/Team Member roles
- Design: #FFF5F5 background, #E8536A coral pink accent, compact data-dense layout

## What's Been Implemented

### Phase 1-3 (2026-03-30)
- Core setup, Auth, Sidebar, Dashboard, Team, All Leads Table, Import, Lead Overview
- Pipeline Kanban, Today/Tomorrow/This Week views, 9 Category pages, LeadCard

### Phase 4 (2026-03-30)
- Import Duplicate Review (Analyze/Batch/Resolve, side-by-side, Skip/Overwrite/Merge)

### Phase 5 (2026-04-03)
- Settings page (Profile, Password, Duplicate Detection toggle)
- Deployment configs (vercel.json, railway.json, Procfile, main.py, README.md)

### Phase 6 (2026-04-03)
- WhatsApp Templates, Meetings Calendar, Reminders dashboard

### Phase 7 (2026-04-06)
- personName field (subtitle in table, searchable, editable, importable)

### Phase 8 (2026-04-06)
- **Removed map/location section** from Lead Overview (no iframe, no "Open in Maps")
- **Chatting Via WhatsApp button** in Contact Details:
  - 3 active numbers: ...5235, ...5533, ...0951
  - Green WhatsApp-style button shows assigned number (last 4 digits)
  - Click to open dropdown, select/change number, or clear
  - Stored as `chattingVia` field per lead
  - `PUT /api/leads/{id}/chatting-via` quick-update endpoint
- **Chatting Via filter** in All Leads table (filter by assigned number)
- City/State/Address fields consolidated into Contact Details section

## Prioritized Backlog

### P1 - High Priority
- [ ] Round-robin lead distribution on import
- [ ] Quick Stats widget on Settings page
- [ ] Dashboard charts/analytics

### P2 - Medium Priority
- [ ] Instagram/WhatsApp lead source filter pages
- [ ] Bulk category/priority updates
- [ ] Lead notes and activity timeline

### P3 - Nice to Have
- [ ] Duplicate merge functionality
- [ ] Notification bell with live count
- [ ] Backend refactoring (split server.py into route modules)
