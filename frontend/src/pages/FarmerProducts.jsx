import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Loader2,
  AlertCircle,
  Sprout,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useFarmerAuth } from '../context/FarmerAuthContext';

const FarmerProducts = () => {
  const { farmer } = useFarmerAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    countInStock: '',
    images: [] // Explicitly empty to force local file selection
  });

  useEffect(() => {
    fetchData();
  }, []);

  // Re-fetch categories when adding to ensure we have the latest list
  useEffect(() => {
    if (isAdding) {
      fetchCategories();
    }
  }, [isAdding]);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (error) {
      console.error('Fetch categories error:', error);
    }
  };

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/farmers/products'),
        api.get('/categories')
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);
      const { data } = await api.post('/farmers/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFormData((prev) => ({ ...prev, images: [data.url] }));
    } catch (error) {
      alert('Image upload failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      setLoading(true);
      const { data } = await api.post('/farmers/categories', { name: newCategoryName });
      setCategories(prev => [...prev, data]);
      setFormData(prev => ({ ...prev, category: data._id }));
      setIsAddingCategory(false);
      setNewCategoryName('');
    } catch (error) {
      alert('Failed to create category: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    if (isAddingCategory) {
      alert('Please save the new category first or go back to the list.');
      return;
    }

    if (!formData.category) {
      alert('Please select a category for your produce.');
      return;
    }

    // Since we relaxed the schema, we can still suggest an image but allow submission
    // However, if the user MUST have an image, we can check it here.
    // For now, let's just ensure the data is complete.

    try {
      setLoading(true);
      await api.post('/farmers/products', formData);
      setIsAdding(false);
      setFormData({ name: '', description: '', price: '', category: '', countInStock: '', images: [] });
      fetchData();
    } catch (error) {
      alert('Failed to add produce: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    if (selectedCategory === 'All') return true;
    return product.category?._id === selectedCategory || product.category === selectedCategory;
  });

  if (loading && products.length === 0) return <div>Loading Farm Produce...</div>;

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Produce</h1>
          <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest mt-2">{filteredProducts.length} Items in Harvest</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-slate-900 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-all shadow-xl shadow-slate-200"
        >
          <Plus className="w-4 h-4" />
          Add New Produce
        </button>
      </header>

      {/* Category Filter Bar */}
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
        <button 
          onClick={() => setSelectedCategory('All')}
          className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
            selectedCategory === 'All' 
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-100' 
              : 'bg-white text-slate-500 border-slate-100 hover:border-emerald-200 hover:text-emerald-600'
          }`}
        >
          All Produce
        </button>
        {categories.map(cat => (
          <button 
            key={cat._id}
            onClick={() => setSelectedCategory(cat._id)}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border whitespace-nowrap ${
              selectedCategory === cat._id 
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-100' 
                : 'bg-white text-slate-500 border-slate-100 hover:border-emerald-200 hover:text-emerald-600'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <motion.div
            key={product._id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-900/5 border border-slate-100 overflow-hidden group"
          >
            <div className="h-56 relative overflow-hidden">
              <img 
                src={product.images[0]?.startsWith('http') ? product.images[0] : `http://localhost:5000${product.images[0]}`} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-md text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-50 shadow-sm">
                  {product.category?.name}
                </span>
              </div>
            </div>
            <div className="p-8 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-black text-slate-900 leading-tight">{product.name}</h3>
                <p className="text-2xl font-black text-emerald-600">${product.price}</p>
              </div>
              <p className="text-sm text-slate-400 font-medium line-clamp-2">{product.description}</p>
              <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${product.countInStock > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {product.countInStock} In Stock
                  </p>
                </div>
                <div className="flex gap-2">
                   <button className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                   </button>
                   <button className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {products.length === 0 && (
           <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-emerald-100">
              <Sprout className="w-16 h-16 text-emerald-100 mx-auto mb-6" />
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No produce listed yet. Start your harvest!</p>
           </div>
        )}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-10 border-b border-slate-50">
                <h2 className="text-2xl font-black text-slate-900">Add New Produce</h2>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-1">Fill in the harvest details</p>
              </div>
              <form onSubmit={handleAddProduct} className="p-10 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Product Name</label>
                    <input 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-slate-900 shadow-inner"
                      placeholder="e.g. Organic Mogadishu Tomatoes"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Price ($)</label>
                    <input 
                      required type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-slate-900 shadow-inner"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2 ml-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                      <button 
                        type="button"
                        onClick={() => {
                          setIsAddingCategory(!isAddingCategory);
                          setNewCategoryName('');
                        }}
                        className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-colors"
                      >
                        {isAddingCategory ? '← Back to List' : '+ Add New'}
                      </button>
                    </div>
                    {!isAddingCategory ? (
                      <select 
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-slate-900 shadow-inner"
                      >
                        <option value="">Select...</option>
                        {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                      </select>
                    ) : (
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          autoFocus
                          placeholder="New category name..."
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          className="flex-1 px-5 py-4 bg-slate-50 border-2 border-emerald-500 rounded-2xl focus:outline-none focus:bg-white font-bold text-slate-900 shadow-inner"
                        />
                        <button 
                          type="button"
                          onClick={handleCreateCategory}
                          disabled={!newCategoryName.trim() || loading}
                          className="px-6 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all disabled:opacity-50"
                        >
                          Save
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Description</label>
                  <textarea 
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-slate-900 shadow-inner resize-none h-24"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="relative">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Produce Photo</label>
                        <div className="relative group">
                            <div className="w-full aspect-video bg-emerald-50 rounded-2xl border-2 border-dashed border-emerald-100 flex flex-col items-center justify-center overflow-hidden relative">
                                {formData.images[0] ? (
                                    <img 
                                      src={formData.images[0]?.startsWith('http') ? formData.images[0] : `http://localhost:5000${formData.images[0]}`} 
                                      alt="Preview" 
                                      className="w-full h-full object-cover" 
                                    />
                                ) : (
                                    <>
                                        <Upload className="w-6 h-6 text-emerald-300 group-hover:scale-110 transition-transform" />
                                        <p className="text-[10px] font-black text-emerald-300 uppercase tracking-widest mt-2">Pick Image</p>
                                    </>
                                )}
                                <input 
                                    type="file" 
                                    onChange={handleImageUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer" 
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Harvest Stock</label>
                        <input 
                        required type="number"
                        value={formData.countInStock}
                        onChange={(e) => setFormData({...formData, countInStock: e.target.value})}
                        className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-slate-900 shadow-inner"
                        />
                    </div>
                </div>
                <div className="pt-6 flex gap-4">
                   <button 
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="flex-1 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400 hover:bg-slate-50 rounded-2xl transition-all"
                   >
                    Cancel
                   </button>
                   <button 
                    type="submit"
                    className="flex-1 py-4 font-black uppercase tracking-widest text-[10px] bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-200 hover:bg-emerald-600 transition-all"
                   >
                    Harvest Post
                   </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FarmerProducts;
