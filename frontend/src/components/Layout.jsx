import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <main className="pb-28">
        <Outlet />
      </main>
      <Navbar />
    </div>
  );
}
