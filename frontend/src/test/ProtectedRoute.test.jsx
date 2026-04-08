import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import ProtectedRoute from '../components/ProtectedRoute';
import { AuthContext } from '../context/AuthContext';

const renderRoute = (authValue, child = <div>Secret Content</div>) =>
  render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter>
        <ProtectedRoute allowedRoles={['Admin']}>{child}</ProtectedRoute>
      </MemoryRouter>
    </AuthContext.Provider>
  );

describe('ProtectedRoute', () => {
  it('renders a loading spinner while auth initializes', () => {
    const { container } = renderRoute({ user: null, isAuthenticated: false, loading: true });
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders access restricted state for disallowed roles', () => {
    renderRoute({ user: { role: 'Worker' }, isAuthenticated: true, loading: false });
    expect(screen.getByText('Access Restricted')).toBeInTheDocument();
    expect(screen.getByText('Go to your dashboard')).toBeInTheDocument();
  });

  it('renders protected content for allowed roles', () => {
    renderRoute({ user: { role: 'Admin' }, isAuthenticated: true, loading: false });
    expect(screen.getByText('Secret Content')).toBeInTheDocument();
  });
});
