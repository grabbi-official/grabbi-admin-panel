import { useEffect } from 'react'

// Base URL of the HQ app that now owns the retired admin-panel sections.
// Overridable via VITE_HQ_URL so non-prod environments can point elsewhere.
export const HQ_URL = import.meta.env.VITE_HQ_URL || 'https://hq.grabbi.uk'

/**
 * Full-page redirect to the HQ app.
 *
 * The admin panel only retains Franchises and Users management; every other
 * section has moved to hq.grabbi.uk. This component performs a hard browser
 * navigation (not a client-side route change) so the user leaves the SPA.
 */
export default function ExternalRedirect({ to = HQ_URL }) {
  useEffect(() => {
    // Use replace() so the retired route does not land in browser history.
    window.location.replace(to)
  }, [to])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">This section has moved</h1>
      <p className="text-gray-600 mb-6">
        Admin functions now live in Grabbi HQ. Redirecting you to{' '}
        <span className="font-medium">hq.grabbi.uk</span>…
      </p>
      <a href={to} className="btn-primary">Continue to Grabbi HQ</a>
    </div>
  )
}
