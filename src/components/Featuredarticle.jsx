import { useState } from "react";

const articles = [
  {
    id: 1,
    author: "Mac Jar",
    date: "05 Sep 2026",
    title: "How to Adjust Your Automatic Watch?",
    image: "https://res.cloudinary.com/dp3iviwzj/image/upload/v1789177330/image_32_niaptr.png",
    content: {
      intro: "Automatic watches are self-winding timepieces powered by the movement of your wrist. Unlike quartz watches, they don't need batteries — but they do need occasional adjustment to keep accurate time.",
      sections: [
        {
          heading: "1. Setting the Time",
          body: "Pull the crown (the small knob on the side) to the second position. Rotate it clockwise or counter-clockwise to set the correct time. Always set the time moving forward — never backwards — as this can damage the movement.",
          tip: "Set the time when the watch shows 6:00 AM or PM to avoid date complications."
        },
        {
          heading: "2. Setting the Date",
          body: "Pull the crown to the first position (one click out). Rotate to advance the date. Make sure you're not setting the date between 9 PM and 3 AM — the date mechanism is engaged during this window and forcing it can damage the gears.",
          tip: "Always adjust the date during the day to be safe."
        },
        {
          heading: "3. Winding the Watch",
          body: "If your watch has stopped, wind it manually by pushing the crown in and rotating clockwise 30–40 times. This gives the mainspring enough power reserve to run for several hours.",
          tip: "Wear your watch daily for at least 8 hours to keep it wound automatically."
        },
        {
          heading: "4. Regulating Accuracy",
          body: "If your watch gains or loses time consistently, you may need a watchmaker to regulate it. Most automatics are accurate within ±10–15 seconds per day — this is normal. If it's off by more, bring it in for service.",
        },
      ],
      closing: "With proper care and regular use, your automatic watch can last generations. If you're unsure about any adjustment, visit a certified watchmaker."
    }
  },
  {
    id: 2,
    author: "Mac Jar",
    date: "05 Sep 2026",
    title: "Watch Size Guide: How to Choose the Right Size?",
    image: "https://res.cloudinary.com/dp3iviwzj/image/upload/v1789177330/image_35_pwzhj4.png",
    content: {
      intro: "Choosing the right watch size is about balance — between your wrist size, personal style, and the occasion. Here's how to find your perfect fit.",
      sizes: [
        { range: "34mm and below", label: "Small", desc: "Classic dress watches. Best for slim wrists under 6 inches." },
        { range: "36mm – 38mm", label: "Medium", desc: "Versatile and timeless. Suits most wrist sizes for formal and casual wear." },
        { range: "40mm – 42mm", label: "Standard", desc: "The sweet spot. Most popular size — works for everyday wear on medium to large wrists." },
        { range: "44mm – 46mm", label: "Large", desc: "Sport and dive watches. Best for wrists 7 inches and above." },
        { range: "47mm+", label: "Oversized", desc: "Bold statement pieces. Chunky and eye-catching — not for everyone." },
      ],
      tips: [
        "Measure your wrist with a tape measure or string.",
        "The watch case should not overhang the edges of your wrist.",
        "Thicker cases (12mm+) feel larger on the wrist even at the same diameter.",
        "For dress occasions, go smaller. For sport and casual, go larger.",
      ],
      closing: "There are no strict rules — wear what feels comfortable and looks proportional on your wrist. Try before you buy whenever possible."
    }
  },
  {
    id: 3,
    author: "Mac Jar",
    date: "05 Sep 2026",
    title: "How to Take Care of Your Watch?",
    image: "https://res.cloudinary.com/dp3iviwzj/image/upload/v1789177330/image_34_l9mhim.png",
    content: {
      intro: "A well-maintained watch can last decades — or even be passed down as an heirloom. These simple habits will keep your timepiece in excellent condition.",
      care: [
        {
          icon: "💧",
          title: "Water Resistance",
          body: "Check your watch's water resistance rating before exposing it to water. 30M = splash resistant only. 100M = swimming. 200M+ = diving. Never press buttons or open the crown underwater."
        },
        {
          icon: "🧹",
          title: "Cleaning",
          body: "Wipe your watch with a soft microfiber cloth after each wear to remove sweat and oils. For metal bracelets, use a soft brush with mild soapy water. Avoid chemical cleaners."
        },
        {
          icon: "🧲",
          title: "Avoid Magnets",
          body: "Keep your watch away from strong magnetic fields — speakers, laptop hinges, and phone cases can magnetize the movement and cause it to run fast or erratically."
        },
        {
          icon: "📦",
          title: "Storage",
          body: "Store your watch in a cool, dry place away from direct sunlight. Use a watch box or pouch to prevent scratches. For automatic watches, a watch winder keeps it running when not worn."
        },
        {
          icon: "🔧",
          title: "Servicing",
          body: "Mechanical watches should be serviced every 3–5 years. This includes cleaning, lubricating the movement, and replacing worn parts. Regular servicing prevents costly repairs later."
        },
      ],
      closing: "Treat your watch like the precision instrument it is. A little care goes a long way in preserving its beauty and accuracy."
    }
  },
];

// ── Article Modal ─────────────────────────────────────────
 function ArticleModal({ article, onClose }) {
  const { content } = article;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ animation: 'fadeIn 0.2s ease' }}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        style={{ animation: 'slideUp 0.3s ease' }}>

        {/* Hero image */}
        <div className="relative h-56 overflow-hidden">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <button onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-black/50 text-white flex items-center justify-center border-none cursor-pointer hover:bg-black/70 transition-colors text-lg">
            ×
          </button>
          <div className="absolute bottom-4 left-5 right-5">
            <p className="text-[10px] text-gray-300 mb-1">{article.author} · {article.date}</p>
            <h2 className="font-serif text-xl font-bold text-white leading-tight">{article.title}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-5">
          <p className="text-gray-600 text-sm leading-relaxed">{content.intro}</p>

          {/* Article 1 — How to Adjust */}
          {content.sections && content.sections.map((s, i) => (
            <div key={i} className="flex flex-col gap-2">
              <h3 className="font-bold text-[#1a1410] text-sm">{s.heading}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{s.body}</p>
              {s.tip && (
                <div className="flex gap-2 bg-[#C8A03C]/10 border-l-2 border-[#C8A03C] px-3 py-2">
                  <span className="text-[#C8A03C] text-sm">💡</span>
                  <p className="text-xs text-gray-600 italic">{s.tip}</p>
                </div>
              )}
            </div>
          ))}

          {/* Article 2 — Size Guide */}
          {content.sizes && (
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-[#1a1410] text-sm mb-2">Watch Size Reference</h3>
              {content.sizes.map((s, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-100">
                  <div className="w-24 flex-shrink-0">
                    <p className="text-xs font-bold text-[#1a1410]">{s.range}</p>
                    <span className="text-[10px] text-[#C8A03C] font-semibold uppercase">{s.label}</span>
                  </div>
                  <p className="text-xs text-gray-600">{s.desc}</p>
                </div>
              ))}
              <div className="mt-3">
                <h3 className="font-bold text-[#1a1410] text-sm mb-2">Quick Tips</h3>
                <ul className="flex flex-col gap-1.5">
                  {content.tips.map((t, i) => (
                    <li key={i} className="flex gap-2 text-xs text-gray-600">
                      <span className="text-[#C8A03C] font-bold flex-shrink-0">→</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Article 3 — Care Guide */}
          {content.care && (
            <div className="flex flex-col gap-3">
              {content.care.map((c, i) => (
                <div key={i} className="flex gap-3 bg-gray-50 p-4">
                  <span className="text-2xl flex-shrink-0">{c.icon}</span>
                  <div>
                    <h3 className="font-bold text-[#1a1410] text-sm mb-1">{c.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{c.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Closing */}
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-500 italic">{content.closing}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Article Card ──────────────────────────────────────────
function ArticleCard({ article, onClick, index }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer group"
      style={{ animation: `fadeInUp 0.5s ease ${index * 0.1}s both` }}
    >
      {/* Image */}
      <div className="overflow-hidden mb-4 aspect-[4/3]">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover  group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-[17px] text-gray-500 font-sanss">by {article.author}</p>
        <p className="text-[17px] text-gray-500 font-sanss">{article.date}</p>
      </div>

      {/* Title */}
      <h3 className="font-sanss  text-2xl  text-white leading-snug group-hover:text-[#C8A03C] transition-colors">
        {article.title}
      </h3>
    </div>
  );
}

// ── Main Section ──────────────────────────────────────────
export default function FeaturedArticles() {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <section className="bg-[#0a0a0a] py-16 px-[10%]">
        <div className="max-w-8xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="font-sanss text-2xl font-black text-white tracking-widest uppercase mb-2">
              Featured Articles
            </h2>
            <p className="font-sanss text-[#C8A03C] text-md hover:underline">Fun Facts</p>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {articles.map((article, i) => (
              <ArticleCard
                key={article.id}
                article={article}
                index={i}
                onClick={() => setSelected(article)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selected && (
        <ArticleModal article={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}