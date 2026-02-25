import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Search,
  ChevronRight,
  Download,
  ShoppingBag
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const FarmerSales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const { data } = await api.get('/farmers/sales');
        setSales(data);
      } catch (error) {
        console.error('Failed to fetch sales:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  if (loading) return <div>Loading Sales Performance...</div>;

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Farm Performance</h1>
          <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest mt-2">{sales.length} Harvest Sales Recorded</p>
        </div>
        <button className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 transition-all">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </header>

      <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-900/5 border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="pb-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Harvest Customer</th>
                <th className="pb-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ingredients Found</th>
                <th className="pb-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Revenue</th>
                <th className="pb-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Date</th>
                <th className="pb-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sales.map((sale) => (
                <tr key={sale._id} className="group hover:bg-emerald-50/20 transition-all">
                  <td className="py-8">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-emerald-100">
                        {sale.customer?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-base font-black text-slate-900">{sale.customer?.name}</p>
                        <p className="text-xs font-bold text-slate-400 mt-1">{sale.customer?.phoneNumber || sale.customer?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-8">
                    <div className="space-y-1">
                      {sale.items.map((item, idx) => (
                        <p key={idx} className="text-sm font-bold text-slate-600">
                          {item.quantity}x {item.name || 'Produce Item'}
                        </p>
                      ))}
                    </div>
                  </td>
                  <td className="py-8">
                    <p className="text-xl font-black text-emerald-600">${sale.totalPrice}</p>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">Direct Profit</p>
                  </td>
                  <td className="py-8">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar className="w-4 h-4" />
                      <p className="text-sm font-bold">{new Date(sale.createdAt).toLocaleDateString()}</p>
                    </div>
                  </td>
                  <td className="py-8 text-right">
                    <button className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all transform scale-90 group-hover:scale-100">
                       <ChevronRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {sales.length === 0 && (
                <tr>
                   <td colSpan="5" className="py-32 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-30">
                        <ShoppingBag className="w-16 h-16" />
                        <p className="text-sm font-black uppercase tracking-widest">No customer purchases yet</p>
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

export default FarmerSales;
