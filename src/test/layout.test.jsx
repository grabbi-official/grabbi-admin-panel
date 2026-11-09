import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Layout from '../components/Layout'

function renderLayout(props = {}, initialEntry = '/franchises') {
  const defaultProps = {
    onLogout: vi.fn(),
    ...props,
  }
  return {
    ...render(
      <MemoryRouter initialEntries={[initialEntry]}>
        <Layout {...defaultProps} />
      </MemoryRouter>
    ),
    onLogout: defaultProps.onLogout,
  }
}

describe('Layout Component', () => {
  describe('Sidebar renders', () => {
    it('renders Grabbi Admin branding', () => {
      renderLayout()
      const brandTexts = screen.getAllByText('Grabbi Admin')
      expect(brandTexts.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Navigation items', () => {
    it('renders only the retained navigation links (Franchises, Users)', () => {
      renderLayout()
      expect(screen.getByText('Franchises')).toBeInTheDocument()
      expect(screen.getByText('Users')).toBeInTheDocument()
    })

    it('does not render links for sections moved to HQ', () => {
      renderLayout()
      expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
      expect(screen.queryByText('Products')).not.toBeInTheDocument()
      expect(screen.queryByText('Orders')).not.toBeInTheDocument()
      expect(screen.queryByText('Categories')).not.toBeInTheDocument()
      expect(screen.queryByText('Promotions')).not.toBeInTheDocument()
    })

    it('renders Logout button', () => {
      renderLayout()
      expect(screen.getByText('Logout')).toBeInTheDocument()
    })
  })

  describe('Active route highlight', () => {
    it('marks Franchises link as current page when on /franchises', () => {
      renderLayout({}, '/franchises')
      const franchisesLink = screen.getByText('Franchises').closest('a')
      expect(franchisesLink).toHaveAttribute('aria-current', 'page')
    })

    it('marks Users link as current page when on /users', () => {
      renderLayout({}, '/users')
      const usersLink = screen.getByText('Users').closest('a')
      expect(usersLink).toHaveAttribute('aria-current', 'page')
    })

    it('does not mark non-active routes', () => {
      renderLayout({}, '/franchises')
      const usersLink = screen.getByText('Users').closest('a')
      expect(usersLink).not.toHaveAttribute('aria-current', 'page')
    })
  })

  describe('Mobile toggle', () => {
    it('renders mobile menu toggle button', () => {
      renderLayout()
      const toggleBtn = screen.getByLabelText('Toggle menu')
      expect(toggleBtn).toBeInTheDocument()
    })
  })

  describe('Logout', () => {
    it('calls onLogout when Logout button is clicked', async () => {
      const user = userEvent.setup()
      const { onLogout } = renderLayout()

      await user.click(screen.getByText('Logout'))

      expect(onLogout).toHaveBeenCalledTimes(1)
    })
  })
})
