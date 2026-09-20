import { useState, useEffect } from "react";

const footerCols = [
  { title: "Quick Links", links: ["Home", "Watches", "About", "Contact"] },
  { title: "Categories", links: ["Men's Watches", "Dive Watches", "Women's Watches", "Unisex Watches"] },
  { title: "Social Media", links: ["Facebook", "Instagram", "TikTok"] },
];

function Footer() {
  return (
    <footer className="relative py-[clamp(2.5rem,6vw,6rem)] px-[clamp(1rem,5vw,3rem)] bg-black overflow-hidden font-sanss">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(https://res.cloudinary.com/dp3iviwzj/image/upload/v1789271468/Group_17_aefq8r.png)" }}
      />
      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-x-8 gap-y-10 md:gap-12 mb-12">
          <div className="sm:col-span-2 md:col-span-1">
            {/* Logo */}
            <a href="#" className="inline-block mr-auto mb-4">
              <img
                src="https://res.cloudinary.com/dp3iviwzj/image/upload/v1782254317/png_iikwqh.png"
                alt="Aeonix Logo"
                className="h-[clamp(2rem,6vw,4.5rem)] w-auto"
              />
            </a>
            <p className="text-gray-400 text-[clamp(0.875rem,2vw,1rem)] leading-relaxed max-w-xs">
              Founded in 2024 by three college students who share a passion for collecting and appreciating watches, AEONIX Timepieces was built on the belief that quality timepieces should be accessible to everyone.
            </p>
          </div>
          {footerCols.map(col => (
            <div key={col.title}>
              <h4 className="text-[#C8A03C] text-[clamp(0.875rem,2vw,1rem)] font-bold tracking-[3px] uppercase mb-5">{col.title}</h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-[#C8A03C] text-[clamp(0.875rem,2vw,1rem)] transition-colors no-underline">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
          <p className="text-gray-400 text-[clamp(0.75rem,2vw,0.875rem)]">© 2024 Aeonix Watch Store. All rights reserved.</p>
          <p className="text-gray-400 text-[clamp(0.75rem,2vw,0.875rem)]">Urdaneta, Pangasinan, Philippines</p>
        </div>
      </div>
    </footer>
  )
}
export default Footer;