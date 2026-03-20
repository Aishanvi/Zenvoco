import { Link, useLocation } from "react-router-dom";

function DashboardLayout({ children }) {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Learn Mode", path: "/learn" },
    { name: "Listen Mode", path: "/listen" },
    { name: "Guided Practice", path: "/practice" },
    { name: "Daily Task", path: "/daily-task" },
    { name: "Progress", path: "/progress" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <div className="flex min-h-screen bg-black bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black text-white relative overflow-hidden">

      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Sidebar */}
      <aside className="w-64 bg-gray-900/50 backdrop-blur-xl border-r border-gray-800 p-6 relative z-10 flex flex-col">
        <h1 className="text-2xl font-bold text-blue-500 mb-8">
          Zenvoco
        </h1>

        <nav className="space-y-4 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`block px-4 py-3 rounded-xl transition-all duration-300 ${location.pathname === item.path
                ? "bg-blue-600 text-white font-medium"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Home Button added at the bottom */}
        <Link to="/" className="mt-8 block px-4 py-3 rounded-xl border border-gray-800 bg-black/50 hover:bg-gray-800 text-gray-400 hover:text-white transition-all text-center">
          Exit to Home
        </Link>
      </aside>

      {/* Content */}
      <main className="flex-1 p-10 relative z-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}

export default DashboardLayout;