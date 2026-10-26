import { z } from 'zod';

const envSchema = z.object({
  VITE_APP_ENV: z.enum(['development', 'test', 'production']).default('development'),
  VITE_APP_TITLE: z.string().default('School ERP'),
  VITE_API_BASE_URL: z.string().url().default('http://localhost:5000/api/v1'),
  VITE_API_TIMEOUT: z.coerce.number().int().positive().default(15000),
  VITE_ENABLE_DEVTOOLS: z
    .string()
    .optional()
    .transform(val => val === 'true'),
});

const parsedEnv = envSchema.safeParse(import.meta.env);

if (!parsedEnv.success) {
  console.error('Environment validation failed:', parsedEnv.error.flatten().fieldErrors);
  throw new Error('Invalid frontend environment configuration. Check your .env file.');
}

export const env = parsedEnv.data;
