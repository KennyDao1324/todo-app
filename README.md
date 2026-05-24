# Swinburne Task Manager

This project is a friendly and simple task management website made for organizing my Swinburne University work.

The idea behind this web app is to make it easier to keep track of assignments, study goals, personal reminders, and important deadlines in one place. Instead of writing tasks in different apps or forgetting due dates, this website helps me see everything clearly and stay on top of what needs to be done.

## About This Website

This website works like a personal study planner and to-do list.

Users can add tasks, write short descriptions, choose a priority level, set a due date, give each task a category, and update the task status as they make progress. The app also shows which tasks are urgent or overdue, so the most important work stands out immediately.

This makes it useful for:

- university assignments
- weekly study plans
- project milestones
- personal reminders
- everyday task organization

## Main Functions

### Add and manage tasks

The app allows users to:

- create a task
- edit a task
- delete a task
- update task progress

Each task includes:

- title
- description
- priority
- due date
- category
- status

### Filter and search tasks

Users can quickly sort their tasks by:

- priority
- category
- due date
- status

There is also a search bar to make it easier to find a task quickly.

### Live countdown for deadlines

One of the most useful parts of the app is the live countdown timer.

If a task has a due date, the website shows how much time is left, such as:

`1d 23:59:59 left`

If the due date has passed, the task is marked as overdue automatically.

### Smart task focus

The website also highlights tasks that need attention first.

This includes:

- urgent tasks
- overdue tasks
- high priority tasks

This helps users focus on the most important work first.

## Design Style

The website is designed to feel clean, soft, and easy to use.

- responsive on desktop and mobile
- clear layout
- simple colors for task priority
- readable task cards
- friendly and minimal interface

## Tools and Technology

This project was built using:

- React
- TypeScript
- Vite
- CSS
- browser `localStorage`

The current version saves task data in the browser, so tasks stay there even after refreshing the page.

## How to Run the Website

Open terminal and run:

```bash
cd /Users/daoduykha/Documents/Playground/todo-app
npm install
npm run dev
```

Then open the local address shown in the terminal, usually:

```bash
http://localhost:5173
```

## Build the Project

```bash
npm run build
```

## Preview the Build

```bash
npm run preview
```

## Project Goal

This project was created as a practical web application for managing Swinburne University tasks in a more organized and visual way.

The goal is not only to build a working to-do list, but also to create something that feels genuinely useful for student life. It is meant to support better time management, clearer planning, and less stress around deadlines.

## Future Ideas

In the future, this website could be improved by adding:

- Supabase database support
- user login
- cloud sync across devices
- dark mode
- drag and drop task arrangement
- separate views for study, personal, and project tasks

