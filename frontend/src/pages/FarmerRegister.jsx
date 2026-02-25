import React, { useState } from 'react'; 
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useFarmerAuth } from '../context/FarmerAuthContext';
import { Mail, Lock, User, Phone, Loader2, AlertCircle, Sprout, MapPin, Tractor } from 'lucide-react';
import { motion } from 'framer-motion';

const FarmerRegister = () => {
  const { register: registerField, handleSubmit, formState: { errors } } = useForm();
  const { registerFarmer } = useFarmerAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      await registerFarmer(data);
      navigate('/farmer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-50 px-4 py-10">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden"
      >
        {/* Header */}
        <div className="text-center px-8 pt-10 pb-6 border-b border-emerald-100">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
            <Sprout className="w-9 h-9 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Join as a Farmer
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Register your farm and start selling your products
          </p>
        </div>

        <div className="p-8 md:p-10">
          {error && (
            <div className="mb-6 bg-rose-50 border border-rose-200 p-4 flex items-center gap-3 text-rose-700 rounded-xl">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-semibold">{error}</p>
            </div>
          )}

          <form 
            className="flex flex-col min-h-[520px]"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
              
              {/* Personal Info */}
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                  Personal Information
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                    <input
                      {...registerField('name', { required: 'Name is required' })}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border ${
                        errors.name ? 'border-rose-400' : 'border-slate-200'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition`}
                      placeholder="Ahmed Ali"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                    <input
                      {...registerField('email', { required: 'Email is required' })}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border ${
                        errors.email ? 'border-rose-400' : 'border-slate-200'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition`}
                      placeholder="ahmed@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                    <input
                      {...registerField('phoneNumber', { required: 'Phone is required' })}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border ${
                        errors.phoneNumber ? 'border-rose-400' : 'border-slate-200'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition`}
                      placeholder="+252 ..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                    <input
                      type="password"
                      {...registerField('password', { required: 'Password is required' })}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border ${
                        errors.password ? 'border-rose-400' : 'border-slate-200'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition`}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              {/* Farm Details */}
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                  Farm Details
                </h3>


                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    City / Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                    <input
                      {...registerField('location', { required: 'Location is required' })}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border ${
                        errors.location ? 'border-rose-400' : 'border-slate-200'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition`}
                      placeholder="Mogadishu, Somalia"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    About your farm
                  </label>
                  <textarea
                    {...registerField('bio')}
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition resize-none text-sm"
                    placeholder="Describe what you grow, farm size, experience..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Button - Fixed at Bottom */}
            <div className="mt-10 pt-6 border-t border-slate-100">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-slate-900 to-emerald-600 text-white font-bold tracking-wide shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  'Submit Application'
                )}
              </button>

              <p className="text-center text-xs text-slate-500 mt-6 font-semibold">
                Already registered?{' '}
                <Link
                  to="/farmer/login"
                  className="text-emerald-600 hover:text-emerald-700 transition"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default FarmerRegister;