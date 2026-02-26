import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  ArrowRight, 
  Leaf,
  Star,
  Truck
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const { data } = await api.get('/products');
        setFeaturedProducts(data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  return (
    <div className="space-y-0 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center pt-20 pb-32 overflow-hidden">
        {/* Farming Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')" }}
        />
        {/* Dark Gradient Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/70 to-emerald-900/50" />
        {/* Soft glow accents */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/20 text-emerald-300 rounded-lg text-xs font-black uppercase tracking-widest ring-1 ring-emerald-500/30 backdrop-blur-sm">
                <Leaf className="w-3.5 h-3.5 fill-current" />
                100% Organic & Fresh
              </div>
              <h1 
                className="text-6xl md:text-8xl font-black text-white leading-[1.05] tracking-tight drop-shadow-lg"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {user ? (
                  <>
                    Welcome Back, <br />
                    <span className="text-emerald-400">{user.name.split(' ')[0]}!</span>
                  </>
                ) : (
                  <>
                    Freshness <br />
                    <span className="text-emerald-400">Delivered.</span>
                  </>
                )}
              </h1>
              <p className="text-xl text-slate-200 max-w-lg leading-relaxed font-medium">
                Experience the finest selection of hand-picked fruits, vegetables, and daily essentials delivered fresh to your doorstep in Mogadishu.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  to="/products-store" 
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-emerald-900/30 flex items-center justify-center gap-3 transition-all active:scale-95 group"
                >
                  Shop Fresh Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="bg-white/10 backdrop-blur-md border-2 border-white/20 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/20 flex items-center justify-center gap-3 transition-all active:scale-95">
                  View Catalogue
                </button>
              </div>

              {/* Grocery Stats */}
              <div className="flex items-center gap-10 pt-8 border-t border-white/15">
                <div>
                  <p className="text-3xl font-black text-emerald-400">500+</p>
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Fresh Items</p>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <div>
                  <p className="text-3xl font-black text-emerald-400">1Hr</p>
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Fast Delivery</p>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <div>
                  <div className="flex gap-0.5 mb-1">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-current" />)}
                  </div>
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">4.9/5 Rating</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>


      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <div>
              <div className="">             
                Hand-Picked Selection
              </div>
            </div>
            <Link 
              to="/products-store" 
              className="text-slate-900 border-b-2 border-emerald-600 pb-1 font-black text-sm uppercase tracking-widest hover:text-emerald-600 transition-colors"
            >
              Browse Full Pantry
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-[2rem] border border-slate-100 p-4 h-[400px] animate-pulse">
                  <div className="w-full h-48 bg-slate-100 rounded-[1.5rem] mb-6" />
                  <div className="space-y-3 px-2">
                    <div className="w-2/3 h-4 bg-slate-100 rounded-full" />
                    <div className="w-full h-3 bg-slate-100 rounded-full" />
                    <div className="w-1/3 h-6 bg-slate-100 rounded-full pt-4" />
                  </div>
                </div>
              ))
            ) : (
              featuredProducts.map((product) => (
                <motion.div 
                  key={product._id}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-[2rem] border border-slate-100 p-4 shadow-sm hover:shadow-2xl hover:shadow-blue-600/5 transition-all group"
                >
                  <div className="relative aspect-square bg-emerald-50 rounded-[1.5rem] mb-6 overflow-hidden flex items-center justify-center">
                    {product.images && product.images[0] ? (
                      <img src={`http://localhost:5000${product.images[0]}`} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <Package className="w-16 h-16 text-emerald-200" />
                    )}
                    <div className="absolute inset-0 bg-emerald-600/0 group-hover:bg-emerald-600/5 transition-colors" />
                  </div>
                  <div className="px-2 space-y-2">
                    <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">{product.category?.name || 'In Stock'}</p>
                    <h3 className="text-lg font-black text-slate-900 truncate">{product.name}</h3>
                    <div className="flex items-center justify-between pt-4 pb-2">
                      <p className="text-2xl font-black text-slate-900">${product.price}</p>
                      <button 
                        onClick={() => {
                          if (!user) {
                            alert('Please login or register to add items to your cart.');
                            navigate('/login');
                            return;
                          }
                          addToCart(product);
                        }}
                        className="flex items-center gap-2 bg-slate-900 text-white p-3 rounded-xl hover:bg-emerald-600 transition-colors active:scale-95 shadow-lg shadow-slate-200 hover:shadow-emerald-200"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
