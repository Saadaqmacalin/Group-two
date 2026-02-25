import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2, AlertCircle, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const user = await login(data.email, data.password);
      setSuccess(true);
      setTimeout(() => {
        if (user.role === 'admin' || user.role === 'staff') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100"
      >
        <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-100 mx-auto mb-6">
                <Leaf className="text-white w-10 h-10" />
            </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-3 text-sm font-bold text-emerald-600 uppercase tracking-widest">
            FreshMart Member Sign In
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
            <p className="text-sm font-black uppercase tracking-tight">Login Successful! Welcome back.</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="relative">
              <label className="text-sm font-medium text-slate-700 mb-1 block">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  {...register('email', { 
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
              <label className="text-sm font-medium text-slate-700 mb-1 block">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  {...register('password', { required: 'Password is required' })}
                  className={`block w-full pl-10 pr-3 py-3 bg-emerald-50/30 border-2 ${errors.password ? 'border-rose-500' : 'border-transparent'} rounded-xl focus:outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-slate-900 shadow-inner`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500 font-medium">{errors.password.message}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || success}
              className="group relative w-full flex justify-center py-5 px-4 border border-transparent font-black uppercase tracking-widest rounded-2xl text-white bg-slate-900 hover:bg-emerald-600 focus:outline-none transition-all shadow-2xl shadow-slate-200 active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="animate-spin h-6 w-6 text-white" />
              ) : success ? (
                'Identity Verified...'
              ) : (
                'Sign In'
              )}
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Don't have an account?{' '}
              <Link to="/register" className="text-emerald-600 hover:text-emerald-700 transition-colors border-b-2 border-emerald-500/0 hover:border-emerald-500/100 pb-0.5">
                Start Fresh Today
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;