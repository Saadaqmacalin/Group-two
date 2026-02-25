import React from 'react';
import { Outlet } from 'react-router-dom';
import FarmerSidebar from './FarmerSidebar';

const FarmerLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <FarmerSidebar />
      <main className="flex-1 ml-72 p-10">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default FarmerLayout;
