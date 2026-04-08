import { render, screen } from '@testing-library/react';
import Dashboard from '../pages/dashboard/Dashboard';
import { AppContext } from '../context/AppContext';
import { AuthContext } from '../context/AuthContext';

vi.mock('../components/charts', () => ({
  BudgetChart: () => <div>BudgetChart</div>,
  CostDistributionChart: () => <div>CostDistributionChart</div>,
}));

const appValue = {
  projects: [{ id: 'p1', project_name: 'Skyline Tower', budget: 500000, status: 'Active' }],
  tasks: [{ id: 't1', task_name: 'Foundation', status: 'In Progress', projectId: 'p1', assigned_to: 'u1' }],
  workers: [{ id: 'w1', name: 'Ravi', skill_type: 'Mason' }],
  inventory: [{ id: 'i1', item_name: 'Cement', current_stock: 10, min_stock_qty: 20, uom: 'bag', unit_cost: 400 }],
  financeRecords: [{ id: 'f1', projectId: 'p1', amount: 120000, cost_category: 'Labor' }],
  vendors: [{ id: 'v1', vendor_name: 'BuildSupply', rating: 4.5 }],
  purchaseOrders: [{ id: 'po1', delivery_status: 'ordered' }],
  attendanceRecords: [],
  notifications: [{ id: 'n1', read: false }],
};

describe('Dashboard', () => {
  it('renders KPI data from normalized context records', () => {
    render(
      <AuthContext.Provider value={{ user: { id: 'u1', role: 'Project_Manager' } }}>
        <AppContext.Provider value={appValue}>
          <Dashboard />
        </AppContext.Provider>
      </AuthContext.Provider>
    );

    expect(screen.getByText(/Skyline Tower/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Projects/i)).toBeInTheDocument();
    expect(screen.getAllByText('1').length).toBeGreaterThan(0);
  });
});
