import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import AuthLogin from '../pages/auth/AuthLogin';

const navigateMock = vi.fn();
const loginMock = vi.fn();

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    login: loginMock,
    loading: false,
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe('AuthLogin', () => {
  it('logs in and navigates to the dashboard', async () => {
    loginMock.mockResolvedValueOnce({
      success: true,
      user: { role: 'Admin' },
    });

    render(
      <MemoryRouter>
        <AuthLogin />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'admin@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'SiteOS123!' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith('admin@example.com', 'SiteOS123!', false, 'Site_Engineer');
    });

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/');
    }, { timeout: 2000 });
  }, 10000);
});
