import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  TrendingUp, 
  LogOut,
  ChevronRight,
  Sprout,
  Users,
  Layers
} from 'lucide-react';
import { useFarmerAuth } from '../context/FarmerAuthContext';

const FarmerSidebar = () => {
  const { farmer, logoutFarmer } = useFarmerAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutFarmer();
    navigate('/farmer/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/farmer/dashboard' },
    { name: 'My Products', icon: Package, path: '/farmer/products' },
    { name: 'Categories', icon: Layers, path: '/farmer/categories' },
    { name: 'My Sales', icon: TrendingUp, path: '/farmer/sales' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-emerald-100 flex flex-col z-30 shadow-2xl shadow-emerald-900/5">
      <div className="p-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
            <Sprout className="text-white w-7 h-7" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 tracking-tight block leading-none">
              Farmer
            </span>
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1 block">
              Admin Portal
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-6 space-y-2 overflow-y-auto pt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              group flex items-center justify-between px-5 py-4 text-sm font-black rounded-[1.25rem] transition-all duration-300
              ${isActive 
                ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100 translate-x-1' 
                : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'}
            `}
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-4">
                  <item.icon className="w-5 h-5" />
                  <span className="uppercase tracking-widest text-[11px]">{item.name}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-all duration-300 ${isActive ? 'rotate-90 opacity-100' : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-1'}`} />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-6 mt-auto">
        <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-100/50 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-600 font-black text-xl shadow-sm border border-emerald-100">
              {farmer?.farmName?.charAt(0) || 'F'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-black text-slate-900 truncate">{farmer?.farmName}</p>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-0.5">{farmer?.name}</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-emerald-100/50"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default FarmerSidebar;
