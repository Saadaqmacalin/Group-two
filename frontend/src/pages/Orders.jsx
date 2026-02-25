import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Search, 
  Trash2, 
  ShoppingCart, 
  Loader2,
  AlertCircle,
  Eye,
  CheckCircle2,
  Clock,
  Package,
  XCircle,
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (err) {
      setError('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleUpdatePaymentStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { paymentStatus: newStatus });
      setOrders(orders.map(o => o._id === orderId ? { ...o, paymentStatus: newStatus } : o));
      if (selectedOrder?._id === orderId) {
        setSelectedOrder({ ...selectedOrder, paymentStatus: newStatus });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update payment status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await api.delete(`/orders/${id}`);
        setOrders(orders.filter(o => o._id !== id));
        if (selectedOrder?._id === id) setSelectedOrder(null);
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete order');
      }
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order._id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getPaymentStatusColor = (status) => {
    return status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
          <p className="text-slate-500 text-sm">Manage and track customer purchases.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by customer or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {['All', 'Pending', 'Processing', 'Delivered', 'Cancelled'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                  statusFilter === status 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-500 gap-3">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
              <p className="font-medium">Loading orders...</p>
            </div>
          ) : error ? (
            <div className="py-20 flex flex-col items-center justify-center text-red-500 gap-3">
              <AlertCircle className="w-10 h-10" />
              <p className="font-medium">{error}</p>
              <button onClick={fetchOrders} className="text-blue-600 underline text-sm">Try again</button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
              <ShoppingCart className="w-12 h-12 opacity-20" />
              <p className="font-medium">No orders found</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Order</th>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Total</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <AnimatePresence>
                  {filteredOrders.map((order) => (
                    <motion.tr 
                      key={order._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-mono text-xs font-bold text-blue-600">#{order._id.slice(-6).toUpperCase()}</span>
                          <span className="text-[10px] text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900">{order.customer?.name || 'Guest'}</span>
                          <span className="text-xs text-slate-500">{order.customer?.email || 'No email'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">${order.totalPrice?.toFixed(2)}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full inline-block w-fit ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg border focus:outline-none transition-all ${getStatusColor(order.status)}`}
                        >
                          {['Pending', 'Processing', 'Delivered', 'Cancelled'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 transition-opacity">
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(order._id)}
                            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Package className="w-6 h-6 text-blue-600" />
                    Order Details
                  </h2>
                  <p className="text-sm text-slate-500 font-mono uppercase tracking-widest mt-0.5">#{selectedOrder._id}</p>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-white rounded-full transition-colors shadow-sm"
                >
                  <XCircle className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-8">
                {/* Status Section */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Order Status</p>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status === 'Delivered' ? <CheckCircle2 className="w-5 h-5" /> : 
                         selectedOrder.status === 'Cancelled' ? <XCircle className="w-5 h-5" /> : 
                         selectedOrder.status === 'Processing' ? <Package className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                      </div>
                      <select 
                        value={selectedOrder.status}
                        onChange={(e) => handleUpdateStatus(selectedOrder._id, e.target.value)}
                        className="bg-transparent font-bold text-slate-900 border-none p-0 focus:ring-0 cursor-pointer"
                      >
                        {['Pending', 'Processing', 'Delivered', 'Cancelled'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Payment Status</p>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <select 
                        value={selectedOrder.paymentStatus}
                        onChange={(e) => handleUpdatePaymentStatus(selectedOrder._id, e.target.value)}
                        className="bg-transparent font-bold text-slate-900 border-none p-0 focus:ring-0 cursor-pointer"
                      >
                        {['Paid', 'Unpaid'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Shipping Information</h3>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-medium">Customer</span>
                      <span className="text-slate-900 font-bold">{selectedOrder.customer?.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-medium">Email</span>
                      <span className="text-slate-900 font-bold">{selectedOrder.customer?.email}</span>
                    </div>
                    <div className="flex flex-col gap-1 text-sm pt-2 border-t border-slate-200">
                      <span className="text-slate-500 font-medium uppercase text-[10px] tracking-widest">Address</span>
                      <span className="text-slate-700 leading-relaxed font-medium">{selectedOrder.shippingAddress}</span>
                    </div>
                  </div>
                </div>

                {/* Items Section */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Ordered Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.orderItems.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-blue-100 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 text-slate-400 font-bold">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{item.product?.name || 'Unknown Product'}</p>
                            <p className="text-xs text-slate-500">Qty: {item.quantity} × ${item.price?.toFixed(2)}</p>
                          </div>
                        </div>
                        <p className="font-bold text-blue-600">${(item.quantity * item.price).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total Section */}
                <div className="pt-6 border-t-2 border-dashed border-slate-100 flex justify-between items-end">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Amount</p>
                    <p className="text-3xl font-black text-slate-900">${selectedOrder.totalPrice?.toFixed(2)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className="text-[10px] text-slate-400">Order Placed On</p>
                    <p className="text-sm font-bold text-slate-700">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;
