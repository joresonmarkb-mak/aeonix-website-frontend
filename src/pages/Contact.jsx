import Footer from "../components/footer.jsx";
import Navbar from "../components/navbar.jsx";
import { useState } from "react";
import ig from '../assets/icons/ig.png';
import fb from '../assets/icons/fb.png';
import tiktok from '../assets/icons/tiktok.png';
import gmail from '../assets/icons/gmail.png';
import location from '../assets/icons/location.png';
import phone from '../assets/icons/phone.png';

const Contact = () => {

  const email = 'aeonixph@gmail.com';
  const fbpage = 'https://www.facebook.com/profile.php?id=61569961003531';
  const igpage = 'https://www.instagram.com/aeonixtimepiecesph/';
  const tiktokpage = 'https://www.tiktok.com/@aeonixph';
  const phonenumber = '+63 945 488 8915';
  const shoplocations = 'Pangasinan, Philippines';
  const [copiedField, setCopiedField] = useState(null);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch (err) {
      const textarea = document.createElement('textarea');
      textarea.value = email;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedField('email');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(phonenumber);
    } catch (err) {
      const textarea = document.createElement('textarea');
      textarea.value = phonenumber;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedField('phone');
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="font-sanss bg-[#0a0a0a]">
      <Navbar />

      <div className="relative h-[clamp(20rem,40vw,40rem)]">
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            backgroundImage:
              "url(https://res.cloudinary.com/dp3iviwzj/image/upload/v1789433160/Group_19_sohcfg.png)",
            backgroundSize: "100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-[clamp(1.5rem,5.3vw,4.2rem)] mt-[-30] font-bold text-white">CONTACT US</h1>
        </div>
      </div>

      <div className="bg-transparent px-[clamp(1rem,5vw,2.5rem)] py-[clamp(1.5rem,4vw,6rem)] flex flex-wrap items-center justify-center gap-x-[clamp(1.5rem,8vw,8rem)] gap-y-[clamp(1rem,3vw,2rem)]">

        {/* Location */}
        <a
          href={shoplocations}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-2 group"
        >
          <img src={location} alt="" className="w-[clamp(2rem,5vw,4rem)] h-[clamp(2rem,5vw,4rem)]" />
          <p className="text-white font-semibold text-[clamp(0.8rem,1.5vw,1rem)]">Location</p>
          <p className="text-neutral-400 text-[clamp(0.65rem,1.2vw,0.8rem)] group-hover:text-white transition-colors flex items-center gap-1">
            {shoplocations}
          </p>
        </a>

        {/* Phone */}
        <button
          type="button"
          onClick={handleCopyPhone}
          className="flex flex-col items-center gap-2 group focus:outline-none"
        >
          <div className="w-[clamp(2rem,5vw,4rem)] h-[clamp(2rem,5vw,4rem)] flex items-center justify-center">
            <img src={phone} alt="" className="w-full h-full object-contain" />
          </div>
          <p className="text-white font-semibold text-[clamp(0.8rem,1.5vw,1rem)]">Phone</p>
          <p className="text-neutral-400 text-[clamp(0.65rem,1.2vw,0.8rem)] group-hover:text-white transition-colors">
            {copiedField === 'phone' ? 'Copied!' : phonenumber}
          </p>
        </button>

        {/* email */}
        <button
          type="button"
          onClick={handleCopyEmail}
          className="flex flex-col items-center gap-2 group focus:outline-none"
        >
          <div className="w-[clamp(2rem,5vw,4rem)] h-[clamp(2rem,5vw,4rem)] rounded-md flex items-center justify-center">
            <img src={gmail} alt="" className="w-full h-full object-contain" />
          </div>
          <p className="text-white font-semibold text-[clamp(0.8rem,1.5vw,1rem)]">Gmail</p>
          <p className="text-neutral-400 text-[clamp(0.65rem,1.2vw,0.8rem)] group-hover:text-white transition-colors flex items-center gap-1">
            {copiedField === 'email' ? 'Copied!' : email}
          </p>
        </button>

      </div>

      <div className="text-white flex mt-[clamp(0.2rem,1.3vw,1.2rem)] justify-center text-[clamp(1rem,2.3vw,2rem)]">
        OUR SOCIALS
      </div>

      <div className="bg-transparent px-[clamp(1rem,5vw,2.5rem)] py-[clamp(1.5rem,4vw,2.5rem)] flex flex-wrap items-center justify-center gap-x-[clamp(1.5rem,8vw,8rem)] gap-y-[clamp(1rem,3vw,2rem)]">

        {/* Facebook */}
        <a
          href={fbpage}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-2 group"
        >
          <img src={fb} alt="" className="w-[clamp(2rem,5vw,4rem)] h-[clamp(2rem,5vw,4rem)]" />
          <p className="text-white font-semibold text-[clamp(0.8rem,1.5vw,1rem)]">Facebook</p>
          <p className="text-neutral-400 text-[clamp(0.65rem,1.2vw,0.8rem)] group-hover:text-white transition-colors flex items-center gap-1">
            View Our Facebook Page <span>↗</span>
          </p>
        </a>

        {/* Instagram */}
        <a
          href={igpage}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-2 group"
        >
          <div className="w-[clamp(2rem,5vw,4rem)] h-[clamp(2rem,5vw,4rem)] flex items-center justify-center">
            <img src={ig} alt="" className="w-full h-full object-contain" />
          </div>
          <p className="text-white font-semibold text-[clamp(0.8rem,1.5vw,1rem)]">Instagram</p>
          <p className="text-neutral-400 text-[clamp(0.65rem,1.2vw,0.8rem)] group-hover:text-white transition-colors flex items-center gap-1">
            View Our Instagram <span>↗</span>
          </p>
        </a>

        {/* TikTok */}
        <a
          href={tiktokpage}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-2 group"
        >
          <div className="w-[clamp(2rem,5vw,4rem)] h-[clamp(2rem,5vw,4rem)] rounded-md flex items-center justify-center">
            <img src={tiktok} alt="" className="w-full h-full object-contain" />
          </div>
          <p className="text-white font-semibold text-[clamp(0.8rem,1.5vw,1rem)]">TikTok</p>
          <p className="text-neutral-400 text-[clamp(0.65rem,1.2vw,0.8rem)] group-hover:text-white transition-colors flex items-center gap-1">
            View Our TikTok <span>↗</span>
          </p>
        </a>

      </div>

      <Footer />
    </div>
  );
};

export default Contact;