import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  User, 
  Mail, 
  Phone, 
  Package, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  ShoppingBag,
  ArrowLeft,
  Settings,
  Shield,
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
      } catch (err) {
        setError('Failed to load your order history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-100 text-emerald-700 ring-emerald-200';
      case 'Processing': return 'bg-blue-100 text-blue-700 ring-blue-200';
      case 'Cancelled': return 'bg-rose-100 text-rose-700 ring-rose-200';
      default: return 'bg-amber-100 text-amber-700 ring-amber-200';
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Sidebar Info */}
          <div className="md:w-1/3 xl:w-1/4 space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-emerald-50 shadow-sm p-10 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-2 bg-emerald-600" />
              <div className="w-24 h-24 bg-emerald-50 rounded-3xl mx-auto flex items-center justify-center text-emerald-600 mb-6 shadow-inner ring-8 ring-emerald-50/50">
                <User className="w-12 h-12" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">{user.name}</h1>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{user.role}</p>
              
              <div className="mt-10 space-y-4 text-left">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Email</p>
                    <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                  </div>
                </div>
                {user.phoneNumber && (
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Contact</p>
                      <p className="text-sm font-bold text-slate-900">{user.phoneNumber}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-emerald-50 shadow-sm overflow-hidden divide-y divide-emerald-50">
              <button className="w-full px-8 py-5 flex items-center justify-between group hover:bg-emerald-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <Settings className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                  <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Account Settings</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </button>
              <button className="w-full px-8 py-5 flex items-center justify-between group hover:bg-emerald-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <Shield className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                  <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Security</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </button>
              <button className="w-full px-8 py-5 flex items-center justify-between group hover:bg-emerald-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <CreditCard className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                  <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Saved Addresses</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </button>
            </div>
          </div>

          {/* Main Content - Orders */}
          <div className="flex-1 space-y-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Your Pantry History</h2>
                <p className="text-slate-500 font-medium text-lg mt-2 font-['Inter']">Review all your fresh deliveries and transactions.</p>
              </div>
              <div className="hidden sm:block">
                <span className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-200">
                  {orders.length} Deliveries
                </span>
              </div>
            </div>

            {loading ? (
              <div className="py-32 flex flex-col items-center justify-center gap-4 text-slate-400">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <p className="font-black uppercase tracking-widest text-xs">Fetching your history...</p>
              </div>
            ) : error ? (
              <div className="py-20 bg-rose-50 rounded-[3rem] border border-rose-100 text-center flex flex-col items-center gap-4">
                <AlertCircle className="w-12 h-12 text-rose-500" />
                <p className="text-rose-600 font-black uppercase tracking-widest text-sm">{error}</p>
                <button onClick={() => window.location.reload()} className="px-8 py-3 bg-white text-rose-600 rounded-xl font-black text-xs uppercase tracking-widest border border-rose-200 hover:bg-rose-100 transition-all">Try Again</button>
              </div>
            ) : orders.length === 0 ? (
              <div className="py-32 bg-white rounded-[3rem] border border-emerald-50 text-center flex flex-col items-center gap-8 shadow-sm">
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-200 mb-2">
                  <ShoppingBag className="w-12 h-12" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Your History is Fresh!</h3>
                  <p className="text-slate-500 font-medium max-w-xs mx-auto">You haven't ordered any fresh produce yet. Let's get something from the farm!</p>
                </div>
                <Link to="/products-store" className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 active:scale-95 flex items-center gap-3">
                  Browse Store
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence>
                  {orders.map((order, idx) => (
                    <motion.div 
                      key={order._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white rounded-[2.5rem] border border-emerald-50 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-emerald-900/5 transition-all group"
                    >
                      <div className="p-8 sm:p-10 flex flex-col lg:flex-row gap-8">
                        {/* Order Header Info */}
                        <div className="lg:w-1/3 xl:w-1/4 space-y-6">
                          <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</p>
                            <p className="text-sm font-black text-slate-900 font-mono tracking-tighter">#{order._id.slice(-8).toUpperCase()}</p>
                          </div>
                          
                          <div className="flex flex-wrap gap-3">
                            <div className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ring-1 ${getStatusColor(order.status)}`}>
                              {order.status}
                            </div>
                            <div className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ring-1 ${order.paymentStatus === 'Paid' ? 'bg-indigo-100 text-indigo-700 ring-indigo-200' : 'bg-slate-100 text-slate-700 ring-slate-100'}`}>
                              {order.paymentStatus}
                            </div>
                          </div>

                          <div className="flex gap-10">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Placed On</p>
                                <div className="flex items-center gap-2 text-slate-600 font-bold text-xs uppercase tracking-widest">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
                                <p className="text-xl font-black text-emerald-600 leading-none">${order.totalPrice.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="flex-1 lg:pl-8 lg:border-l border-emerald-50">
                          <div className="space-y-4">
                            {order.orderItems.map((item, i) => (
                              <div key={i} className="flex items-center gap-5 group/item">
                                <div className="w-16 h-16 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 group-hover/item:border-emerald-200 transition-colors">
                                  {item.product?.images?.[0] ? (
                                    <img src={`http://localhost:5000${item.product.images[0]}`} alt={item.product.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <Package className="w-8 h-8 m-auto mt-4 text-emerald-200" />
                                  )}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                  <p className="text-sm font-black text-slate-900 truncate leading-none mb-1.5">{item.product?.name || 'Unknown Item'}</p>
                                  <div className="flex justify-between items-baseline">
                                    <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest">{item.quantity} x ${item.price}</p>
                                    <p className="text-sm font-black text-slate-900">${(item.quantity * item.price).toLocaleString()}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
