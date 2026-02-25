import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Leaf } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          {/* Brand */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/40 group-hover:scale-105 transition-transform">
                <Leaf className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Fresh<span className="text-emerald-500">Mart</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs font-medium text-slate-500">
              Mogadishu's leading destination for premium organic produce and daily essentials. Pure quality, delivered fresh.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-3 bg-slate-900 rounded-xl hover:bg-emerald-600 hover:text-white transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-3 bg-slate-900 rounded-xl hover:bg-emerald-600 hover:text-white transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-3 bg-slate-900 rounded-xl hover:bg-emerald-600 hover:text-white transition-all">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-8">
            <h4 className="text-white font-black uppercase tracking-widest text-[10px]">The Pantry</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link to="/products-store" className="hover:text-emerald-500 transition-colors">Fresh Produce</Link></li>
              <li><Link to="/products-store" className="hover:text-emerald-500 transition-colors">Dairy & Eggs</Link></li>
              <li><Link to="/products-store" className="hover:text-emerald-500 transition-colors">Fresh Bakery</Link></li>
              <li><Link to="/products-store" className="hover:text-emerald-500 transition-colors">Organic Staples</Link></li>
            </ul>
          </div>

          {/* Links */}
          <div className="space-y-8">
            <h4 className="text-white font-black uppercase tracking-widest text-[10px]">Care Center</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link to="#" className="hover:text-emerald-500 transition-colors">Shipping Policy</Link></li>
              <li><Link to="#" className="hover:text-emerald-500 transition-colors">Returns & Refunds</Link></li>
              <li><Link to="#" className="hover:text-emerald-500 transition-colors">FAQs</Link></li>
              <li><Link to="#" className="hover:text-emerald-500 transition-colors">Sustainability</Link></li>
            </ul>
          </div>

          {/* Quick Contact */}
          <div className="space-y-8">
            <h4 className="text-white font-black uppercase tracking-widest text-[10px]">Get in Touch</h4>
            <ul className="space-y-5 text-sm font-bold">
              <li className="flex items-center gap-4">
                <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-emerald-500">
                  <Phone className="w-4 h-4" />
                </div>
                <span>+252 61 XXX XXXX</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-emerald-500">
                  <Mail className="w-4 h-4" />
                </div>
                <span>fresh@freshmart.so</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-emerald-500 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="leading-relaxed">Business District,<br/>Mogadishu, Somalia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-600">
          <p>© 2026 FreshMart Somali. Pure Quality Guaranteed.</p>
          <div className="flex gap-12">
            <a href="#" className="hover:text-emerald-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
