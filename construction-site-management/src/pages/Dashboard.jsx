/**
 * Dashboard Page
 * Overview with KPIs, charts, and recent activity
 * Uses Bento grid layout
 * Role-based customization for different user types
 */

import { useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import { Card, Badge } from '../components/ui';
import { BudgetChart, CostDistributionChart } from '../components/charts';
import { TrendingUp, Users, AlertCircle, DollarSign, Clock, Zap } from 'lucide-react';

const Dashboard = () => {
  const { projects, tasks, workers, inventory, financeRecords } =
    useContext(AppContext);
  const { user } = useAuth();

  // Calculate KPIs based on role
  const kpis = useMemo(() => {
    let filteredProjects = projects;
    let filteredTasks = tasks;

    // Filter data based on user role
    if (user?.role === 'Project_Manager') {
      // Project Manager sees all projects but limited tasks
      filteredTasks = tasks.filter(t => {
        const project = projects.find(p => p.id === t.projectId);
        return project !== undefined;
      });
    } else if (user?.role === 'Site_Engineer') {
      // Site Engineer sees assigned tasks only
      filteredTasks = tasks.filter(t => t.assigned_to === user?.id);
    } else if (user?.role === 'Storekeeper') {
      // Storekeeper doesn't see projects/tasks
      filteredProjects = [];
      filteredTasks = [];
    }

    const totalProjects = filteredProjects.length;
    const activeWorkers = workers.length;
    const lowStockItems = inventory.filter(
      (item) => item.current_stock < item.min_stock_qty
    ).length;
    const totalBudget = filteredProjects.reduce((sum, p) => sum + p.budget, 0);
    const activeTasks = filteredTasks.filter(t => t.status === 'In Progress').length;

    return {
      totalProjects,
      activeWorkers,
      lowStockItems,
      totalBudget,
      activeTasks,
    };
  }, [projects, tasks, workers, inventory, user]);

  // Prepare chart data
  const budgetChartData = useMemo(() => {
    return projects.map((project) => {
      const projectFinance = financeRecords.filter(
        (f) => f.projectId === project.id
      );
      const actualExpenses = projectFinance.reduce((sum, f) => sum + f.amount, 0);

      return {
        name: project.project_name.substring(0, 15),
        budget: project.budget,
        actual: actualExpenses,
      };
    });
  }, [projects, financeRecords]);

  const costDistributionData = useMemo(() => {
    const laborCosts = financeRecords
      .filter((f) => f.cost_category === 'Labor')
      .reduce((sum, f) => sum + f.amount, 0);

    const materialCosts = financeRecords
      .filter((f) => f.cost_category === 'Material')
      .reduce((sum, f) => sum + f.amount, 0);

    return [
      { name: 'Labor Costs', value: laborCosts },
      { name: 'Material Costs', value: materialCosts },
    ];
  }, [financeRecords]);

  // Recent tasks
  const recentTasks = useMemo(() => {
    return tasks.slice(0, 5);
  }, [tasks]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-50">Dashboard</h1>
        <p className="text-slate-400 mt-1">
          Welcome back, {user?.name}! Here's your {user?.role?.replace('_', ' ')} overview.
        </p>
      </div>

      {/* Role-based KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects - Admin, Project Manager, Site Engineer */}
        {['Admin', 'Project_Manager', 'Site_Engineer'].includes(user?.role) && (
          <Card className="lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Projects</p>
                <p className="text-3xl font-bold text-slate-50 mt-2">
                  {kpis.totalProjects}
                </p>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-lg">
                <TrendingUp className="text-amber-500" size={24} />
              </div>
            </div>
          </Card>
        )}

        {/* Active Tasks - Project Manager, Site Engineer */}
        {['Project_Manager', 'Site_Engineer'].includes(user?.role) && (
          <Card className="lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Tasks</p>
                <p className="text-3xl font-bold text-slate-50 mt-2">
                  {kpis.activeTasks}
                </p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Clock className="text-blue-500" size={24} />
              </div>
            </div>
          </Card>
        )}

        {/* Active Workers - Admin, Site Engineer */}
        {['Admin', 'Site_Engineer'].includes(user?.role) && (
          <Card className="lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Workers</p>
                <p className="text-3xl font-bold text-slate-50 mt-2">
                  {kpis.activeWorkers}
                </p>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-lg">
                <Users className="text-emerald-500" size={24} />
              </div>
            </div>
          </Card>
        )}

        {/* Low Stock Items - Admin, Project Manager, Storekeeper */}
        {['Admin', 'Project_Manager', 'Storekeeper'].includes(user?.role) && (
          <Card className="lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Low Stock Items</p>
                <p className="text-3xl font-bold text-slate-50 mt-2">
                  {kpis.lowStockItems}
                </p>
              </div>
              <div className="p-3 bg-rose-500/10 rounded-lg">
                <AlertCircle className="text-rose-500" size={24} />
              </div>
            </div>
          </Card>
        )}

        {/* Total Budget - Admin, Project Manager */}
        {['Admin', 'Project_Manager'].includes(user?.role) && (
          <Card className="lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Budget</p>
                <p className="text-2xl font-bold text-slate-50 mt-2">
                  ${(kpis.totalBudget / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <DollarSign className="text-blue-500" size={24} />
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Charts Section - Role-based visibility */}
      {['Admin', 'Project_Manager'].includes(user?.role) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Budget Chart */}
          <Card title="Budget vs Actual Expenses">
            <BudgetChart data={projects.map((project) => {
              const projectFinance = financeRecords.filter(
                (f) => f.projectId === project.id
              );
              const actualExpenses = projectFinance.reduce((sum, f) => sum + f.amount, 0);

              return {
                name: project.project_name.substring(0, 15),
                budget: project.budget,
                actual: actualExpenses,
              };
            })} />
          </Card>

          {/* Cost Distribution Chart */}
          <Card title="Cost Distribution">
            <CostDistributionChart data={[
              {
                name: 'Labor Costs',
                value: financeRecords
                  .filter((f) => f.cost_category === 'Labor')
                  .reduce((sum, f) => sum + f.amount, 0),
              },
              {
                name: 'Material Costs',
                value: financeRecords
                  .filter((f) => f.cost_category === 'Material')
                  .reduce((sum, f) => sum + f.amount, 0),
              },
            ]} />
          </Card>
        </div>
      )}

      {/* Recent Tasks - All roles except Storekeeper */}
      {user?.role !== 'Storekeeper' && (
        <Card title="Recent Tasks">
          <div className="space-y-3">
            {tasks.slice(0, 5).length === 0 ? (
              <p className="text-slate-400 text-center py-4">No tasks available</p>
            ) : (
              tasks.slice(0, 5).map((task) => {
                const project = projects.find((p) => p.id === task.projectId);
                const statusColor = {
                  Open: 'status',
                  'In Progress': 'warning',
                  Completed: 'success',
                };

                return (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <div>
                      <p className="text-slate-50 font-medium">{task.task_name}</p>
                      <p className="text-slate-400 text-sm">
                        {project?.project_name}
                      </p>
                    </div>
                    <Badge variant={statusColor[task.status] || 'status'}>
                      {task.status}
                    </Badge>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      )}

      {/* Storekeeper-specific: Inventory Overview */}
      {user?.role === 'Storekeeper' && (
        <Card title="Inventory Overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <p className="text-slate-400 text-sm">Total Items</p>
              <p className="text-3xl font-bold text-slate-50 mt-2">{inventory.length}</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <p className="text-slate-400 text-sm">Low Stock Items</p>
              <p className="text-3xl font-bold text-rose-500 mt-2">
                {inventory.filter(i => i.current_stock < i.min_stock_qty).length}
              </p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <p className="text-slate-400 text-sm">Total Value</p>
              <p className="text-3xl font-bold text-emerald-500 mt-2">
                ${(inventory.reduce((sum, i) => sum + (i.current_stock * i.unit_cost), 0) / 1000).toFixed(0)}K
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
