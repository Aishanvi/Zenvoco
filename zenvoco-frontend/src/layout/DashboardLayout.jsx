import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import ThemeToggle from "../components/ThemeToggle";

function DashboardLayout({ children }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Learn Mode", path: "/learn" },
    { name: "Listen Mode", path: "/listen" },
    { name: "Guided Practice", path: "/practice" },
    { name: "Daily Task", path: "/daily-task" },
    { name: "Progress", path: "/progress" },
    { name: "Profile", path: "/profile" },
  ];

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-black dark:bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] dark:from-blue-900/20 dark:via-black dark:to-black text-gray-900 dark:text-white relative overflow-hidden transition-colors duration-300">

      {/* Background Glows (visible primarily in dark mode) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/10 dark:bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/10 dark:bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Mobile Header (Only on small screens) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-600 dark:text-blue-500">Zenvoco</h1>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-900 dark:text-white p-2 border border-gray-300 dark:border-gray-800 rounded-lg"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {/* Sidebar overlay for mobile */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-[70] w-64 bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800 p-6 flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="lg:flex hidden justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-500">
            Zenvoco
          </h1>
          <ThemeToggle />
        </div>
        <div className="lg:hidden h-16" /> {/* Spacer for mobile */}

        <nav className="space-y-4 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`block px-4 py-3 rounded-xl transition-all duration-300 ${location.pathname === item.path
                ? "bg-blue-600 text-white font-medium shadow-md shadow-blue-500/20"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-white"
                }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Home Button added at the bottom */}
        <Link to="/" className="mt-8 block px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-100/50 dark:bg-black/50 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all text-center">
          Exit to Home
        </Link>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 md:p-10 relative z-10 overflow-y-auto mt-16 lg:mt-0">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}

export default DashboardLayout;