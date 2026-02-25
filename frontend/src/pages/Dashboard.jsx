import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Package, Users, ShoppingCart, DollarSign, LogOut } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const stats = [
    { label: 'Total Sales', value: '$12,450', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Active Orders', value: '45', icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Products', value: '128', icon: Package, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Customers', value: '1,240', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome Back, {user?.name}!</h1>
          <p className="text-slate-500 mt-1">Here is what's happening with your store today.</p>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-medium shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
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
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-64 flex items-center justify-center text-slate-400 font-medium">
          Sales Chart Placeholder
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-64 flex items-center justify-center text-slate-400 font-medium">
          Recent Orders Placeholder
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
