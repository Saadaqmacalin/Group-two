import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Search, 
  Trash2, 
  Loader2,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Tractor,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Farmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchFarmers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/farmers');
      setFarmers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load farmers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this farmer? Their products will remain but will no longer be linked to an active farmer account.')) {
      try {
        await api.delete(`/farmers/${id}`);
        setFarmers(farmers.filter(f => f._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete farmer');
      }
    }
  };

  const filteredFarmers = farmers.filter(farmer => 
    farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Farmers</h1>
          <p className="text-slate-500 text-sm">Manage local producers and farm verified accounts.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, email or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-500 gap-3">
              <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
              <p className="font-medium font-bold text-slate-400 uppercase tracking-widest">Scanning local farms...</p>
            </div>
          ) : error ? (
            <div className="py-20 flex flex-col items-center justify-center text-rose-500 gap-3 text-center px-4">
              <AlertCircle className="w-10 h-10" />
              <p className="font-black uppercase tracking-tight">{error}</p>
              <button onClick={fetchFarmers} className="mt-2 text-emerald-600 font-bold hover:underline text-sm uppercase tracking-widest">Retry Connection</button>
            </div>
          ) : filteredFarmers.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Tractor className="w-12 h-12 opacity-20" />
              <p className="font-bold uppercase tracking-widest text-slate-300">No farmers on the list</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                  <th className="px-6 py-5">Producer</th>
                  <th className="px-6 py-5">Contact Details</th>
                  <th className="px-6 py-5">Farm Location</th>
                  <th className="px-6 py-5 text-right">Settings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <AnimatePresence>
                  {filteredFarmers.map((farmer) => (
                    <motion.tr 
                      key={farmer._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-emerald-50/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex-shrink-0 flex items-center justify-center text-white shadow-lg shadow-emerald-100 font-black text-lg">
                            {farmer.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 group-hover:text-emerald-700 transition-colors">{farmer.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono italic">#{farmer._id.slice(-6).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1.5 text-xs font-bold text-slate-600">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-emerald-500" />
                            {farmer.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-emerald-500" />
                            {farmer.phoneNumber || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-2 text-xs font-bold text-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="truncate max-w-[180px]">{farmer.location || 'Not Specified'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleDelete(farmer._id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                            title="Remove Farmer"
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

export default Farmers;
