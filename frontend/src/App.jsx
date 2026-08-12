import { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import UploadPage from "./pages/UploadPage";
import DocumentsPage from "./pages/DocumentsPage";
import SignPage from "./pages/SignPage";
import GenerateDocumentPage from "./pages/GenerateDocumentPage";
import { Files, FilePlus, Sun, Moon, Wand2 } from "lucide-react";

function App() {
  const [theme, setTheme] = useState("dark");
  const location = useLocation();

  const isLinkActive = (path) => location.pathname === path;

  return (
    <div
      className={`flex flex-col min-h-screen ${theme === "dark" ? "bg-slate-950" : "bg-slate-50"} transition-colors duration-500`}
    >
      {/* Navigation Header */}
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
                to="/generate"
                className={`flex items-center gap-2 transition-all ${isLinkActive("/generate") ? "text-primary-500 scale-105" : "text-slate-500 hover:text-slate-400"}`}
              >
                <Wand2 size={18} />
                AI Generate
              </Link>
              <Link
                to="/"
                className={`flex items-center gap-2 transition-all ${isLinkActive("/") ? "text-primary-500 scale-105" : "text-slate-500 hover:text-slate-400"}`}
              >
                <FilePlus size={18} />
                Upload
              </Link>
              <Link
                to="/documents"
                className={`flex items-center gap-2 transition-all ${isLinkActive("/documents") ? "text-primary-500 scale-105" : "text-slate-500 hover:text-slate-400"}`}
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
              onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
              className={`p-2.5 rounded-xl transition-all ${theme === "dark" ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-[1400px] w-full mx-auto p-6 md:p-10">
        <Routes>
          <Route path="/" element={<UploadPage theme={theme} />} />
          <Route path="/generate" element={<GenerateDocumentPage theme={theme} />} />
          <Route path="/documents" element={<DocumentsPage theme={theme} />} />
          <Route path="/sign/:docId" element={<SignPage theme={theme} />} />
        </Routes>
      </main>

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
    </div>
  );
}

export default App;
