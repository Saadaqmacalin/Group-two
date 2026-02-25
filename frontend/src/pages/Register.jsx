import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Phone, Loader2, AlertCircle, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const { register: registerField, handleSubmit, formState: { errors } } = useForm();
  const { register: registerUser } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      const user = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber || undefined,
        role: 'customer' // Default role
      });
      setSuccess(true);
      setTimeout(() => {
        if (user.role === 'admin' || user.role === 'staff') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100"
      >
        <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-100 mx-auto mb-6">
                <Leaf className="text-white w-10 h-10" />
            </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            Join FreshMart
          </h2>
          <p className="mt-3 text-sm font-bold text-emerald-600 uppercase tracking-widest">
            Unlock premium local ingredients
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border-l-4 border-rose-500 p-4 flex items-center gap-3 text-rose-700 rounded-r-md">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-black uppercase tracking-tight">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 flex items-center gap-3 text-emerald-700 rounded-r-md">
            <Leaf className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-black uppercase tracking-tight">Account Created! Welcome to FreshMart.</p>
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="relative">
              <label className="text-sm font-medium text-slate-700 mb-1 block">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  {...registerField('name', { required: 'Name is required' })}
                  className={`block w-full pl-10 pr-3 py-3 bg-emerald-50/30 border-2 ${errors.name ? 'border-rose-500' : 'border-transparent'} rounded-xl focus:outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-slate-900 shadow-inner`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-500 font-medium">{errors.name.message}</p>}
            </div>

            <div className="relative">
              <label className="text-sm font-medium text-slate-700 mb-1 block">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  {...registerField('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                      message: 'Invalid email address'
                    }
                  })}
                  className={`block w-full pl-10 pr-3 py-3 bg-emerald-50/30 border-2 ${errors.email ? 'border-rose-500' : 'border-transparent'} rounded-xl focus:outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-slate-900 shadow-inner`}
                  placeholder="name@freshmart.so"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email.message}</p>}
            </div>

            <div className="relative">
              <label className="text-sm font-medium text-slate-700 mb-1 block">Phone Number (Optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  {...registerField('phoneNumber')}
                  className="block w-full pl-10 pr-3 py-3 bg-emerald-50/30 border-2 border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-slate-900 shadow-inner"
                  placeholder="+252 61..."
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-sm font-medium text-slate-700 mb-1 block">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  {...registerField('password', { 
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                  className={`block w-full pl-10 pr-3 py-3 bg-emerald-50/30 border-2 ${errors.password ? 'border-rose-500' : 'border-transparent'} rounded-xl focus:outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-slate-900 shadow-inner`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500 font-medium">{errors.password.message}</p>}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || success}
              className="group relative w-full flex justify-center py-5 px-4 border border-transparent font-black uppercase tracking-widest rounded-2xl text-white bg-slate-900 hover:bg-emerald-600 focus:outline-none transition-all shadow-2xl shadow-slate-200 active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="animate-spin h-6 w-6 text-white" />
              ) : success ? (
                'Account Secured...'
              ) : (
                'Create Fresh Account'
              )}
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-600 hover:text-emerald-700 transition-colors border-b-2 border-emerald-500/0 hover:border-emerald-500/100 pb-0.5">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
