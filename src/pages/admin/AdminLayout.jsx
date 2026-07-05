import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const navItems = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    label: "Products",
    path: "/admin/products",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
  },
  {
    label: "Orders",
    path: "/admin/orders",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  {
    label: "Users",
    path: "/admin/users",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
        <path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-60" : "w-16"} bg-[#1a1410] flex flex-col transition-all duration-300 flex-shrink-0`}>
        <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
          {sidebarOpen && (
            <img src="https://res.cloudinary.com/dp3iviwzj/image/upload/v1782254317/png_iikwqh.png" alt="Aeonix Logo" className="h-30" />
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-[#C8A03C] bg-transparent border-none cursor-pointer ml-auto">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>

        <nav className="flex-1 py-4">
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors no-underline ${active ? "bg-[#C8A03C]/10 text-[#C8A03C] border-r-2 border-[#C8A03C]" : "text-gray-400 hover:text-[#C8A03C] hover:bg-white/5"}`}>
                <span className="flex-shrink-0">{item.icon}</span>
                {sidebarOpen && <span className="text-xs font-semibold tracking-[1.5px] uppercase">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#C8A03C]/20 flex items-center justify-center text-[#C8A03C] text-xs font-bold flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
              </div>
              <button onClick={handleLogout} className="text-gray-500 hover:text-red-400 bg-transparent border-none cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </div>
          ) : (
            <button onClick={handleLogout} className="text-gray-500 hover:text-red-400 bg-transparent border-none cursor-pointer w-full flex justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h1 className="text-sm font-bold text-[#1a1410] tracking-wide uppercase">
            {navItems.find(i => i.path === location.pathname)?.label || "Admin"}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">Welcome, {user?.name?.split(" ")[0]}</span>
            <Link to="/" className="text-xs text-[#C8A03C] hover:underline no-underline">View Store →</Link>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}