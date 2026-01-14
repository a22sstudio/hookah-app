import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-dark flex flex-col">
      {/* Main Content */}
      <main className="flex-1 pb-24 safe-top">
        <Outlet />
      </main>
      
      {/* Bottom Navigation */}
      <Navbar />
    </div>
  );
}
