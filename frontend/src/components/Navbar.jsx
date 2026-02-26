import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, Menu, User, Leaf, Search, LogOut as LogOutIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFarmerAuth } from '../context/FarmerAuthContext';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { farmer } = useFarmerAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:scale-105 transition-transform">
              <Leaf className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              Fresh<span className="text-emerald-600">Mart</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `text-sm font-bold uppercase tracking-widest transition-colors ${isActive ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-600'}`
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/products-store" 
              className={({ isActive }) => 
                `text-sm font-bold uppercase tracking-widest transition-colors ${isActive ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-600'}`
              }
            >
              Fresh Produce
            </NavLink>
            <NavLink 
              to="/farmer/login" 
              className={({ isActive }) => 
                `text-sm font-bold uppercase tracking-widest transition-colors ${isActive ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-600'}`
              }
            >
              Farmer Portal
            </NavLink>
          </div>

          {/* User & Cart */}
          <div className="flex items-center gap-4">


            <div className="flex items-center gap-2">
              <Link 
                to={
                  user 
                    ? (user.role === 'admin' || user.role === 'staff' ? '/admin' : '/profile') 
                    : (farmer ? '/farmer/dashboard' : '/login')
                } 
                className="flex items-center gap-2 p-2 px-4 rounded-xl text-slate-700 font-bold hover:bg-emerald-50 hover:text-emerald-700 transition-all border border-transparent hover:border-emerald-100"
              >
                {user || farmer ? (
                  <>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col items-start leading-none">
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-0.5">
                        {user?.role === 'admin' ? 'Admin' : (farmer ? 'Farmer' : 'Welcome')}
                      </span>
                      <span className="text-sm font-black text-slate-900 hidden sm:inline">
                        {user?.name?.split(' ')[0] || farmer?.name?.split(' ')[0] || 'Member'}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <User className="w-5 h-5 text-slate-400" />
                    <span className="text-sm">Login</span>
                  </>
                )}
              </Link>
              
              {user && (
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                  title="Logout"
                >
                  <LogOutIcon className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-700 hover:bg-emerald-50 rounded-xl transition-all border border-transparent hover:border-emerald-100"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-lg">
                  {cartCount}
                </span>
              )}
            </button>
            
            <button className="md:hidden p-2 text-slate-600">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
