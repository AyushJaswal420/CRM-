# Wed Us CRM - Product Requirements Document

## Original Problem Statement
Build a CRM web app called "Wed Us CRM" for a wedding design company with:
- FastAPI backend (Python) + React frontend + MongoDB
- JWT authentication with Admin/Team Member roles
- Default admin: admin@wedus.com / admin123
- Sidebar navigation with live count badges
- Dashboard with stat cards
- All leads table with category/priority filters
- Team management
- Design: #FFF5F5 background, #E8536A coral pink accent, Poppins/Inter fonts
- Compact data-dense layout for maximum visibility
- Mobile responsive with bottom navigation

## User Personas
1. **Admin** - Full access to all leads, team management, settings, app config
2. **Team Member** - Access only to assigned leads, can change own profile/password

## What's Been Implemented

### Phase 1 - Core Setup (2026-03-30)
- FastAPI backend with all lead/team/auth endpoints
- JWT authentication with cookie-based tokens
- MongoDB models with proper indexes
- Admin seeding + sample team members
- React frontend with all routes, login, dashboard, sidebar
- Mobile responsive with bottom nav

### Phase 2 - Leads Management (2026-03-30)
- All Leads Table (Excel-style, sortable, filterable, paginated)
- CSV/Excel Import with column auto-mapping, fuzzy matching
- Add Lead Modal, Call Log Panel
- Lead Overview page with maps, editing, call history
- Duplicate Detection (phone, instagram, companyName+city)

### Phase 3 - Pipeline & Views (2026-03-30)
- Pipeline Kanban Board (drag-and-drop, 2 tracks, sorting)
- Today/Tomorrow/This Week date-filtered views
- 9 Category pages with shared LeadCard component
- Sidebar dates beside Today/Tomorrow

### Phase 4 - Import Duplicate Review (2026-03-30)
- Complete rewrite of import duplicate handling
- Duplicate Review screen with side-by-side comparison
- Actions: Skip, Overwrite, Import Anyway, Merge
- Bulk action checkbox, background non-duplicate import
- Enhanced import summary with 6 stat categories

### Phase 5 - Settings & Deployment Prep (2026-04-03)
- **Settings Page** accessible by all users:
  - Profile: Change name, email, display color
  - Change Password: Current + new + confirm validation
  - App Settings (admin-only): Duplicate detection toggle
  - Account info display
- **Deployment Configuration:**
  - `vercel.json` for Vercel frontend hosting
  - `railway.json` + `Procfile` for Railway backend hosting
  - `main.py` entry point for Railway
  - `.env.example` files for frontend and backend
  - `README.md` with step-by-step deployment guide
  - All frontend files migrated to `REACT_APP_API_URL`
  - Backend supports `MONGODB_URI` with fallback to `MONGO_URL`
  - `/health` endpoint added for Railway probes
  - CORS configured via `FRONTEND_URL` env variable

## Prioritized Backlog

### P1 - High Priority
- [ ] Lead assignment round-robin distribution on import

### P2 - Medium Priority
- [ ] WhatsApp messaging templates (one-click standard messages)
- [ ] Meetings Calendar integration
- [ ] Reminders system
- [ ] Instagram/WhatsApp lead source filters

### P3 - Nice to Have
- [ ] Dashboard charts/analytics
- [ ] Duplicate merge functionality
- [ ] Lead notes and activity timeline
- [ ] Backend refactoring (split server.py into route modules)
