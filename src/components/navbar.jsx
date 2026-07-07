import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthModal from "../pages/Authmodal";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import CartSidebar from "./CartSidebar.jsx";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Watches", path: "/allwatches" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

function Navbar({ cartCount }) {
  const [scrolled, setScrolled] = useState(false);
  const [showAuth, setShowAuth] = useState(false); 
  const { user, logout } = useAuth();
  const { count, setCartOpen } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-[5%] ${scrolled ? "bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#C8A03C]/10" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto flex items-center h-16 gap-8">

          {/* Logo */}
          <Link to="/" className="mr-auto">
            <img src="https://res.cloudinary.com/dp3iviwzj/image/upload/v1782254317/png_iikwqh.png" alt="Aeonix Logo" className="h-30" />
          </Link>

          {/* Links */}
          <div className="hidden md:flex gap-8 items-center">
            {navLinks.map(link => (
              <Link
                key={link.label}
                to={link.path}
                className="text-gray-400 hover:text-[#C8A03C] text-xs tracking-[2px] uppercase transition-colors no-underline"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div className="flex gap-5 items-center">
            
           <button
  onClick={() => setCartOpen(true)}
  className="relative text-gray-400 hover:text-[#C8A03C] transition-colors bg-transparent border-none cursor-pointer"
>
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
  {count > 0 && (
    <span className="absolute -top-1 -right-1 bg-[#C8A03C] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
      {count}
    </span>
  )}
</button>
            {user ? (
              <div className="relative flex items-center gap-3 group">
                <span className="text-[#C8A03C] text-xs font-semibold tracking-wide hidden md:block">
                  Welcome, {user.name.split(" ")[0]}
                </span>

                {/* Avatar button */}
                <button className="text-gray-400 hover:text-[#C8A03C] transition-colors bg-transparent border-none cursor-pointer">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 top-8 w-44 bg-white shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link to="/profile" className="flex items-center gap-2 px-4 py-3 text-xs text-gray-600 hover:bg-gray-50 hover:text-[#1a1410] no-underline transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    My Profile
                  </Link>
                  <Link to="/orders" className="flex items-center gap-2 px-4 py-3 text-xs text-gray-600 hover:bg-gray-50 hover:text-[#1a1410] no-underline transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                    My Orders
                  </Link>

                  {/* Admin only */}
                  {user.role === "admin" && (
                    <>
                      <div className="border-t border-gray-100" />
                      <Link to="/admin" className="flex items-center gap-2 px-4 py-3 text-xs text-[#C8A03C] hover:bg-[#C8A03C]/5 no-underline transition-colors font-semibold">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                        Admin Panel
                      </Link>
                      
                    </>
                  )}

                  <div className="border-t border-gray-100" />
                  <button onClick={logout} className="flex items-center gap-2 px-4 py-3 text-xs text-red-400 hover:bg-red-50 hover:text-red-600 w-full bg-transparent border-none cursor-pointer transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowAuth(true)} className="text-white-400 transition-colors border-none cursor-pointer bg-[#C8A03C] hover:bg-[#e0b84a] text-black text-[13px] text-bold px-3 py-1 rounded tracking-[1px] uppercase">
                Login
              </button>
            )}
            
          </div>

        </div>
      </nav>

      {/* Modal — inside return, outside nav */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      <CartSidebar onLoginRequired={() => setShowAuth(true)} />
    </>
  );
}

export default Navbar;