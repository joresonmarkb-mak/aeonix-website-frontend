import handshake from "../assets/icons/handshake.png";
import authentic from "../assets/icons/authentic.png";
import dollar from "../assets/icons/dollar.png";

const trustItems = [
  { icon: authentic, title: "Authenticity verified", desc: "Every watch sold is verified as a genuine, original Seiko — no replicas or franken-watches. If any item is later proven not authentic, the buyer gets a full refund." },
  { icon: handshake, title: "Warranty you can trust", desc: "Every pre-owned watch comes with a 1-month warranty covering movement and functionality. If the watch stops working properly or has a movement issue within 30 days of purchase." },
  { icon: dollar, title: "No hidden costs", desc: "What you see is what you pay. No surprise fees, no bait-and-switch pricing." },
];

// ── Trust Bar ─────────────────────────────────────────────
function TrustBar() {
  return (
    <section className="bg-[#0a0a0a] border-t border-[#C8A03C]/10 py-20 px-[5%] ">
      <div className="text-center font-sanss text-3xl  text-[#f0ece4] mb-12"> <span className=" font-bold text-[#C8A03C]">AEONIX </span>BUYER PROTECTION</div>
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-3 gap-8">
        {trustItems.map(item => (
          <div key={item.title} className="text-center font-sanss ">
            <img src={item.icon} alt={item.title} className="w-8 h-8 mx-auto mb-3 object-contain" />
            <h3 className="text-[#f0ece4] text-xl font-bold tracking-wide mb-1.5">{item.title}</h3>
            <p className="text-gray-600 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TrustBar;