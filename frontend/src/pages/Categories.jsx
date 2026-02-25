import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Layers, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? All products in this category might become uncategorized.')) {
      try {
        await api.delete(`/categories/${id}`);
        setCategories(categories.filter(c => c._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete category');
      }
    }
  };

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
          <p className="text-slate-500 text-sm">Organize your products with categories.</p>
        </div>
        <Link 
          to="/categories/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-500 gap-3">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
              <p className="font-medium">Loading categories...</p>
            </div>
          ) : error ? (
            <div className="py-20 flex flex-col items-center justify-center text-red-500 gap-3">
              <AlertCircle className="w-10 h-10" />
              <p className="font-medium">{error}</p>
              <button onClick={fetchCategories} className="text-blue-600 underline text-sm">Try again</button>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Layers className="w-12 h-12 opacity-20" />
              <p className="font-medium">No categories found</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <AnimatePresence>
                  {filteredCategories.map((category) => (
                    <motion.tr 
                      key={category._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 flex-shrink-0 border border-blue-100 flex items-center justify-center">
                            <Layers className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{category.name}</p>
                            <p className="text-xs text-slate-500 max-w-[400px] truncate">{category.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 transition-opacity">
                          <Link 
                            to={`/categories/edit/${category._id}`}
                            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => handleDelete(category._id)}
                            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;