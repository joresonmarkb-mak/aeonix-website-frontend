import menWatch from "../assets/images/mens.png";
import womenWatch from "../assets/images/womens.png";

const categories = [
  {
    image: menWatch,
    eyebrow: "SEIKO",
    title: "Watches for Men",
  },
  {
    image: womenWatch,
    eyebrow: "SEIKO",
    title: "Watches for Women",
  },
];

// ── Category Split ────────────────────────────────────────
function CategorySplit() {
  return (
    <section className="bg-[#0a0a0a] py-8 px-[5%]">
      <div className="max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-2">
        {categories.map((cat, i) => (
          <div
            key={cat.title}
            className={`group relative h-[430px] overflow-hidden flex flex-col items-center justify-end pb-12 ${
              i === 0 ? "md:border-r border-black" : ""
            }`}
          >
            <div
              className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110"
              style={{
                backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.35) 100%), url(${cat.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <span className="relative text-[#C8A03C] text-[11px] font-semibold tracking-[0.15em] mb-2">
              {cat.eyebrow}
            </span>
            <h2 className="relative text-[#f0ece4] text-2xl md:text-3xl  tracking-wide mb-5">
              {cat.title}
            </h2>
            <button className="relative border border-[#f0ece4]/70 text-[#f0ece4] text-[11px] tracking-[0.1em] px-6 py-2.5 transition-colors duration-200 hover:bg-[#f0ece4] hover:text-black">
              VIEW MORE
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
 
export default CategorySplit;
 