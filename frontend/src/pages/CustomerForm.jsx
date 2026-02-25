import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { 
  ArrowLeft, 
  Loader2, 
  User,
  Mail,
  Phone,
  Home,
  MapPin,
  Save
} from 'lucide-react';
import { motion } from 'framer-motion';

const CustomerForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    if (isEdit) {
      const fetchCustomer = async () => {
        try {
          const { data } = await api.get(`/customers/${id}`);
          setValue('name', data.name);
          setValue('email', data.email);
          setValue('phoneNumber', data.phoneNumber);
          setValue('address', data.address);
          setValue('city', data.city);
        } catch (err) {
          console.error(err);
          alert('Failed to load customer');
        } finally {
          setInitialLoading(false);
        }
      };
      fetchCustomer();
    }
  }, [id, isEdit, setValue]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      if (isEdit) {
        await api.put(`/customers/${id}`, data);
      } else {
        await api.post('/customers', data);
      }
      
      navigate('/customers');
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/customers')}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{isEdit ? 'Edit Customer' : 'Add New Customer'}</h1>
          <p className="text-slate-500 text-sm">Fill in the details for the customer record.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block flex items-center gap-2">
                <User className="w-4 h-4" /> Full Name
              </label>
              <input 
                {...register('name', { required: 'Name is required' })}
                placeholder="Ex: John Doe"
                className={`w-full px-4 py-2.5 border ${errors.name ? 'border-red-500' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email Address
              </label>
              <input 
                {...register('email', { 
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                })}
                placeholder="email@example.com"
                className={`w-full px-4 py-2.5 border ${errors.email ? 'border-red-500' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block flex items-center gap-2">
                <Phone className="w-4 h-4" /> Phone Number
              </label>
              <input 
                {...register('phoneNumber', { required: 'Phone number is required' })}
                placeholder="Ex: +1234567890"
                className={`w-full px-4 py-2.5 border ${errors.phoneNumber ? 'border-red-500' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.phoneNumber && <p className="mt-1 text-xs text-red-500">{errors.phoneNumber.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block flex items-center gap-2">
                <Home className="w-4 h-4" /> Address
              </label>
              <input 
                {...register('address', { required: 'Address is required' })}
                placeholder="Street address, Apartment, etc."
                className={`w-full px-4 py-2.5 border ${errors.address ? 'border-red-500' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block flex items-center gap-2">
                <MapPin className="w-4 h-4" /> City
              </label>
              <input 
                {...register('city', { required: 'City is required' })}
                placeholder="Ex: Mogadishu, London, etc."
                className={`w-full px-4 py-2.5 border ${errors.city ? 'border-red-500' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>}
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
            {isEdit ? 'Update Customer' : 'Add Customer'}
          </button>
          <Link 
            to="/customers"
            className="px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;
