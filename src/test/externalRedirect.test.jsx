import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import ExternalRedirect, { HQ_URL } from '../components/ExternalRedirect'

describe('ExternalRedirect', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('performs a full-page redirect to the HQ app on mount', () => {
    const replace = vi.fn()
    vi.stubGlobal('location', { replace, href: '' })

    render(<ExternalRedirect />)

    expect(replace).toHaveBeenCalledWith(HQ_URL)
  })

  it('redirects to a custom target when provided', () => {
    const replace = vi.fn()
    vi.stubGlobal('location', { replace, href: '' })

    render(<ExternalRedirect to="https://hq.grabbi.uk/users" />)

    expect(replace).toHaveBeenCalledWith('https://hq.grabbi.uk/users')
  })

  it('renders a fallback "Continue to Grabbi HQ" link', () => {
    vi.stubGlobal('location', { replace: vi.fn(), href: '' })

    render(<ExternalRedirect />)

    const link = screen.getByRole('link', { name: /continue to grabbi hq/i })
    expect(link).toHaveAttribute('href', HQ_URL)
    expect(screen.getByText(/this section has moved/i)).toBeInTheDocument()
  })

  it('defaults the HQ URL to hq.grabbi.uk', () => {
    expect(HQ_URL).toBe('https://hq.grabbi.uk')
  })
})
