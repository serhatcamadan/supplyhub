import { defineConfig, devices } from '@playwright/test'
import { existsSync, readFileSync } from 'fs'

// Load .env.local if present (local dev). In CI the vars come from the workflow env.
function parseEnvFile(path: string): Record<string, string> {
  if (!existsSync(path)) return {}
  return Object.fromEntries(
    readFileSync(path, 'utf-8')
      .split('\n')
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => {
        const eq = line.indexOf('=')
        return [line.slice(0, eq).trim(), line.slice(eq + 1).trim()]
      }),
  )
}

const localEnv = parseEnvFile('.env.local')

function pick(...keys: string[]): Record<string, string> {
  const result: Record<string, string> = {}
  for (const k of keys) {
    const v = localEnv[k] ?? process.env[k]
    if (v) result[k] = v
  }
  return result
}

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: [
    {
      command: 'npm run dev',
      url: 'http://localhost:3000',
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command: 'node e2e/mock-api-server.mjs',
      url: 'http://localhost:3001/health',
      reuseExistingServer: true,
      timeout: 10_000,
      env: pick(
        'JWT_ACCESS_SECRET',
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        'SUPABASE_SERVICE_ROLE_KEY',
        'NEXT_PUBLIC_API_URL',
        'TEST_PASSWORD',
      ),
    },
  ],
})
