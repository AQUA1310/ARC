# ARC Portal — Campus ERP System

A full-stack academic portal for managing student and teacher data, built for the Mathematics Department at NIT Warangal. Supports role-based dashboards, secure authentication, live communication pipelines, and academic tracking.

**Live Demo:** https://campus-erp-1ovn.vercel.app/  
**Repository:** [Add your GitHub URL here]

## Overview

ARC Portal is a modern campus management system tailored for higher education workflows. The platform provides secure, decoupled workspaces for students and teachers. Students can check exam results, track CGPA progression, submit assignments, and communicate with instructors. Teachers have unified oversight to manage class rosters, filter student groups by core branches, and handle data pipelines.

## Tech Stack

- **Frontend:** React (Hooks, Context Architecture), TypeScript, Vite
- **Styling:** Tailwind CSS, shadcn/ui component primitive library
- **Icons & UI:** Lucide React, Sonner (Toasts)
- **Backend-as-a-Service (BaaS):** Supabase (PostgreSQL Database, Auth, Realtime Engine)
- **Routing:** React Router v6
- **Deployment:** Vercel (CI/CD Pipeline)

## Key Features

- **Production Authentication Engine** — Real-world user provisioning managed via Supabase Auth, completely moving away from client-side mock configurations.
- **Dual-Provider Login Systems** — Supports classic email/password authentication alongside native **Google OAuth 2.0** federated single sign-on.
- **Strict Institution Email Validation** — Enforces institutional constraints via structured frontend RegExp validation matching NITW Mathematics formats:
  - *Format Example:* `[initials][year]ma[code]@student.nitw.ac.in` (e.g., `pz24mab0a21@student.nitw.ac.in`)
  - *Faculty Whitelisting:* Only pre-authorized institutional faculty emails are allowed to register administrative/teacher roles.
- **Role-Based Access Control (RBAC)** — Strict separation between student and faculty view states, enforced at both the application router layer and database storage layer.
- **Live Real-Time Chat Engine** — Event-driven chat workspace allowing instantaneous messaging between students and professors, leveraging Supabase PostgreSQL Replication Realtime streams.
- **Row-Level Security (RLS)** — Secure data multi-tenancy. Policies defined inside PostgreSQL ensure students can exclusively query their personal records even if the client app is completely bypassed.

## Architecture & Data Flow

The portal leverages a modern, event-driven serverless pattern removing the overhead of an intermediary server:

1. **Authentication State:** User sessions are handled securely by Supabase inside the protected `auth.users` schema, abstraction-hiding password salting (`bcrypt`) and JWT issuance.
2. **Profile Extensibility:** Upon successful sign-up, user profiles automatically bind application metadata (e.g., specific engineering/science branches, unique roll numbers) to a public schema table linked directly via the account's underlying `UUID`.
3. **Branch Specialization Routing:** Academic structures map students straight into official, filtered branch views matching true registration options (`M.Sc. Mathematics`, `Mathematics & Scientific Computing`, `B.Tech Mathematics & Computing`, `Int Msc Mathematics`).

## Database Schema

- `profiles` — Core identity mapping. Tracks user metadata (`id` linked to Auth UUID, `name`, `role`, `roll_number`, `branch`).
- `subjects` — Academic course inventory catalog.
- `semester_results` — Higher-level student academic standings tracking localized SGPA/CGPA variables across semesters.
- `exam_results` — Normalized course-level grade entries mapped to broad semester tracking records.
- `minor_results` — Granular test results capturing mid-term evaluation points per class code.
- `messages` — Real-time chat payload repository (`id`, `sender_id`, `receiver_id`, `content`, `created_at`).

## Getting Started (Local Development)

```bash
# 1. Clone the repository repository
git clone [your-repo-url]
cd [project-folder]

# 2. Install modern dependencies 
npm install

# 3. Establish environmental variables 
# Create a localized `.env` tracking configuration file at your root directory:
# VITE_SUPABASE_URL=your_supabase_project_url
# VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

# 4. Initialize development compiler server
npm run dev
```
CampusErp
├─ components.json
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ public
│  ├─ favicon.ico
│  ├─ logo.png
│  ├─ lovable-uploads
│  │  ├─ 01aa3e2d-72b1-482f-81a3-5878ef282949.png
│  │  ├─ 7de97c84-fdc4-4add-a871-6b9b5f6fd8dd.png
│  │  ├─ a002a62c-c2a6-4e5c-9728-682983b115c4.png
│  │  ├─ b82fdcac-d78c-40c5-93da-57537fc9ce5a.png
│  │  ├─ e1ec4d14-9c17-4973-9868-b2e1f7f239b0.png
│  │  └─ f0db7aa5-f112-4e07-b137-5f66d3368625.png
│  ├─ placeholder.svg
│  └─ robots.txt
├─ README.md
├─ src
│  ├─ App.css
│  ├─ App.tsx
│  ├─ components
│  │  ├─ auth
│  │  │  ├─ LoginForm.tsx
│  │  │  └─ SignupForm.tsx
│  │  ├─ shared
│  │  │  ├─ DashboardLayout.tsx
│  │  │  └─ ProtectedRoute.tsx
│  │  └─ ui
│  │     ├─ accordion.tsx
│  │     ├─ alert-dialog.tsx
│  │     ├─ alert.tsx
│  │     ├─ aspect-ratio.tsx
│  │     ├─ avatar.tsx
│  │     ├─ badge.tsx
│  │     ├─ breadcrumb.tsx
│  │     ├─ button.tsx
│  │     ├─ calendar.tsx
│  │     ├─ card.tsx
│  │     ├─ carousel.tsx
│  │     ├─ chart.tsx
│  │     ├─ checkbox.tsx
│  │     ├─ collapsible.tsx
│  │     ├─ command.tsx
│  │     ├─ context-menu.tsx
│  │     ├─ dialog.tsx
│  │     ├─ drawer.tsx
│  │     ├─ dropdown-menu.tsx
│  │     ├─ form.tsx
│  │     ├─ hover-card.tsx
│  │     ├─ input-otp.tsx
│  │     ├─ input.tsx
│  │     ├─ label.tsx
│  │     ├─ menubar.tsx
│  │     ├─ navigation-menu.tsx
│  │     ├─ pagination.tsx
│  │     ├─ popover.tsx
│  │     ├─ progress.tsx
│  │     ├─ radio-group.tsx
│  │     ├─ resizable.tsx
│  │     ├─ scroll-area.tsx
│  │     ├─ select.tsx
│  │     ├─ separator.tsx
│  │     ├─ sheet.tsx
│  │     ├─ sidebar.tsx
│  │     ├─ skeleton.tsx
│  │     ├─ slider.tsx
│  │     ├─ sonner.tsx
│  │     ├─ switch.tsx
│  │     ├─ table.tsx
│  │     ├─ tabs.tsx
│  │     ├─ textarea.tsx
│  │     ├─ toast.tsx
│  │     ├─ toaster.tsx
│  │     ├─ toggle-group.tsx
│  │     ├─ toggle.tsx
│  │     ├─ tooltip.tsx
│  │     └─ use-toast.ts
│  ├─ contexts
│  │  └─ DataContext.tsx
│  ├─ hooks
│  │  ├─ use-mobile.tsx
│  │  ├─ use-toast.ts
│  │  └─ useAuth.tsx
│  ├─ index.css
│  ├─ lib
│  │  ├─ supabase.ts
│  │  └─ utils.ts
│  ├─ main.tsx
│  ├─ pages
│  │  ├─ Index.tsx
│  │  ├─ NotFound.tsx
│  │  ├─ Signup.tsx
│  │  ├─ student
│  │  │  ├─ Assignments.tsx
│  │  │  ├─ Attendance.tsx
│  │  │  ├─ Chat.tsx
│  │  │  ├─ Dashboard.tsx
│  │  │  ├─ Results.tsx
│  │  │  └─ Timetable.tsx
│  │  └─ teacher
│  │     ├─ Assignments.tsx
│  │     ├─ Attendance.tsx
│  │     ├─ Chat.tsx
│  │     ├─ Dashboard.tsx
│  │     ├─ Results.tsx
│  │     └─ Students.tsx
│  ├─ styles
│  │  └─ progress.css
│  └─ vite-env.d.ts
├─ supabaseClient.js
├─ tailwind.config.ts
├─ tailwind.config.zip
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
├─ vercel.json
└─ vite.config.ts

```
```
CampusErp
├─ components.json
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ public
│  ├─ favicon.ico
│  ├─ logo.png
│  ├─ lovable-uploads
│  │  ├─ 01aa3e2d-72b1-482f-81a3-5878ef282949.png
│  │  ├─ 7de97c84-fdc4-4add-a871-6b9b5f6fd8dd.png
│  │  ├─ a002a62c-c2a6-4e5c-9728-682983b115c4.png
│  │  ├─ b82fdcac-d78c-40c5-93da-57537fc9ce5a.png
│  │  ├─ e1ec4d14-9c17-4973-9868-b2e1f7f239b0.png
│  │  └─ f0db7aa5-f112-4e07-b137-5f66d3368625.png
│  ├─ placeholder.svg
│  └─ robots.txt
├─ README.md
├─ src
│  ├─ App.css
│  ├─ App.tsx
│  ├─ components
│  │  ├─ auth
│  │  │  ├─ LoginForm.tsx
│  │  │  └─ SignupForm.tsx
│  │  ├─ shared
│  │  │  ├─ DashboardLayout.tsx
│  │  │  └─ ProtectedRoute.tsx
│  │  └─ ui
│  │     ├─ accordion.tsx
│  │     ├─ alert-dialog.tsx
│  │     ├─ alert.tsx
│  │     ├─ aspect-ratio.tsx
│  │     ├─ avatar.tsx
│  │     ├─ badge.tsx
│  │     ├─ breadcrumb.tsx
│  │     ├─ button.tsx
│  │     ├─ calendar.tsx
│  │     ├─ card.tsx
│  │     ├─ carousel.tsx
│  │     ├─ chart.tsx
│  │     ├─ checkbox.tsx
│  │     ├─ collapsible.tsx
│  │     ├─ command.tsx
│  │     ├─ context-menu.tsx
│  │     ├─ dialog.tsx
│  │     ├─ drawer.tsx
│  │     ├─ dropdown-menu.tsx
│  │     ├─ form.tsx
│  │     ├─ hover-card.tsx
│  │     ├─ input-otp.tsx
│  │     ├─ input.tsx
│  │     ├─ label.tsx
│  │     ├─ menubar.tsx
│  │     ├─ navigation-menu.tsx
│  │     ├─ pagination.tsx
│  │     ├─ popover.tsx
│  │     ├─ progress.tsx
│  │     ├─ radio-group.tsx
│  │     ├─ resizable.tsx
│  │     ├─ scroll-area.tsx
│  │     ├─ select.tsx
│  │     ├─ separator.tsx
│  │     ├─ sheet.tsx
│  │     ├─ sidebar.tsx
│  │     ├─ skeleton.tsx
│  │     ├─ slider.tsx
│  │     ├─ sonner.tsx
│  │     ├─ switch.tsx
│  │     ├─ table.tsx
│  │     ├─ tabs.tsx
│  │     ├─ textarea.tsx
│  │     ├─ toast.tsx
│  │     ├─ toaster.tsx
│  │     ├─ toggle-group.tsx
│  │     ├─ toggle.tsx
│  │     ├─ tooltip.tsx
│  │     └─ use-toast.ts
│  ├─ contexts
│  │  └─ DataContext.tsx
│  ├─ hooks
│  │  ├─ use-mobile.tsx
│  │  ├─ use-toast.ts
│  │  └─ useAuth.tsx
│  ├─ index.css
│  ├─ lib
│  │  ├─ supabase.ts
│  │  └─ utils.ts
│  ├─ main.tsx
│  ├─ pages
│  │  ├─ Index.tsx
│  │  ├─ NotFound.tsx
│  │  ├─ Signup.tsx
│  │  ├─ student
│  │  │  ├─ Assignments.tsx
│  │  │  ├─ Attendance.tsx
│  │  │  ├─ Chat.tsx
│  │  │  ├─ Dashboard.tsx
│  │  │  ├─ Results.tsx
│  │  │  └─ Timetable.tsx
│  │  └─ teacher
│  │     ├─ Assignments.tsx
│  │     ├─ Attendance.tsx
│  │     ├─ Chat.tsx
│  │     ├─ Dashboard.tsx
│  │     ├─ Results.tsx
│  │     └─ Students.tsx
│  ├─ styles
│  │  └─ progress.css
│  └─ vite-env.d.ts
├─ supabaseClient.js
├─ tailwind.config.ts
├─ tailwind.config.zip
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
├─ vercel.json
└─ vite.config.ts

```