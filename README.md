# TaskFlow OS

A modern, responsive to-do list web app built with React, TypeScript, and Vite. It includes full task CRUD, filtering, task categorization, and a smart priority predictor that surfaces urgent or overdue work.

## What is implemented

- Task model with `title`, `description`, `priority`, `dueDate`, `category`, and `status`
- Create, edit, delete, and inline status updates
- Filtering by priority, category, due-date state, and status
- Search across title, description, and category
- Smart priority predictor for overdue, due soon, and high-focus tasks
- Persistent browser storage with seeded starter data
- Real-time sync across browser tabs using the `storage` event
- Responsive layout optimized for desktop and mobile

## Stack

- Frontend: React 19 + TypeScript
- Tooling: Vite + ESLint
- Persistence: `localStorage` for the prototype

## Local development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

## Product notes

The current version uses local browser storage because it satisfies the prototype requirement for persistence while keeping setup friction low. The task data layer is isolated in [src/taskStore.ts](/Users/daoduykha/Documents/Playground/todo-app/src/taskStore.ts), so replacing it with a Supabase-backed service is straightforward.

## Suggested Supabase upgrade path

1. Add `@supabase/supabase-js` and create a client with environment variables.
2. Replace `loadTasks` and `saveTasks` with async read/write calls to a `tasks` table.
3. Add Supabase realtime subscriptions so task changes sync instantly across devices.
4. Introduce auth if you want per-user task lists.
