import { Link, useLocation } from "react-router-dom";
import { Files, FilePlus, Sun, Moon, Wand2 } from "lucide-react";
import useTheme from "../hooks/useTheme";
import { ROUTES } from "../utils/routeConstants";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isLinkActive = (path) => location.pathname === path;

  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur-md border-b ${theme === "dark" ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"} px-6 py-4`}
    >
      <div className="max-w-[1400px] mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group transition-all">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-heading font-bold text-xl shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
            L
          </div>
          <span
            className={`font-heading font-bold text-2xl tracking-tight ${theme === "dark" ? "text-white" : "text-slate-900"}`}
          >
            DocSignApp <span className="text-primary-500">Sign</span>
          </span>
        </Link>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex gap-8 font-medium">
            <Link
              to={ROUTES.GENERATE}
              className={`flex items-center gap-2 transition-all ${isLinkActive(ROUTES.GENERATE) ? "text-primary-500 scale-105" : "text-slate-500 hover:text-slate-400"}`}
            >
              <Wand2 size={18} />
              AI Generate
            </Link>
            <Link
              to={ROUTES.UPLOAD}
              className={`flex items-center gap-2 transition-all ${isLinkActive(ROUTES.UPLOAD) ? "text-primary-500 scale-105" : "text-slate-500 hover:text-slate-400"}`}
            >
              <FilePlus size={18} />
              Upload
            </Link>
            <Link
              to={ROUTES.DOCUMENTS}
              className={`flex items-center gap-2 transition-all ${isLinkActive(ROUTES.DOCUMENTS) ? "text-primary-500 scale-105" : "text-slate-500 hover:text-slate-400"}`}
            >
              <Files size={18} />
              My Documents
            </Link>
          </div>

          <div
            className={`w-px h-6 ${theme === "dark" ? "bg-slate-800" : "bg-slate-200"}`}
          ></div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl transition-all ${theme === "dark" ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
