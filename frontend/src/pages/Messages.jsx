import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Search, 
  Trash2, 
  Mail, 
  MailOpen,
  Loader2,
  AlertCircle,
  Eye,
  Clock,
  User,
  XCircle,
  Inbox
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/messages');
      setMessages(data);
    } catch (err) {
      setError('Failed to load messages');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (messageId, currentStatus) => {
    try {
      await api.put(`/messages/${messageId}`, { isRead: !currentStatus });
      setMessages(messages.map(m => m._id === messageId ? { ...m, isRead: !currentStatus } : m));
      if (selectedMessage?._id === messageId) {
        setSelectedMessage({ ...selectedMessage, isRead: !currentStatus });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update message status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await api.delete(`/messages/${id}`);
        setMessages(messages.filter(m => m._id !== id));
        if (selectedMessage?._id === id) setSelectedMessage(null);
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete message');
      }
    }
  };

  const filteredMessages = messages.filter(message => 
    message.sender.toLowerCase().includes(searchTerm.toLowerCase()) || 
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inbound Messages</h1>
          <p className="text-slate-500 text-sm">Review customer inquiries and feedback.</p>
        </div>
        {unreadCount > 0 && (
          <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold border border-blue-100 animate-pulse">
            {unreadCount} Unread Messages
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by sender, subject or email..."
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
              <p className="font-medium">Loading messages...</p>
            </div>
          ) : error ? (
            <div className="py-20 flex flex-col items-center justify-center text-red-500 gap-3">
              <AlertCircle className="w-10 h-10" />
              <p className="font-medium">{error}</p>
              <button onClick={fetchMessages} className="text-blue-600 underline text-sm">Try again</button>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Inbox className="w-12 h-12 opacity-20" />
              <p className="font-medium">No messages found</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Sender</th>
                  <th className="px-6 py-4 font-semibold">Subject</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <AnimatePresence>
                  {filteredMessages.map((message) => (
                    <motion.tr 
                      key={message._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`hover:bg-slate-50/50 transition-colors group ${!message.isRead ? 'bg-blue-50/30' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${!message.isRead ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                            {!message.isRead ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className={`text-sm font-semibold ${!message.isRead ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>
                              {message.sender}
                            </p>
                            <p className="text-[10px] text-slate-400">{message.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className={`text-sm max-w-[300px] truncate ${!message.isRead ? 'text-slate-900 font-semibold' : 'text-slate-500'}`}>
                          {message.subject}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400 font-medium">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 transition-opacity">
                          <button 
                            onClick={() => {
                              setSelectedMessage(message);
                              if (!message.isRead) handleToggleRead(message._id, false);
                            }}
                            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Read Message"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(message._id)}
                            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete"
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

      {/* Message View Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{selectedMessage.sender}</h2>
                    <p className="text-xs text-slate-500">{selectedMessage.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedMessage(null)}
                  className="p-2 hover:bg-white rounded-full transition-colors shadow-sm"
                >
                  <XCircle className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block mb-1">Subject</label>
                  <h3 className="text-xl font-black text-slate-900">{selectedMessage.subject}</h3>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 min-h-[150px]">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleRead(selectedMessage._id, selectedMessage.isRead)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        selectedMessage.isRead 
                        ? 'border-slate-200 text-slate-600 hover:bg-slate-50' 
                        : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      {selectedMessage.isRead ? 'Mark as Unread' : 'Mark as Read'}
                    </button>
                    <button
                      onClick={() => handleDelete(selectedMessage._id)}
                      className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-xs font-bold hover:bg-rose-100 transition-all"
                    >
                      Delete Permanently
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Messages;
