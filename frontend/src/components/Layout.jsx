import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import useTheme from '../hooks/useTheme';

export default function Layout() {
  const { theme } = useTheme();
  return (
    <div className={`flex flex-col min-h-screen ${theme === "dark" ? "bg-slate-950" : "bg-slate-50"} transition-colors duration-500`}>
      <Header />
      <main className="flex-1 max-w-[1400px] w-full mx-auto p-6 md:p-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
