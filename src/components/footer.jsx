import { useState, useEffect } from "react";


const footerCols = [
  { title: "Quick Links", links: ["Home", "Watches", "About", "Contact"] },
  { title: "Categories", links: ["Men's Watches", "Dive Watches", "Women's Watches", "Unisex Watches"] },
  { title: "Social Media", links: ["Facebook", "Instagram", "TikTok"] },
];

function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-[#C8A03C]/10 pt-14 pb-8 px-[5%]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-12">
          <div>
             {/* Logo */}
        <a href="#" className="mr-auto  ">
          <img src="https://res.cloudinary.com/dp3iviwzj/image/upload/v1782254317/png_iikwqh.png" alt="Aeonix Logo" className="h-30" />
        </a>
            <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
              Founded in 2024 by three college students who share a passion for collecting and appreciating watches, AEONIX Timepieces was built on the belief that quality timepieces should be accessible to everyone.
What started as a hobby quickly evolved into a mission to provide watch enthusiasts with authentic, stylish, and reliable watches at affordable prices. We specialize in both brand-new and pre-owned timepieces, offering carefully selected watches that are often priced below market value without compromising quality.
            </p>
          </div>
          {footerCols.map(col => (
            <div key={col.title}>
              <h4 className="text-[#C8A03C] text-[11px] font-bold tracking-[3px] uppercase mb-5">{col.title}</h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-gray-600 hover:text-[#C8A03C] text-sm transition-colors no-underline">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-700 text-xs">© 2024 Aeonix Watch Store. All rights reserved.</p>
          <p className="text-gray-700 text-xs">Urdaneta, Pangasinan, Philippines</p>
        </div>
      </div>
    </footer>
  );
}
export default Footer;