import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { 
  ArrowLeft, 
  Loader2, 
  Layers,
  FileText,
  Save
} from 'lucide-react';
import { motion } from 'framer-motion';

const CategoryForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const location = useLocation();
  const isFarmer = location.pathname.startsWith('/farmer');
  const basePath = isFarmer ? '/farmer/categories' : '/categories';
  const themeColor = isFarmer ? 'emerald' : 'blue';
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    if (isEdit) {
      const fetchCategory = async () => {
        try {
          const { data } = await api.get(`/categories/${id}`);
          setValue('name', data.name);
          setValue('description', data.description);
        } catch (err) {
          console.error(err);
          alert('Failed to load category');
        } finally {
          setInitialLoading(false);
        }
      };
      fetchCategory();
    }
  }, [id, isEdit, setValue]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      if (isEdit) {
        await api.put(`/categories/${id}`, data);
      } else {
        await api.post('/categories', data);
      }
      
      navigate(basePath);
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className={`w-10 h-10 text-${themeColor}-600 animate-spin`} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(basePath)}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{isEdit ? 'Edit Category' : 'Add New Category'}</h1>
          <p className="text-slate-500 text-sm">Create a new collection for your products.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block flex items-center gap-2">
              <Layers className="w-4 h-4" /> Category Name
            </label>
            <input 
              {...register('name', { required: 'Category name is required' })}
              placeholder="Ex: Electronics, Fashion, etc."
              className={`w-full px-4 py-2.5 border ${errors.name ? 'border-red-500' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-${themeColor}-500`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block flex items-center gap-2">
              <FileText className="w-4 h-4" /> Description
            </label>
            <textarea 
              {...register('description', { required: 'Description is required' })}
              rows="4"
              placeholder="Write a brief description of this category..."
              className={`w-full px-4 py-2.5 border ${errors.description ? 'border-red-500' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-${themeColor}-500`}
            />
            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 bg-${themeColor}-600 hover:bg-${themeColor}-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-${themeColor}-200 transition-all active:scale-95 disabled:opacity-70`}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isEdit ? 'Update Category' : 'Create Category'}
          </button>
          <Link 
            to={basePath}
            className="px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;