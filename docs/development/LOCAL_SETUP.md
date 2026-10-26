# Local Development Setup Guide

## 1. Prerequisites

Before setting up the frontend, ensure your environment meets the minimum requirements:

- **Node.js**: `>= 20.0.0` (LTS recommended)
- **npm**: `>= 10.0.0`
- **Git**

Verify your local versions:

```bash
node -v
npm -v
```

---

## 2. Step-by-Step Installation

### Step 1: Navigate to the Frontend Directory

```bash
cd erp-frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Copy the `.env.example` template into `.env`:

```bash
cp .env.example .env
```

Ensure `VITE_API_BASE_URL` points to your running backend (defaults to `http://localhost:5000/api/v1`).

### Step 4: Run the Development Server

```bash
npm run dev
```

Open your browser at `http://localhost:3000`.

---

## 3. Standard Scripts

| Command                 | Action                                                            |
| :---------------------- | :---------------------------------------------------------------- |
| `npm run dev`           | Starts the Vite local development server with HMR                 |
| `npm run build`         | Compiles TypeScript and builds production distribution in `dist/` |
| `npm run preview`       | Locally serves the production build from `dist/`                  |
| `npm run typecheck`     | Validates TypeScript types across the codebase (`tsc --noEmit`)   |
| `npm run lint`          | Runs ESLint analysis                                              |
| `npm run lint:fix`      | Automatically fixes autofixable ESLint issues                     |
| `npm run format`        | Checks code formatting against Prettier                           |
| `npm run format:fix`    | Automatically formats all files with Prettier                     |
| `npm test`              | Runs the Vitest test suite once                                   |
| `npm run test:watch`    | Starts Vitest in interactive watch mode                           |
| `npm run test:coverage` | Generates code coverage report                                    |
