import { useState, useEffect, useRef } from "react";
import API from "../services/Api.js";

function Stars({ rating, size = "text-base" }) {
  return (
    <div className="flex gap-0.5 ">
      {[1,2,3,4,5].map(s => (
        <span key={s} className={`${size} ${s <= rating ? "text-[#C8A03C]" : "text-gray-600"}`}>★</span>
      ))}
    </div>
  );
}

export default function ClientTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  useEffect(() => {
    API.get("/testimonials")
      .then(res => setTestimonials(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 0);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };

  return (
    <section className="bg-[#0a0a0a] py-16 px-[5%] font-sanss ">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center font-sanss text-3xl  text-[#f0ece4] mb-12"> WHAT OUR <span className=" font-bold text-[#C8A03C]">CLIENT </span>SAY? </div>

        {/* Scroll arrows */}
        {testimonials.length > 3 && (
          <div className="flex justify-end gap-2 mb-4">
            <button
              onClick={() => scroll("left")}
              disabled={!canLeft}
              className={`w-8 h-8 border flex items-center justify-center transition-colors bg-transparent cursor-pointer ${canLeft ? "border-[#C8A03C] text-[#C8A03C] hover:bg-[#C8A03C]/10" : "border-gray-700 text-gray-600"}`}
            >‹</button>
            <button
              onClick={() => scroll("right")}
              disabled={!canRight}
              className={`w-8 h-8 border flex items-center justify-center transition-colors bg-transparent cursor-pointer ${canRight ? "border-[#C8A03C] text-[#C8A03C] hover:bg-[#C8A03C]/10" : "border-gray-700 text-gray-600"}`}
            >›</button>
          </div>
        )}

        {/* Cards */}
        {loading ? (
          <div className="flex gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="min-w-[260px] bg-[#1a1a1a] animate-pulse ">
                <div className="h-48 bg-gray-800" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-800 rounded w-1/3" />
                  <div className="h-3 bg-gray-800 rounded w-full" />
                  <div className="h-3 bg-gray-800 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : testimonials.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-10">No testimonials yet.</p>
        ) : (
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {testimonials.map((t, i) => (
              <div
                key={t._id}
                className="min-w-[260px] max-w-[260px] bg-[#111] rounded-lg flex-shrink-0 overflow-hidden"
                style={{ animation: `fadeInUp 0.4s ease ${i * 0.08}s both` }}
              >
                {/* Image */}
                {t.image ? (
                  <div className="h-48 overflow-hidden">
                    <img src={t.image} alt={t.clientName} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                ) : (
                  <div className="h-48 bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-600 text-4xl">🕰️</span>
                  </div>
                )}

                {/* Content */}
                <div className="p-4 text-center">
                  <Stars rating={t.rating} size="text-lg" />
                  <p className="text-gray-300 text-sm italic leading-relaxed mt-3 mb-4">
                    "{t.feedback}"
                  </p>
                  <p className="text-[#C8A03C] text-xs font-semibold">-{t.clientName}</p>
                  <p className="text-gray-500 text-[11px] mt-0.5">Sold via {t.soldVia}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}