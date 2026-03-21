import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-black border-b border-gray-800 px-6 md:px-12 py-4 flex justify-between items-center text-white fixed top-0 left-0 w-full z-50">

      <h1 className="text-2xl font-bold text-blue-500">
        Zenvoco
      </h1>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-8">
        <a href="#home" className="text-gray-300 hover:text-white transition">
          Home
        </a>
        <a href="#how-it-works" className="text-gray-300 hover:text-white transition">
          How It Works
        </a>
        <a href="#about" className="text-gray-300 hover:text-white transition">
          About
        </a>
        {localStorage.getItem("token") ? (
          <Link
            to="/dashboard"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link to="/login" className="text-gray-300 hover:text-white transition">
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

      {/* Mobile Toggle */}
      <button 
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-white border border-gray-800 px-3 py-1.5 rounded-lg text-sm"
      >
        {menuOpen ? "Close" : "Menu"}
      </button>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-black border-b border-gray-800 z-50 p-6 space-y-4">
          <a href="#home" onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-white transition">Home</a>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-white transition">How It Works</a>
          <a href="#about" onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-white transition">About</a>
          {localStorage.getItem("token") ? (
            <Link
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-white transition">Login</Link>
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