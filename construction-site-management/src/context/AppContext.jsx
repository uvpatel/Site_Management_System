/**
 * AppContext
 * Global state management using React Context API
 * Manages authentication, projects, tasks, workers, inventory, and finance data
 */

import { createContext, useState, useCallback } from 'react';
import {
  mockUsers,
  mockProjects,
  mockTasks,
  mockWorkers,
  mockInventory,
  mockFinance,
} from '../data/mockData';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Authentication state
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Data collections
  const [users] = useState(mockUsers);
  const [projects, setProjects] = useState(mockProjects);
  const [tasks, setTasks] = useState(mockTasks);
  const [workers, setWorkers] = useState(mockWorkers);
  const [inventory, setInventory] = useState(mockInventory);
  const [financeRecords, setFinanceRecords] = useState(mockFinance);

  // Authentication actions
  const login = useCallback((userId) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
  }, [users]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  }, []);

  const switchRole = useCallback((newRole) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, role: newRole });
    }
  }, [currentUser]);

  // Project actions
  const addProject = useCallback((project) => {
    const newProject = {
      id: `proj-${Date.now()}`,
      ...project,
      status: 'Planning',
    };
    setProjects((prev) => [...prev, newProject]);
    return newProject;
  }, []);

  const updateProject = useCallback((id, updates) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const deleteProject = useCallback((id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // Task actions
  const addTask = useCallback((task) => {
    const newTask = {
      id: `task-${Date.now()}`,
      ...task,
      status: 'Open',
    };
    setTasks((prev) => [...prev, newTask]);
    return newTask;
  }, []);

  const updateTaskStatus = useCallback((id, status) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
  }, []);

  // Worker actions
  const updateWorkerAttendance = useCallback((workerId, status, date) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          const existingAttendance = w.attendance.find((a) => a.date === date);
          if (existingAttendance) {
            return {
              ...w,
              attendance: w.attendance.map((a) =>
                a.date === date ? { ...a, status } : a
              ),
            };
          } else {
            return {
              ...w,
              attendance: [...w.attendance, { date, status }],
            };
          }
        }
        return w;
      })
    );
  }, []);

  // Inventory actions
  const issueMaterial = useCallback((itemId, quantity, projectId) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            current_stock: Math.max(0, item.current_stock - quantity),
          };
        }
        return item;
      })
    );
  }, []);

  const addProcurement = useCallback((itemId, quantity, cost) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            current_stock: item.current_stock + quantity,
          };
        }
        return item;
      })
    );
  }, []);

  // Finance actions
  const addFinanceRecord = useCallback((record) => {
    const newRecord = {
      id: `fin-${Date.now()}`,
      ...record,
      payment_status: 'Pending',
    };
    setFinanceRecords((prev) => [...prev, newRecord]);
    return newRecord;
  }, []);

  const value = {
    // Authentication
    currentUser,
    isAuthenticated,
    login,
    logout,
    switchRole,

    // Data collections
    users,
    projects,
    tasks,
    workers,
    inventory,
    financeRecords,

    // Project actions
    addProject,
    updateProject,
    deleteProject,

    // Task actions
    addTask,
    updateTaskStatus,

    // Worker actions
    updateWorkerAttendance,

    // Inventory actions
    issueMaterial,
    addProcurement,

    // Finance actions
    addFinanceRecord,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
