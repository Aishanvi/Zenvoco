import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-black border-b border-gray-800 px-8 py-4 flex justify-between items-center text-white fixed top-0 left-0 w-full z-50">

      <h1 className="text-2xl font-bold text-blue-500">
        Zenvoco
      </h1>

      <div className="flex items-center gap-8">

        <a href="#home" className="text-gray-300 hover:text-white transition">
          Home
        </a>

        <a href="#how-it-works" className="text-gray-300 hover:text-white transition">
          How It Works
        </a>

        <a href="#about" className="text-gray-300 hover:text-white transition">
          About
        </a>

        <Link to="/login" className="text-gray-300 hover:text-white transition">
          Login
        </Link>

        <Link
          to="/register"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Register
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;