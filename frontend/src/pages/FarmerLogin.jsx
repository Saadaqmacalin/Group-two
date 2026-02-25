import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useFarmerAuth } from '../context/FarmerAuthContext';
import { Mail, Lock, Loader2, AlertCircle, Sprout } from 'lucide-react';
import { motion } from 'framer-motion';

const FarmerLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { loginFarmer } = useFarmerAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      await loginFarmer(data.email, data.password);
      navigate('/farmer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-50 px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden"
      >
        {/* Header */}
        <div className="px-8 pt-10 pb-6 text-center border-b border-emerald-100">
          <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-xl shadow-emerald-200">
            <Sprout className="text-white w-11 h-11" />
          </div>

          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Farmer Portal
          </h2>
          <p className="mt-2 text-sm font-semibold text-emerald-600 tracking-wide">
            Welcome back to FreshMart
          </p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 bg-rose-50 border border-rose-200 p-4 flex items-center gap-3 text-rose-700 rounded-xl">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-semibold">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500" />
                <input
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                      message: 'Invalid email address'
                    }
                  })}
                  className={`w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border ${
                    errors.email ? 'border-rose-400' : 'border-slate-200'
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-900 font-semibold`}
                  placeholder="ahmed@farm.so"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-xs text-rose-500 font-semibold ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500" />
                <input
                  type="password"
                  {...register('password', { required: 'Password is required' })}
                  className={`w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border ${
                    errors.password ? 'border-rose-400' : 'border-slate-200'
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-900 font-semibold`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-2 text-xs text-rose-500 font-semibold ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-slate-900 to-emerald-600 text-white font-bold tracking-wide shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="animate-spin h-6 w-6" />
              ) : (
                'Enter Dashboard'
              )}
            </button>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                New Producer?{' '}
                <Link
                  to="/farmer/register"
                  className="text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Apply to Join
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default FarmerLogin;