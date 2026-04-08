import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Projects from '../pages/projects/Projects';
import { AppContext } from '../context/AppContext';
import { AuthContext } from '../context/AuthContext';

const appValue = {
  projects: [
    {
      id: 'p1',
      project_name: 'Riverfront Residency',
      site_location: 'Vadodara',
      project_type: 'Residential',
      budget: 1000000,
      start_date: '2026-04-01',
      end_date: '2026-12-30',
      status: 'Planning',
    },
  ],
  addProject: vi.fn(),
  updateProject: vi.fn(),
  deleteProject: vi.fn(),
  projectMembers: [],
};

describe('Projects page', () => {
  it('renders project records from context', () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: { id: 'u1', role: 'Admin' } }}>
          <AppContext.Provider value={appValue}>
            <Projects />
          </AppContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Riverfront Residency/i)).toBeInTheDocument();
    expect(screen.getByText(/Vadodara/i)).toBeInTheDocument();
  });
});
