import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import API from "../services/Api.js";

export default function EmailSubscription() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const recaptchaRef = useRef();

  const handleSubscribe = async () => {
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    if (!captchaToken) {
      setStatus("error");
      setMessage("Please complete the CAPTCHA.");
      return;
    }
    setLoading(true);
    try {
      const res = await API.post("/subscribers", { email, captchaToken });
      setStatus("success");
      setMessage(res.data.message);
      setEmail("");
      setCaptchaToken(null);
      recaptchaRef.current.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err.response?.data?.message || "Something went wrong.");
      recaptchaRef.current.reset();
      setCaptchaToken(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-24 px-[5%] bg-[#1a1410] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(https://res.cloudinary.com/dp3iviwzj/image/upload/v1789269925/Group_16_m3vvfi.png)" }}
      />
      <div className="relative max-w-7xl mx-auto flex justify-end">
        <div className="max-w-lg">
          <h2 className="text-[clamp(2rem,8vw,8rem)] md:text-5xl text-[#f0ece4] font-semibold leading-tight mb-5">
            JOIN THE AEONIX COMMUNITY FOR EXCLUSIVE ACCESS
          </h2>
          <p className="text-white text-base leading-relaxed mb-8">
            Be the first to know about our latest arrivals, exclusive offers, and style tips. Join our fashion community
          </p>

          <div className="flex">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => { setEmail(e.target.value); setStatus(null); }}
              onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
              className="border bg-white border-gray-300 px-3 py-2.5 text-sm w-full focus:outline-none focus:border-[#1a1410]"
            />
            <button
              onClick={handleSubscribe}
              disabled={loading || !captchaToken}
              className="px-5 py-2.5 bg-[#FAD136] text-[#1a1410] text-xs font-bold  tracking-[2px] font-sanss uppercase hover:bg-[#e6c97f] transition-colors border-none cursor-pointer disabled:opacity-60 whitespace-nowrap"
            >
              {loading ? "..." : "Subscribe"}
              
            </button>
          </div>

          {/* reCAPTCHA */}
          <div className="mt-3">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={token => setCaptchaToken(token)}
              onExpired={() => setCaptchaToken(null)}
              theme="dark"
            />
          </div>

          {status && (
            <p className={`text-xs mt-3 ${status === "success" ? "text-green-400" : "text-red-400"}`}>
              {status === "success" ? "✓" : "✕"} {message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}