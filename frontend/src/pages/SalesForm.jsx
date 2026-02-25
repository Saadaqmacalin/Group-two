import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { 
  ArrowLeft, 
  Loader2, 
  Package,
  User,
  Hash,
  DollarSign,
  Save
} from 'lucide-react';

const SalesForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { quantity: 1 }
  });

  const selectedProductId = watch('product');
  const quantity = watch('quantity');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, custRes] = await Promise.all([
          api.get('/products'),
          api.get('/customers')
        ]);
        setProducts(prodRes.data);
        setCustomers(custRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      // Automatically calculate total based on selected product price
      const product = products.find(p => p._id === data.product);
      data.totalAmount = product ? product.price * data.quantity : 0;
      
      await api.post('/sales', data);
      navigate('/sales');
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
          onClick={() => navigate('/sales')}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Record Manual Sale</h1>
          <p className="text-slate-500 text-sm">Log an over-the-counter sale directly to the system.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block flex items-center gap-2">
              <Package className="w-4 h-4" /> Select Product
            </label>
            <select 
              {...register('product', { required: 'Product is required' })}
              className={`w-full px-4 py-2.5 border ${errors.product ? 'border-red-500' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`}
              disabled={dataLoading}
            >
              <option value="">{dataLoading ? 'Loading products...' : 'Select a product'}</option>
              {products.map(p => (
                <option key={p._id} value={p._id}>{p.name} - ${p.price} ({p.countInStock} in stock)</option>
              ))}
            </select>
            {errors.product && <p className="mt-1 text-xs text-red-500">{errors.product.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block flex items-center gap-2">
                <Hash className="w-4 h-4" /> Quantity
              </label>
              <input 
                type="number"
                {...register('quantity', { 
                  required: 'Quantity is required',
                  min: { value: 1, message: 'Minimum 1' }
                })}
                className={`w-full px-4 py-2.5 border ${errors.quantity ? 'border-red-500' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.quantity && <p className="mt-1 text-xs text-red-500">{errors.quantity.message}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block flex items-center gap-2">
                <User className="w-4 h-4" /> Customer (Optional)
              </label>
              <select 
                {...register('customer')}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                disabled={dataLoading}
              >
                <option value="">Guest Customer</option>
                {customers.map(c => (
                  <option key={c._id} value={c._id}>{c.name} ({c.phoneNumber})</option>
                ))}
              </select>
            </div>
          </div>

          {selectedProductId && (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex justify-between items-center">
              <span className="text-sm font-bold text-emerald-700">Calculated Total:</span>
              <span className="text-xl font-black text-emerald-800 flex items-center">
                <DollarSign className="w-5 h-5" />
                {(products.find(p => p._id === selectedProductId)?.price * (quantity || 0)).toFixed(2)}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Log Sale
          </button>
          <Link 
            to="/sales"
            className="px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SalesForm;
