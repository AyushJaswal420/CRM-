# Wed Us CRM - Product Requirements Document

## Original Problem Statement
Build a CRM web app called "Wed Us CRM" for a wedding design company with:
- FastAPI backend (Python) + React frontend + MongoDB
- JWT authentication with Admin/Team Member roles
- Default admin: admin@wedus.com / admin123
- Sidebar navigation with live count badges
- Dashboard, lead management, pipeline, calendar, reminders
- Design: #FFF5F5 background, #E8536A coral pink accent, compact data-dense layout

## What's Been Implemented

### Phase 1 - Core Setup (2026-03-30)
- FastAPI + React + MongoDB, JWT Auth, Sidebar, Dashboard, Team page, Mobile responsive

### Phase 2 - Leads Management (2026-03-30)
- All Leads Table, CSV/Excel Import, Add Lead Modal, Call Log Panel
- Lead Overview page, Duplicate Detection

### Phase 3 - Pipeline & Views (2026-03-30)
- Pipeline Kanban (drag-and-drop), Today/Tomorrow/This Week views
- 9 Category pages, LeadCard component, Sidebar dates

### Phase 4 - Import Duplicate Review (2026-03-30)
- Analyze/Batch/Resolve import endpoints, Duplicate Review screen

### Phase 5 - Settings & Deployment (2026-04-03)
- Settings page: Profile (name/email/color), Change Password, Duplicate Detection toggle
- Deployment files: vercel.json, railway.json, Procfile, main.py, .env.examples, README.md

### Phase 6 - Templates, Calendar, Reminders (2026-04-03)
- WhatsApp Templates, Meetings Calendar, Reminders dashboard

### Phase 7 - Person Name Field (2026-04-06)
- **personName** field added to lead schema (LeadCreate, LeadUpdate models)
- Shows as subtitle below companyName in All Leads table + Lead Overview header
- Editable in Lead Overview edit form and Add Lead modal
- Searchable from the search bar (backend search queries updated)
- Column mapping added for CSV import: 'person', 'contact person', 'name', 'poc', etc.

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
