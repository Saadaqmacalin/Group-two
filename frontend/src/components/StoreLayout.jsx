import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import CartModal from './CartModal';
import { Outlet } from 'react-router-dom';

const StoreLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <CartModal />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default StoreLayout;
