import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import { Card, Badge, Button, Input } from '../components/ui';
import { AlertTriangle, Lock } from 'lucide-react';

export default function Inventory() {
  const { inventory } = useContext(AppContext);
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Check if user can manage inventory (Admin, Project Manager, Storekeeper)
  const canManageInventory = ['Admin', 'Project_Manager', 'Storekeeper'].includes(user?.role);

  // Render access denied for other roles
  if (!canManageInventory) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-50">Inventory Management</h1>
          <p className="text-slate-400 mt-2">Monitor material stock levels and manage reorders</p>
        </div>
        <Card className="bg-rose-500/10 border border-rose-500/50">
          <div className="flex items-center gap-3">
            <Lock size={20} className="text-rose-500" />
            <p className="text-rose-400">
              You don't have access to inventory management. Only Admin, Project Managers, and Storekeepers can view this section.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // Filter inventory based on search and category
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ['All', ...new Set(inventory.map(item => item.category))];

  // Check if item is low stock
  const isLowStock = (item) => item.current_stock < item.min_stock_qty;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-50">Inventory Management</h1>
        <p className="text-slate-400 mt-2">Monitor material stock levels and manage reorders</p>
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Search items"
          type="text"
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by name or category..."
        />
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Category</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-50 focus:border-amber-500 focus:outline-none"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <Card title="Inventory Items">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Item Name</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Category</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Unit Cost</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Current Stock</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Min Stock</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.length > 0 ? (
                filteredInventory.map(item => (
                  <tr
                    key={item.id}
                    className={`border-b border-slate-800 hover:bg-slate-800/50 transition-colors ${
                      isLowStock(item) ? 'bg-rose-500/10' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-slate-50">{item.item_name}</td>
                    <td className="py-3 px-4 text-slate-400">{item.category}</td>
                    <td className="py-3 px-4 text-slate-50">${item.unit_cost.toFixed(2)}</td>
                    <td className="py-3 px-4 text-slate-50">{item.current_stock} {item.uom}</td>
                    <td className="py-3 px-4 text-slate-50">{item.min_stock_qty} {item.uom}</td>
                    <td className="py-3 px-4">
                      {isLowStock(item) ? (
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-rose-500" />
                          <Badge variant="danger">Low Stock</Badge>
                        </div>
                      ) : (
                        <Badge variant="success">In Stock</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {isLowStock(item) && (
                        <Button variant="primary" size="sm">
                          Reorder
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 px-4 text-center text-slate-400">
                    No inventory items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Low Stock Summary */}
      <Card title="Low Stock Alert">
        <div className="space-y-2">
          {inventory.filter(isLowStock).length > 0 ? (
            <div>
              <p className="text-slate-50 font-medium mb-3">
                {inventory.filter(isLowStock).length} item(s) below minimum stock level
              </p>
              <div className="space-y-2">
                {inventory.filter(isLowStock).map(item => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                    <div>
                      <p className="text-slate-50">{item.item_name}</p>
                      <p className="text-sm text-slate-400">
                        Current: {item.current_stock} {item.uom} | Min: {item.min_stock_qty} {item.uom}
                      </p>
                    </div>
                    <Button variant="danger" size="sm">
                      Reorder Now
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-emerald-500">All items are above minimum stock level</p>
          )}
        </div>
      </Card>
    </div>
  );
}
