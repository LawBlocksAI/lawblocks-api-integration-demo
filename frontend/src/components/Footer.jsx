import React from "react";
import useTheme from "../hooks/useTheme";

export default function Footer() {
  const { theme } = useTheme();
  return (
    <footer
      className={`mt-auto border-t py-10 px-6 ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
    >
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 opacity-50 grayscale contrast-125">
          <div className="w-6 h-6 bg-slate-400 rounded flex items-center justify-center text-white font-heading font-bold text-xs">
            L
          </div>
          <span
            className={`font-heading font-bold text-lg tracking-tight ${theme === "dark" ? "text-white" : "text-slate-700"}`}
          >
            DocSignApp
          </span>
        </div>
        <p className="text-slate-500 text-sm font-medium">
          &copy; 2026 DocSignApp. All rights reserved.
        </p>
        <div className="flex gap-8 text-slate-500 text-sm font-medium">
          <a href="#" className="hover:text-primary-500 transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-primary-500 transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-primary-500 transition-colors">
            Help
          </a>
        </div>
      </div>
    </footer>
  );
}
