import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  Package, 
  TrendingUp, 
  Users, 
  ShoppingBag,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useFarmerAuth } from '../context/FarmerAuthContext';

const FarmerDashboard = () => {
  const { farmer } = useFarmerAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, salesRes] = await Promise.all([
          api.get('/farmers/products'),
          api.get('/farmers/sales')
        ]);
        
        setStats({
          totalProducts: productsRes.data.length,
          totalSales: salesRes.data.reduce((acc, sale) => acc + sale.totalPrice, 0),
          recentOrders: salesRes.data.slice(0, 5)
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'My Produce', value: stats.totalProducts, icon: Package, color: 'emerald' },
    { title: 'Total Revenue', value: `$${stats.totalSales.toLocaleString()}`, icon: TrendingUp, color: 'amber' },
    { title: 'Harvest Orders', value: stats.recentOrders.length, icon: ShoppingBag, color: 'blue' },
  ];

  if (loading) return <div>Loading Harvest Data...</div>;

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Farm Overview</h1>
        <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest mt-2">Welcome back, {farmer?.farmName}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {statCards.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-900/5 border border-slate-100 flex items-center gap-6"
          >
            <div className={`w-16 h-16 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600`}>
              <stat.icon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.title}</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-900/5 border border-slate-100">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recent Harvesting Orders</h2>
          <button className="text-xs font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-colors flex items-center gap-1">
            View All Sales <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Harvest Items</th>
                <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Earnings</th>
                <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 h-10">
              {stats.recentOrders.map((order) => (
                <tr key={order._id} className="group hover:bg-emerald-50/30 transition-colors">
                  <td className="py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs uppercase">
                        {order.customer?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{order.customer?.name}</p>
                        <p className="text-[10px] font-bold text-slate-400">{order.customer?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6">
                    <p className="text-sm font-bold text-slate-600">
                      {order.items.map(i => i.name).join(', ') || `${order.items.length} ingredients`}
                    </p>
                  </td>
                  <td className="py-6">
                    <p className="text-sm font-black text-slate-900">${order.totalPrice.toLocaleString()}</p>
                  </td>
                  <td className="py-6">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {stats.recentOrders.length === 0 && (
                <tr>
                   <td colSpan="4" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-30">
                        <ShoppingBag className="w-12 h-12" />
                        <p className="text-xs font-black uppercase tracking-widest">Waiting for first harvest sale</p>
                      </div>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
