import { Link } from "react-router-dom";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem("token");
  const isAuthenticated = token && token !== "undefined" && token !== "null";

  return (
    <nav className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 px-6 md:px-12 py-4 flex justify-between items-center text-gray-900 dark:text-white fixed top-0 left-0 w-full z-50 transition-colors duration-300">

      <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-500">
        Zenvoco
      </h1>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-8">
        <a href="#home" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
          Home
        </a>
        <a href="#how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
          How It Works
        </a>
        <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
          About
        </a>
        {isAuthenticated ? (
          <Link
            to="/dashboard"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
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
        <div className="md:hidden fixed top-16 left-0 right-0 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 z-50 p-6 space-y-4">
          <a href="#home" onClick={() => setMenuOpen(false)} className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">Home</a>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">How It Works</a>
          <a href="#about" onClick={() => setMenuOpen(false)} className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">About</a>
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">Login</Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
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