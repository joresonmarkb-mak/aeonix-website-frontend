import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Watches", path: "/allwatches" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

function Navbar({ cartCount }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
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
          <button className="text-gray-400 hover:text-[#C8A03C] transition-colors bg-transparent border-none cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </button>
          <button className="relative text-gray-400 hover:text-[#C8A03C] transition-colors bg-transparent border-none cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#C8A03C] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <Link to="/login" className="text-gray-400 hover:text-[#C8A03C] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;