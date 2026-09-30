import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => cleanup())

// The pages read the router for the fallback state only.
vi.mock('next/router', () => ({
  useRouter: () => ({ isFallback: false, push: vi.fn(), prefetch: vi.fn() }),
}))
