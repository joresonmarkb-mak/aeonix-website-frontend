const trustItems = [
  { icon: "🛡️", title: "Authenticity Guaranteed", desc: "Every watch verified before listing" },
  { icon: "🚚", title: "Nationwide Delivery", desc: "Shipping across the Philippines" },
  { icon: "↩️", title: "7-Day Returns", desc: "Not satisfied? Send it back" },
  { icon: "📍", title: "Based in Urdaneta", desc: "2291 Bonifacio St, Pangasinan" },
];



// ── Trust Bar ─────────────────────────────────────────────
function TrustBar() {
  return (
    <section className="bg-[#0a0a0a] border-t border-[#C8A03C]/10 py-12 px-[5%]">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
        {trustItems.map(item => (
          <div key={item.title} className="text-center">
            <div className="text-3xl mb-3">{item.icon}</div>
            <h3 className="text-[#f0ece4] text-xs font-bold tracking-wide mb-1.5">{item.title}</h3>
            <p className="text-gray-600 text-xs">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TrustBar;