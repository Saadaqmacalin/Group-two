import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Package, 
  Loader2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Leaf
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const StoreProducts = () => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories')
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
      } catch (error) {
        console.error('Error fetching storefront data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || 
                            product.category?._id === selectedCategory || 
                            product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0; // default order
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + productsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

  return (
    <div className="bg-white min-h-screen">
      {/* Header Area */}
      <div className="bg-emerald-50 pt-32 pb-20 border-b border-emerald-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="space-y-4">
              <nav className="flex items-center gap-2 text-xs font-bold text-emerald-600/60 uppercase tracking-widest">
                <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-emerald-900">Fresh Produce</span>
              </nav>
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">Our <span className="text-emerald-600">Pantry</span></h1>
              <p className="text-slate-500 font-medium max-w-md">Discover the freshest ingredients sourced daily for your kitchen.</p>
            </div>
            {/* Search Bar */}
            <div className="w-full md:w-96 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
              <input 
                type="text"
                placeholder="Find fresh ingredients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white border-2 border-emerald-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-900 shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
          <button 
            onClick={() => setSelectedCategory('All')}
            className={`flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
              selectedCategory === 'All' 
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
              : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button 
              key={cat._id}
              onClick={() => setSelectedCategory(cat._id)}
              className={`flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat._id 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Product Grid */}
          <div>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
                <p className="font-bold tracking-widest uppercase text-xs text-emerald-600/40">Restocking Pantry...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-6 bg-emerald-50/30 rounded-[3rem] border-2 border-dashed border-emerald-100">
                <Package className="w-16 h-16 opacity-20 text-emerald-600" />
                <div className="text-center space-y-2">
                  <p className="text-xl font-black text-slate-900">Ingredient not found</p>
                  <p className="font-medium text-slate-500">Try choosing a different category or refining your search.</p>
                </div>
                <button 
                  onClick={() => {setSearchTerm(''); setSelectedCategory('All')}}
                  className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-slate-200"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-100">
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-tighter">
                    Showing <span className="text-emerald-600 underline underline-offset-4">{paginatedProducts.length}</span> of {filteredProducts.length} Fresh Items
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sort by:</span>
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-transparent text-sm font-bold text-slate-900 focus:outline-none cursor-pointer"
                    >
                      <option value="default">Default</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="name">Name: A to Z</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
                  <AnimatePresence>
                    {paginatedProducts.map((product) => (
                      <motion.div 
                        key={product._id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        whileHover={{ y: -10 }}
                        className="bg-white rounded-[2.5rem] border border-emerald-50 p-4 shadow-sm hover:shadow-2xl hover:shadow-emerald-600/5 transition-all group"
                      >
                        <div className="relative aspect-square bg-emerald-50/50 rounded-[2rem] mb-6 overflow-hidden flex items-center justify-center">
                          {product.images && product.images[0] ? (
                            <img src={`http://localhost:5000${product.images[0]}`} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          ) : (
                            <Package className="w-16 h-16 text-emerald-200" />
                          )}
                          {!product.countInStock && (
                            <div className="absolute top-4 left-4 px-3 py-1 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg">
                              Sold Out
                            </div>
                          )}
                          <div className="absolute inset-0 bg-emerald-600/0 group-hover:bg-emerald-600/5 transition-colors" />
                        </div>
                        <div className="px-2 space-y-2">
                          <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">{product.category?.name || 'Daily Fresh'}</p>
                          <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-600 transition-colors truncate">{product.name}</h3>
                          <p className="text-xs text-slate-400 font-medium line-clamp-2 leading-relaxed">{product.description}</p>
                          <div className="flex items-center justify-between pt-6 pb-2">
                             <div className="flex flex-col">
                                <p className="text-2xl font-black text-slate-900">${product.price}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Availability: {product.countInStock} Units</p>
                             </div>
                            <button 
                              onClick={() => {
                                if (!user) {
                                  alert('Please login or register to add items to your cart.');
                                  navigate('/login');
                                  return;
                                }
                                addToCart(product);
                              }}
                              className="flex items-center gap-2 bg-slate-900 text-white p-3 rounded-xl hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-slate-200 hover:shadow-emerald-200"
                            >
                              <ShoppingBag className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-16 pt-10 border-t border-slate-100">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 px-5 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-11 h-11 rounded-xl text-sm font-black transition-all ${
                          currentPage === page
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 px-5 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
      </div>
    </div>
  );
};

export default StoreProducts;
