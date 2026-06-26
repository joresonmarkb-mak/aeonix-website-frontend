import Footer from "../components/footer.jsx";
import Navbar from "../components/navbar.jsx";
import TrustBar from "../components/trustBar.jsx";





const Contact = () => {
  return (
    <div className="font-sans">
      <Navbar />
      
      <section className="py-24 px-[5%]">
        <div className="max-w-4xl mx-auto flex gap-16 items-start">

          {/* Left — Contact Info */}
          <div className="flex-1">
            <h2 className=" text-3xl font-black text-[#1a1410] tracking-tight mb-4">CONTACT US</h2>
            <p className="text-gray-500 text-sm leading-relaxed">San Vicente, Urdaneta City, 2428, Pangasinan,</p>
            <p className="text-gray-500 text-sm">Email: aeonixph@gmail.com</p>
            <p className="text-gray-500 text-sm">09454888915</p>
          </div>

          {/* Right — Form */}
          <div className="flex-1">
            <h2 className=" text-3xl font-black text-[#1a1410] tracking-tight mb-6">SEND US A MESSAGE</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Name"
                className="border border-gray-300 px-3 py-2.5 text-sm w-full focus:outline-none focus:border-[#1a1410]"
              />
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="Email address"
                  className="border border-gray-300 px-3 py-2.5 text-sm w-full focus:outline-none focus:border-[#1a1410]"
                />
                <input
                  type="text"
                  placeholder="Mobile number"
                  className="border border-gray-300 px-3 py-2.5 text-sm w-full focus:outline-none focus:border-[#1a1410]"
                />
              </div>
              <textarea
                placeholder="Message"
                rows={5}
                className="border border-gray-300 px-3 py-2.5 text-sm w-full focus:outline-none focus:border-[#1a1410] resize-none"
              />
              <button className="w-full py-3 bg-[#1a1410] text-white text-xs font-bold tracking-[3px] uppercase hover:bg-[#2a2018] transition-colors border-none cursor-pointer">
                SEND
              </button>
            </div>
          </div>

        </div>
      </section>
        <TrustBar />
      <Footer />
    </div>
  );
};
export default Contact