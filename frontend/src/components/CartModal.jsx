import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CartModal = () => {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    cartTotal,
    clearCart
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    if (!user) {
      alert('Please login or register to complete your purchase.');
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-3xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-emerald-50 flex items-center justify-between bg-emerald-50/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                  <Leaf className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Fresh Pantry</h2>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-0.5">
                    {cartItems.length} {cartItems.length === 1 ? 'Ingredient' : 'Ingredients'} selected
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {cartItems.length > 0 && (
                  <button 
                    onClick={clearCart}
                    className="text-[10px] font-black uppercase text-slate-400 hover:text-rose-500 transition-colors px-3 py-1"
                  >
                    Clear All
                  </button>
                )}
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2.5 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-emerald-100 text-slate-400 hover:text-emerald-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center text-emerald-200">
                    <ShoppingBag className="w-12 h-10" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-black text-slate-900">Your basket is empty</p>
                    <p className="text-sm font-medium text-slate-500 px-10">Start adding fresh local ingredients to your daily pantry!</p>
                  </div>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200"
                  >
                    Shop Fresh Now
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item._id} className="flex gap-5 group">
                    <div className="w-24 h-24 bg-emerald-50/50 rounded-[1.5rem] flex-shrink-0 overflow-hidden border border-emerald-50">
                      {item.images && item.images[0] ? (
                        <img 
                          src={`http://localhost:5000${item.images[0]}`} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                      ) : (
                        <Leaf className="w-8 h-8 m-auto mt-8 text-emerald-200" />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-black text-slate-900 leading-tight pr-4 text-base">{item.name}</h3>
                          <button 
                            onClick={() => removeFromCart(item._id)}
                            className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                          {item.category?.name || 'Daily Fresh'}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 bg-emerald-50/50 p-1 rounded-xl border border-emerald-50">
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center bg-white hover:bg-emerald-600 hover:text-white shadow-sm rounded-lg transition-all text-slate-600"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-sm font-black text-slate-900 min-w-[20px] text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-white hover:bg-emerald-600 hover:text-white shadow-sm rounded-lg transition-all text-slate-600"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="font-black text-slate-900 text-lg">${(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-8 bg-emerald-50/30 border-t border-emerald-50 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span className="text-slate-900 text-sm font-black">${cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>Delivery Fee</span>
                    <span className="text-emerald-600 italic">Freshness First</span>
                  </div>
                  <div className="pt-4 border-t border-emerald-100 flex justify-between items-center">
                    <span className="text-xl font-black text-slate-900 tracking-tight">Grand Total</span>
                    <span className="text-3xl font-black text-emerald-600 leading-none">${cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-2xl shadow-slate-200 active:scale-[0.98]"
                >
                  Checkout Safely
                  <ArrowRight className="w-5 h-5" />
                </button>
                
                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  <Leaf className="w-3 h-3 text-emerald-500 fill-current" />
                  100% Quality Guaranteed
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartModal;
