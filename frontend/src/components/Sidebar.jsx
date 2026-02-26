import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  UsersRound, 
  CreditCard, 
  MessageSquare,
  ChevronRight,
  Tractor
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Products', icon: Package, path: '/products' },
    { name: 'Categories', icon: Layers, path: '/categories' },
    { name: 'Orders', icon: ShoppingCart, path: '/orders' },
    { name: 'Sales', icon: TrendingUp, path: '/sales' },
    { name: 'Farmers', icon: Tractor, path: '/farmers' },
    { name: 'Customers', icon: Users, path: '/customers' },
    { name: 'Payments', icon: CreditCard, path: '/payments' },
    { name: 'Messages', icon: MessageSquare, path: '/messages' },
  ];

  // Add Users link only for admin
  if (user?.role === 'admin') {
    navItems.push({ name: 'Users', icon: UsersRound, path: '/users' });
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col z-20 transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">FM</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
            Store Admin
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto pt-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              group flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
              ${isActive 
                ? 'bg-emerald-50 text-emerald-600 shadow-sm' 
                : 'text-slate-600 hover:bg-emerald-50/10 hover:text-emerald-900'}
            `}
          >
            <div className="flex items-center gap-3">
              <item.icon className={`w-5 h-5 transition-colors ${
                // Custom color handling if needed
                'group-hover:text-emerald-600'
              }`} />
              <span>{item.name}</span>
            </div>
            <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0 outline-none`} />
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold uppercase">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
