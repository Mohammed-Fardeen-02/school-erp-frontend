# Environment Variables Reference

All client-side environment variables in the School ERP frontend must be prefixed with `VITE_` to be exposed to client-side code by Vite.

## 1. Environment Variables Schema

| Variable               | Type                                      | Default                          | Required | Description                                                 |
| :--------------------- | :---------------------------------------- | :------------------------------- | :------- | :---------------------------------------------------------- |
| `VITE_APP_ENV`         | `'development' \| 'test' \| 'production'` | `'development'`                  | No       | Application runtime environment mode.                       |
| `VITE_APP_TITLE`       | `string`                                  | `'School ERP'`                   | No       | Document title and brand name displayed in headers.         |
| `VITE_API_BASE_URL`    | `string` (Valid URL)                      | `'http://localhost:5000/api/v1'` | Yes      | Root URL of the School ERP backend REST API.                |
| `VITE_API_TIMEOUT`     | `number` (Positive Integer)               | `15000`                          | No       | Maximum time in milliseconds before network requests abort. |
| `VITE_ENABLE_DEVTOOLS` | `'true' \| 'false'`                       | `'false'`                        | No       | Toggles visibility of TanStack Query Devtools.              |

---

## 2. Runtime Validation

Environment variables are validated on application startup via Zod in `src/app/config/env.ts`.

If any variable fails schema validation (for example, if `VITE_API_BASE_URL` is not a valid URL), the application halts immediately with a clear error in the browser console. This prevents runtime errors caused by missing or malformed configuration.

---

## 3. Security Warning

> **CRITICAL SECURITY NOTICE**:
> Variables prefixed with `VITE_` are bundled directly into the compiled JavaScript application and are visible to anyone inspecting network traffic or application source code in the browser.
>
> **NEVER put sensitive credentials, database URLs, secret API keys, or private private keys into `.env` files in this repository.**
