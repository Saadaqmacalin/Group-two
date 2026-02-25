import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Package, Users, ShoppingCart, DollarSign, LogOut, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard/stats');
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { 
      label: 'Total Revenue', 
      value: stats ? `$${stats.sales.totalRevenue.toLocaleString()}` : '$0', 
      icon: DollarSign, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50' 
    },
    { 
      label: 'Active Orders', 
      value: stats ? stats.orders.toString() : '0', 
      icon: ShoppingCart, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      label: 'Total Products', 
      value: stats ? stats.products.toString() : '0', 
      icon: Package, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50' 
    },
    { 
      label: 'Total Customers', 
      value: stats ? stats.customers.toString() : '0', 
      icon: Users, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50' 
    },
  ];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome Back, {user?.name}!</h1>
          <p className="text-slate-500 mt-1">Here is what's happening with your store today.</p>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-medium shadow-sm transition-all active:scale-95"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-default"
          >
            <div className="flex items-center gap-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-64 flex flex-col">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Sales Analytics</h3>
          <div className="flex-1 flex items-center justify-center text-slate-400 font-medium bg-slate-50 rounded-xl border border-dashed border-slate-200">
            Chart coming soon
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-64 flex flex-col">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Performance</h3>
          <div className="flex-1 flex items-center justify-center text-slate-400 font-medium bg-slate-50 rounded-xl border border-dashed border-slate-200">
            Activity feed coming soon
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
