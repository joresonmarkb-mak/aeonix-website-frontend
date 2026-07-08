import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TrustBar from "../components/trustBar";









const missions = [
  { num: "1", text: "To make quality timepieces accessible by offering authentic brand-new and pre-owned watches at affordable prices." },
  { num: "2", text: "To provide exceptional value by sourcing watches that are competitively priced, often below market value." },
  { num: "3", text: "To build trust among watch enthusiasts through honesty, transparency, and reliable customer service." },
  { num: "4", text: "To inspire a passion for horology by helping customers discover and appreciate timeless watch designs." },
  { num: "5", text: "To grow a community of collectors and first-time buyers who share our appreciation for craftsmanship, style, and timeless elegance." },
];

const brands = [
  {
    name: "https://res.cloudinary.com/dp3iviwzj/image/upload/v1782432285/Seiko-Logo_xmsmc6.png",
    logo: "https://res.cloudinary.com/dp3iviwzj/image/upload/v1782430384/0cbedf36-d185-42a9-8823-8156df76a609_xjnb6k.jpg",
    description: "Seiko is a renowned Japanese manufacturer of watches, clocks, and electronic devices. Founded in Tokyo in 1881, the brand is celebrated for its historic horological innovations, including the release of Japan's first wristwatch and the creation of the world's first commercial quartz watch. The First Japanese Wristwatch (1982) introduced the Laurel, Japan's first in-house wristwatch. Released the Seiko Astron, the first commercially available quartz wristwatch, which revolutionized global timekeeping.",
  },
  {
    name: "https://res.cloudinary.com/dp3iviwzj/image/upload/v1782432285/Citizen-logo_o1nlcq.png",
    logo: "https://res.cloudinary.com/dp3iviwzj/image/upload/v1782432229/db07214c-9f20-4a1c-8f77-1e7c17785f01_p1uo5i.jpg",
    description: "Citizen is a major Japanese manufacturer known for producing highly reliable, innovative timepieces for everyday wear, outdoor adventure, and luxury. Founded in 1918, the brand revolutionized watchmaking by pioneering light-powered movements and being the first to introduce titanium wristwatches. Beyond individual watches, the parent company (Citizen Watch Co.) owns several reliable Seiko and American watch brands, including Bulova, and produces precision machine tools and electronic equipment.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero — logo + about text */}
      <section className="bg-white pt-28 pb-16 px-[5%]">
        <div className="max-w-3xl mx-auto text-center">
          <img
            src="https://res.cloudinary.com/dp3iviwzj/image/upload/v1782254317/png_iikwqh.png"
            alt="Aeonix Logo"
            className="h-80 mx-auto mb-10"
          />
          <p className="text-gray-600 text-sm leading-relaxed">
            Founded in 2024 by three college students who share a passion for collecting and appreciating watches,
            AEONIX Timepieces was built on the belief that quality timepieces should be accessible to everyone.
            What started as a hobby quickly evolved into a mission to provide watch enthusiasts with authentic,
            stylish, and reliable watches at affordable prices. We specialize in both brand-new and pre-owned
            timepieces, offering carefully selected watches that are often priced below market value without
            compromising quality.
          </p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="bg-[#1a1410] py-16 px-[5%]">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#C8A03C] text-[11px] tracking-[4px] uppercase mb-8">OUR MISSION</p>
          <div className="flex flex-col gap-6">
            {missions.map(m => (
              <div key={m.num} className="flex gap-5 items-start">
                <span className="text-[#C8A03C] font-bold text-base w-5 flex-shrink-0">{m.num}</span>
                <p className="text-gray-300 text-sm leading-relaxed">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Brands */}
 <section className="bg-white py-16 px-[5%]">
  <div className="max-w-3xl mx-auto">
    <p className="text-[11px] tracking-[4px] uppercase text-gray-400 mb-12 text-center">OUR BRANDS</p>

    <div className="flex flex-col gap-16">
      {brands.map((brand, i) => (
        <div key={brand.name} className={`flex gap-10 items-center ${i % 2 !== 0 ? "flex-row" : "flex-row-reverse"}`}>

          {/* Image */}
          <div className="w-90 h-100 flex-shrink-0 overflow-hidden">
  <img src={brand.logo} alt={brand.name} className="w-full h-full object-cover scale-110" />
</div>

          {/* Text */}
          <div className={`flex flex-col flex-1 ${i % 2 !== 0 ? "items-end text-right" : "items-start text-left"}`}>
            <img src={brand.name} alt={brand.name} className="h-30 object-contain mb-5" />
            <p className="text-gray-500 text-sm leading-relaxed max-w-lg">
              {brand.description}
            </p>
            <a
              href="/allwatches"
              className="mt-6 inline-block px-8 py-2.5 bg-[#1a1410] text-[#C8A03C] text-xs font-bold tracking-[2px] uppercase hover:bg-[#2a2018] transition-colors no-underline"
            >
              Discover
            </a>
          </div>

        </div>
      ))}
    </div>
  </div>
</section>

      <TrustBar />
      <Footer />
    </div>
  );
}