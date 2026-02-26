import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { 
  ChevronLeft, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  User, 
  Mail,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Leaf
} from 'lucide-react';
import { motion } from 'framer-motion';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    address: '',
    city: '',
    paymentMethod: 'EVC Plus'
  });

  const paymentMethods = [
    { id: 'EVC Plus', name: 'EVC Plus (Hormuud)', description: 'Fast and secure mobile payment' },
    { id: 'eDahab', name: 'eDahab (Somtel)', description: 'Reliable mobile wallet transfer' },
    { id: 'Sahal', name: 'Sahal (Golis)', description: 'Puntland region mobile payment' }
  ];

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  if (cartItems.length === 0 && !success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-emerald-50">
        <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center text-emerald-200 shadow-xl shadow-emerald-100 mb-8 border border-emerald-50">
          <Leaf className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Your basket is empty</h2>
        <p className="text-slate-500 font-medium mb-10 text-center max-w-xs">Add some fresh ingredients before checking out to experience FreshMart.</p>
        <Link to="/products-store" className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 active:scale-95">
          Order Fresh Now
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Create/Find Customer
      const { data: customerData } = await api.post('/customers', {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        city: formData.city
      });

      // 2. Create Order
      const orderData = {
        customer: customerData._id,
        orderItems: cartItems.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: `${formData.address}, ${formData.city}`,
        totalPrice: cartTotal,
        paymentMethod: formData.paymentMethod,
        status: 'Processing',
        paymentStatus: 'Paid'
      };

      const { data: savedOrder } = await api.post('/orders', orderData);
      
      setOrderResult(savedOrder);
      setSuccess(true);
      clearCart();
      
      // Remove auto redirect to allow receipt viewing
      // setTimeout(() => {
      //   navigate('/');
      // }, 5000);

    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.message || 'Failed to process order. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  if (success && orderResult) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 pb-20 print:p-0 print:pt-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3.5rem] border border-emerald-50 shadow-2xl shadow-emerald-100 overflow-hidden print:shadow-none print:border-none print:rounded-none"
          >
            {/* Receipt Header */}
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-500 p-12 text-white text-center relative overflow-hidden print:bg-none print:text-slate-900 print:p-8">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] -mr-32 -mt-32" />
              <div className="relative z-10 space-y-4">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl print:hidden">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-black tracking-tight uppercase print:text-2xl">Purchase Receipt</h1>
                <p className="text-emerald-50/80 font-bold uppercase tracking-[0.2em] text-xs">FreshMart Daily Pantry</p>
              </div>
            </div>

            {/* Receipt Content */}
            <div className="p-12 space-y-12 print:p-8 print:space-y-8">
              {/* Order Meta */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-100 print:gap-4 print:pb-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</p>
                  <p className="font-black text-slate-900 text-sm">#{orderResult._id?.slice(-8).toUpperCase()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                  <p className="font-black text-slate-900 text-sm">{new Date(orderResult.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time</p>
                  <p className="font-black text-slate-900 text-sm">{new Date(orderResult.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment</p>
                  <p className="font-black text-emerald-600 text-sm">{orderResult.paymentMethod}</p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-8">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                  <Leaf className="w-5 h-5 text-emerald-500" />
                  Itemized Basket
                </h3>
                <div className="space-y-6">
                  {orderResult.orderItems?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-6 group">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl border border-slate-100 flex-shrink-0 overflow-hidden">
                        {item.product?.images?.[0] ? (
                          <img 
                            src={`http://localhost:5000${item.product.images[0]}`} 
                            alt={item.product?.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-200">
                            <Leaf className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-slate-900 text-sm truncate">{item.product?.name || 'Fresh Item'}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Qty: {item.quantity} × ${item.price?.toLocaleString()}</p>
                      </div>
                      <p className="font-black text-slate-900 text-base">${(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-slate-50 p-10 rounded-[2.5rem] space-y-4 print:bg-none print:p-0 print:border-t print:pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Gross Total</span>
                  <span className="font-black text-slate-900">${orderResult.totalPrice?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-emerald-600">
                  <span className="text-xs font-black uppercase tracking-widest">Delivery Fee</span>
                  <span className="font-black text-sm uppercase">Complimentary</span>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-base font-black text-slate-900 uppercase tracking-tighter">Amount Paid</span>
                  <span className="text-3xl font-black text-emerald-600 leading-none">${orderResult.totalPrice?.toLocaleString()}</span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between gap-8 print:flex-row">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Delivered To</p>
                  <p className="font-black text-slate-900 text-sm leading-tight max-w-[200px]">
                    {orderResult.customer?.name}<br />
                    {orderResult.shippingAddress}
                  </p>
                </div>
                <div className="md:text-right print:text-right">
                  <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest mb-2">Merchant Guarantee</p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-xl text-emerald-700 text-[10px] font-black uppercase tracking-widest ring-1 ring-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Freshness
                  </div>
                </div>
              </div>
            </div>

            {/* Receipt Footer Actions */}
            <div className="p-10 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row gap-4 print:hidden">
              <button 
                onClick={() => window.print()}
                className="flex-1 py-5 bg-white border-2 border-slate-200 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm"
              >
                Save Receipt
              </button>
              <Link 
                to="/" 
                className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-lg"
              >
                Back to Pantry
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
          
          <div className="mt-10 text-center space-y-2 print:hidden">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Thank you for shopping at FreshMart</p>
            <p className="text-[10px] font-black text-slate-300">Sustainable Produce • Fair Farmer Pricing • Direct Delivery</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/products-store" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-bold text-xs uppercase tracking-widest mb-10 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Back to Pantry
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-baseline gap-4 mb-12">
            <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-emerald-800 to-emerald-600 tracking-tight">Final Check</h1>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-xs font-black uppercase tracking-widest ring-1 ring-emerald-200">
                <CheckCircle2 className="w-4 h-4" />
                Safe & Secure Gateway
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Shipping Information */}
              <div className="bg-white p-10 rounded-[3rem] border border-emerald-50 shadow-sm space-y-10">
                <div className="flex items-center gap-4 border-b border-emerald-50 pb-8">
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 ring-8 ring-emerald-50/50 shadow-inner">
                    <Truck className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 leading-none">Freshness Delivery</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1.5">Where should we deliver your ingredients?</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-300" />
                      <input 
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Ahmed Ali"
                        className="w-full pl-11 pr-4 py-4 bg-emerald-50/30 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-emerald-500 focus:outline-none transition-all font-bold text-slate-900 shadow-inner"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-300" />
                      <input 
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="ahmed@freshmart.so"
                        className="w-full pl-11 pr-4 py-4 bg-emerald-50/30 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-emerald-500 focus:outline-none transition-all font-bold text-slate-900 shadow-inner"
                      />
                    </div>
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <label className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest ml-1">Phone Number (Required for EVC)</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-300" />
                      <input 
                        required
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                        placeholder="+252 61..."
                        className="w-full pl-11 pr-4 py-4 bg-emerald-50/30 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-emerald-500 focus:outline-none transition-all font-bold text-slate-900 shadow-inner"
                      />
                    </div>
                  </div>
                  <div className="space-y-3 md:col-span-1">
                    <label className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest ml-1">City</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-300" />
                      <input 
                        required
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        placeholder="Mogadishu"
                        className="w-full pl-11 pr-4 py-4 bg-emerald-50/30 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-emerald-500 focus:outline-none transition-all font-bold text-slate-900 shadow-inner"
                      />
                    </div>
                  </div>
                  <div className="space-y-3 md:col-span-1">
                    <label className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest ml-1">Detailed Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-300" />
                      <input 
                        required
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        placeholder="Wayab, Wadajir District"
                        className="w-full pl-11 pr-4 py-4 bg-emerald-50/30 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-emerald-500 focus:outline-none transition-all font-bold text-slate-900 shadow-inner"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white p-10 rounded-[3rem] border border-emerald-50 shadow-sm space-y-10">
                <div className="flex items-center gap-4 border-b border-emerald-50 pb-8">
                  <div className="w-15 h-15 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white ring-8 ring-emerald-50 shadow-xl shadow-emerald-100">
                    <CreditCard className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 leading-none">Payment Way</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1.5">Trusted Somalian mobile wallets</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paymentMethods.map((method) => (
                    <div 
                      key={method.id}
                      onClick={() => setFormData({...formData, paymentMethod: method.id})}
                      className={`cursor-pointer p-8 rounded-[2.5rem] border-2 transition-all flex items-center justify-between group relative overflow-hidden ${
                        formData.paymentMethod === method.id 
                        ? 'border-transparent bg-gradient-to-br from-emerald-600 to-emerald-500 text-white shadow-2xl shadow-emerald-200 scale-[1.02]' 
                        : 'border-slate-100 hover:border-emerald-200 bg-white hover:bg-emerald-50/10'
                      }`}
                    >
                      {/* Decorative elements for selected state */}
                      {formData.paymentMethod === method.id && (
                        <>
                          <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 blur-[50px] -mr-16 -mt-16 animate-pulse" />
                          <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-400/20 blur-3xl -ml-10 -mb-10" />
                        </>
                      )}

                      <div className="flex items-center gap-6 relative z-10">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                          formData.paymentMethod === method.id ? 'border-white bg-white/20' : 'border-slate-200 group-hover:border-emerald-300'
                        }`}>
                          {formData.paymentMethod === method.id && <div className="w-4 h-4 bg-white rounded-full shadow-lg" />}
                        </div>
                        <div>
                          <p className={`font-black text-lg leading-none mb-2 transition-colors ${
                            formData.paymentMethod === method.id ? 'text-white' : 'text-slate-900'
                          }`}>{method.name}</p>
                          <p className={`text-[11px] font-bold uppercase tracking-wide transition-colors ${
                            formData.paymentMethod === method.id ? 'text-emerald-50/80' : 'text-slate-400'
                          }`}>{method.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-8 bg-emerald-50/30 rounded-[2rem] border border-emerald-100 flex items-center gap-6">
                  <ShieldCheck className="w-12 h-12 text-emerald-500 shrink-0" />
                  <p className="text-xs text-slate-500 font-bold leading-relaxed">
                    FreshMart uses end-to-end encryption for all mobile money transactions. Your secure payment is our highest priority in Mogadishu.
                  </p>
                </div>
              </div>

              {error && (
                <div className="p-5 bg-rose-50 text-rose-600 rounded-2xl text-sm font-black border border-rose-100 text-center uppercase tracking-widest">
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-7 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-[2.5rem] font-black uppercase tracking-widest text-xl flex items-center justify-center gap-4 hover:from-emerald-600 hover:to-emerald-500 transition-all shadow-2xl shadow-slate-200 active:scale-[0.98] group"
              >
                {loading ? <Loader2 className="w-7 h-7 animate-spin" /> : (
                    <>
                        Place Fresh Order
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
              </button>
            </form>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[3rem] border border-emerald-50 shadow-sm sticky top-32 space-y-10">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Daily Pantry</h2>
              
              <div className="space-y-8 max-h-[45vh] overflow-y-auto px-1 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-5">
                    <div className="w-20 h-20 bg-emerald-50/50 rounded-2xl border border-emerald-50 flex-shrink-0 overflow-hidden">
                      {item.images?.[0] ? (
                        <img src={`http://localhost:5000${item.images[0]}`} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <Leaf className="w-8 h-8 m-auto mt-6 text-emerald-200" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1.5 flex flex-col justify-center">
                      <p className="font-black text-slate-900 text-sm line-clamp-1 leading-none">{item.name}</p>
                      <div className="flex justify-between items-end">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Qty: {item.quantity}</p>
                        <p className="text-base font-black text-slate-900">${(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-emerald-50 space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span>Merchant Total</span>
                  <span className="text-slate-900 text-sm font-black">${cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span>Fresh Delivery</span>
                  <span className="text-emerald-500 font-black">Free Today</span>
                </div>
                <div className="pt-6 border-t border-emerald-100 flex justify-between items-center">
                  <span className="text-lg font-black text-slate-900 uppercase">Total Cost</span>
                  <span className="text-3xl font-black text-emerald-600 leading-none">${cartTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 text-center space-y-2">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">100% Satisfaction</p>
                <p className="text-xs text-slate-600 font-bold">Hand-picked fresh everyday</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
