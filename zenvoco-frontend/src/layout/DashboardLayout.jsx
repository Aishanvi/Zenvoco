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
    <div className="flex min-h-screen bg-gradient-to-br from-[#e8f4f8] via-[#eaf6fc] to-[#d6eff8] dark:bg-gray-900 dark:bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] dark:from-gray-900 dark:via-gray-950 dark:to-black text-slate-900 dark:text-white relative overflow-hidden transition-colors duration-300 font-sans">

      {/* Background Glows (visible primarily in dark mode) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/10 dark:bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/10 dark:bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Mobile Header (Only on small screens) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl border-b border-[#0ea5e9]/10 dark:border-gray-800 p-4 flex items-center justify-between">
        <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] to-[#2dd4bf] tracking-tight">Zenvoco</h1>
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
      <aside className={`fixed inset-y-0 left-0 z-[70] w-64 bg-white/60 dark:bg-gray-900/50 backdrop-blur-xl border-r border-[#0ea5e9]/10 dark:border-gray-800 p-6 flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="lg:flex hidden justify-between items-center mb-8">
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] to-[#2dd4bf] tracking-tight">
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
                ? "bg-[#0284c7] text-white font-bold shadow-[0_4px_14px_0_rgb(2,132,199,0.39)] transform hover:-translate-y-0.5"
                : "text-slate-600 dark:text-gray-400 hover:bg-[#e0eff8]/50 dark:hover:bg-gray-800 font-medium hover:text-[#0ea5e9] dark:hover:text-white"
                }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Home Button added at the bottom */}
        <Link to="/" className="mt-8 block px-4 py-3 rounded-xl border border-[#0ea5e9]/20 dark:border-gray-800 bg-white/50 dark:bg-black/50 hover:bg-white dark:hover:bg-gray-800 text-slate-600 dark:text-gray-400 hover:text-[#0ea5e9] dark:hover:text-white transition-all text-center font-bold">
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