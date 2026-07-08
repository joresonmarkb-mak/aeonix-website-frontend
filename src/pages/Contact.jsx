import Footer from "../components/footer.jsx";
import Navbar from "../components/navbar.jsx";
import TrustBar from "../components/trustBar.jsx";
import { useState } from "react";
import { sendContactMessage } from "../services/Api.js";

const Contact = () => {
  const [name, setName] = useState("");       // ← was const{name, setName}
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!name || !email || !message || !phone) return;
    
    setLoading(true);
    setError("");
    
    try {
      await sendContactMessage({ name, email, phone, message });
      setSent(true);
      setName(""); 
      setEmail(""); 
      setPhone(""); 
      setMessage("");
      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans">
      <Navbar />

      <section className="py-24 px-[5%]">
        <div className="max-w-4xl mx-auto flex gap-16 items-start">

          {/* Left — Contact Info */}
          <div className="flex-1">
            <h2 className="text-3xl font-black text-[#1a1410] tracking-tight mb-4">CONTACT US</h2>
            <p className="text-gray-500 text-sm leading-relaxed">San Vicente, Urdaneta City, 2428, Pangasinan,</p>
            <p className="text-gray-500 text-sm">Email: aeonixph@gmail.com</p>
            <p className="text-gray-500 text-sm">09454888915</p>
          </div>

          {/* Right — Form */}
          <div className="flex-1">
            <h2 className="text-3xl font-black text-[#1a1410] tracking-tight mb-6">SEND US A MESSAGE</h2>

            {sent && (
              <p className="text-green-600 text-xs bg-green-50 px-3 py-2 mb-3">
                ✅ Message sent! We'll get back to you soon.
              </p>
            )}

            {error && (
              <p className="text-red-600 text-xs bg-red-50 px-3 py-2 mb-3">
                ❌ {error}
              </p>
            )}

            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="border border-gray-300 px-3 py-2.5 text-sm w-full focus:outline-none focus:border-[#1a1410]"
              />
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="border border-gray-300 px-3 py-2.5 text-sm w-full focus:outline-none focus:border-[#1a1410]"
                />
                <input
                  type="text"
                  placeholder="Mobile number"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="border border-gray-300 px-3 py-2.5 text-sm w-full focus:outline-none focus:border-[#1a1410]"
                />
              </div>
              <textarea
                placeholder="Message"
                rows={5}
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="border border-gray-300 px-3 py-2.5 text-sm w-full focus:outline-none focus:border-[#1a1410] resize-none"
              />
              <button
                onClick={handleSend}
                disabled={loading}
                className="w-full py-3 bg-[#1a1410] text-white text-xs font-bold tracking-[3px] uppercase hover:bg-[#2a2018] transition-colors border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "SENDING..." : "SEND"}
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

export default Contact;