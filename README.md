# Symbol Lean Search - Frontend

An AI-powered document search and chat platform frontend built with Next.js, TypeScript, and Tailwind CSS.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Environment Variables](#environment-variables)
   - [Running Locally](#running-locally)
   - [Building for Production](#building-for-production)
   - [Linting](#linting)
5. [Project Structure](#project-structure)
6. [Localization](#localization)

## Overview

Symbol Lean Search Frontend is a web application that provides a fast and efficient way to:

- Chat with an AI assistant over your documents
- Upload, manage, and search files using AI-powered embeddings
- Manage users and global files via an admin panel (role-based)
- Customize system prompts and user profile settings
- Switch between light and dark mode
- Switch language between English and Dutch

## Features

- **AI Chat**: Interactive chat interface using streaming responses.
- **File Management**: Upload files, view processing status, download or delete files.
- **Document Search**: Search through uploaded documents for relevant passages.
- **Admin Panel**: User management and global file uploads for admin users.
- **Authentication**: Sign up, sign in, and sign out with JWT-based auth.
- **Profile & Settings**: Update personal info and AI system prompt.
- **Localization**: English (en) and Dutch (nl) supported via a simple translation context.
- **Theming**: Light/dark mode toggle powered by `next-themes`.

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Next Themes](https://github.com/pacocoursey/next-themes)
- [Axios](https://axios-http.com/) for API requests
- [Next Intl](https://next-intl.dev/) for translations
- [Material UI](https://mui.com/) components
- [Heroicons](https://heroicons.com/) for icons
- [ApexCharts](https://apexcharts.com/) for data visualization
- [Flatpickr](https://flatpickr.js.org/) for date/time pickers
- [JS Vector Map](https://jsvectormap.com/) for interactive maps

## Getting Started

### Prerequisites

- Node.js (v16 or above)
- npm (v8 or above) or Yarn

### Installation

```bash
git clone https://github.com/BCJonkhout/lean-search-frontend.git
cd lean-search-frontend
npm install
```

### Environment Variables

Create a `.env.local` file in the project root to configure environment variables:

```bash
# Base URL of the backend API
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

By default, if `NEXT_PUBLIC_API_URL` is not set, the app will attempt to use `http://localhost:3000/api`.

### Running Locally

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Project Structure

```
public/             Static assets (images, favicon, etc.)
src/
├── app/             Next.js App Router pages and layouts
├── components/      Reusable UI components & layouts
├── contexts/        React context providers (Auth, Language, Sidebar)
├── services/        API service modules (Auth, Chat, Documents, Admin)
├── translations/    i18n translation files (en, nl)
├── css/             Global CSS imports
├── fonts/           Custom font files
├── hooks/           Custom React hooks
├── lib/             Helper libraries
└── types/           TypeScript type definitions
next.config.mjs     Next.js configuration
tailwind.config.ts  Tailwind CSS configuration
postcss.config.js   PostCSS configuration
tsconfig.json       TypeScript configuration
package.json        npm scripts and dependencies
```

## Localization

Translate your UI by editing or adding files in `src/translations/`. The language context uses dot‑notation keys (e.g., `common.signIn`) to resolve localized strings.