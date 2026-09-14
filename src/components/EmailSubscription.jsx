export default function EmailSubscription () {
  return (
    <section className="relative py-24  px-[5%] bg-[#1a1410] overflow-hidden font-sanss">
      <div
        className="absolute inset-0 bg-cover bg-center "
        style={{ backgroundImage: "url(https://res.cloudinary.com/dp3iviwzj/image/upload/v1789269925/Group_16_m3vvfi.png)" }}
      />
      <div className="relative max-w-7xl mx-auto flex justify-end">
        <div className="max-w-lg">          
          <h2 className="font-sanss text-5xl md:text-4xl text-[#f0ece4] font-semibold  leading-tight mb-5">
            JOIN THE AEONIX COMMUNITY FOR EXCLUSIVE ACCESS 
          </h2>
          <p className="text-white text-base leading-relaxed mb-8 ">
            Be the first to know about our latest arrivals, exclusive offers, and style tips. Join our fashion community
          </p>
          <div className="flex font-sanss ">
                <input
                  type="email"
                  placeholder="Email address"
                //   value={email}
                //   onChange={e => setEmail(e.target.value)}
                  className="border bg-white border-gray-300 px-3 py-2.5 text-sm w-full focus:outline-none focus:border-[#1a1410]"
                />
                <button className=" font-sanss px-5 py-2.5 bg-[#FAD136] text-[#1a1410] text-xs font-bold tracking-[2px] uppercase hover:bg-[#e6c97f] transition-colors border-none cursor-pointer">
                  Subscribe
                </button>
              </div>
              <div className="flex gap-3 mt-3">
              </div>
        </div>
      </div>
    </section>
  );
}
