import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { 
  ArrowLeft, 
  Loader2, 
  CreditCard,
  Hash,
  ShoppingBag,
  DollarSign,
  Save
} from 'lucide-react';

const PaymentForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await api.post('/payments', data);
      navigate('/payments');
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/payments')}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Log Payment</h1>
          <p className="text-slate-500 text-sm">Manually record a payment for an existing order.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" /> Select Order
            </label>
            <select 
              {...register('order', { required: 'Order is required' })}
              className={`w-full px-4 py-2.5 border ${errors.order ? 'border-red-500' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`}
              disabled={ordersLoading}
            >
              <option value="">{ordersLoading ? 'Loading orders...' : 'Select an order'}</option>
              {orders.map(order => (
                <option key={order._id} value={order._id}>
                  #{order._id.slice(-6).toUpperCase()} - {order.customer?.name} (${order.totalPrice})
                </option>
              ))}
            </select>
            {errors.order && <p className="mt-1 text-xs text-red-500">{errors.order.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Amount
              </label>
              <input 
                type="number"
                step="0.01"
                {...register('amount', { required: 'Amount is required' })}
                placeholder="0.00"
                className={`w-full px-4 py-2.5 border ${errors.amount ? 'border-red-500' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount.message}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Payment Method
              </label>
              <select 
                {...register('paymentMethod', { required: 'Method is required' })}
                className={`w-full px-4 py-2.5 border ${errors.paymentMethod ? 'border-red-500' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`}
              >
                <option value="evcPlus">EVC Plus</option>
                <option value="eDahab">eDahab</option>
                <option value="premierWallet">Premier Wallet</option>
                <option value="waafi">Waafi</option>
                <option value="bankTransaction">Bank Transfer</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block flex items-center gap-2">
                <Hash className="w-4 h-4" /> Transaction ID
              </label>
              <input 
                {...register('transactionId')}
                placeholder="Ex: TRANS-12345"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block flex items-center gap-2">
                Status
              </label>
              <select 
                {...register('status')}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Failed">Failed</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Record Payment
          </button>
          <Link 
            to="/payments"
            className="px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
