import { Link } from "react-router-dom";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem("token");
  const isAuthenticated = token && token !== "undefined" && token !== "null";

  return (
    <nav className="bg-white/70 backdrop-blur-md dark:bg-black/80 border-b border-[#0ea5e9]/10 dark:border-gray-800 px-6 md:px-12 py-4 flex justify-between items-center text-slate-800 dark:text-white fixed top-0 left-0 w-full z-50 transition-colors duration-300">

      <Link to="/" className="flex items-center gap-3">
        <img src="/logo.png" alt="Zenvoco Logo" className="h-8 md:h-10 w-auto object-contain dark:invert" />
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] to-[#2dd4bf] tracking-tight">
          Zenvoco
        </h1>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-8 font-medium">
        <a href="#home" className="text-slate-600 dark:text-gray-300 hover:text-[#0ea5e9] dark:hover:text-white transition">
          Home
        </a>
        <a href="#how-it-works" className="text-slate-600 dark:text-gray-300 hover:text-[#0ea5e9] dark:hover:text-white transition">
          How It Works
        </a>
        <a href="#features" className="text-slate-600 dark:text-gray-300 hover:text-[#0ea5e9] dark:hover:text-white transition">
          Features
        </a>
        <a href="#about" className="text-slate-600 dark:text-gray-300 hover:text-[#0ea5e9] dark:hover:text-white transition">
          About
        </a>
        {isAuthenticated ? (
          <Link
            to="/dashboard"
            className="bg-[#0284c7] text-white px-6 py-2.5 rounded-full font-bold hover:bg-[#0369a1] shadow-[0_4px_14px_0_rgb(2,132,199,0.39)] transition-all transform hover:-translate-y-0.5"
          >
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link to="/login" className="text-slate-600 dark:text-gray-300 hover:text-[#0ea5e9] transition font-bold">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-[#0284c7] text-white px-6 py-2.5 rounded-full font-bold hover:bg-[#0369a1] shadow-[0_4px_14px_0_rgb(2,132,199,0.39)] transition-all transform hover:-translate-y-0.5"
            >
              Register
            </Link>
          </>
        )}
      </div>

      {/* Mobile Actions */}
      <div className="flex md:hidden items-center gap-4">
        <ThemeToggle />
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-gray-900 dark:text-white border border-gray-300 dark:border-gray-800 px-3 py-1.5 rounded-lg text-sm"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      <div className="hidden md:block ml-4">
          <ThemeToggle />
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-b border-[#0ea5e9]/10 dark:border-gray-800 z-50 p-6 space-y-4">
          <a href="#home" onClick={() => setMenuOpen(false)} className="block text-slate-600 dark:text-gray-300 hover:text-[#0ea5e9] dark:hover:text-white transition font-medium">Home</a>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="block text-slate-600 dark:text-gray-300 hover:text-[#0ea5e9] dark:hover:text-white transition font-medium">How It Works</a>
          <a href="#features" onClick={() => setMenuOpen(false)} className="block text-slate-600 dark:text-gray-300 hover:text-[#0ea5e9] dark:hover:text-white transition font-medium">Features</a>
          <a href="#about" onClick={() => setMenuOpen(false)} className="block text-slate-600 dark:text-gray-300 hover:text-[#0ea5e9] dark:hover:text-white transition font-medium">About</a>
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center bg-[#0284c7] text-white px-5 py-3 rounded-full font-bold hover:bg-[#0369a1] transition shadow-md"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-slate-600 dark:text-gray-300 hover:text-[#0ea5e9] dark:hover:text-white transition font-bold">Login</Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center bg-[#0284c7] text-white px-5 py-3 rounded-full font-bold hover:bg-[#0369a1] transition shadow-md"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}

    </nav>
  );
}

export default Navbar;