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
    <div className="font-sans bg-[#0a0a0a]">
      <Navbar />

      <section className="py-24 px-[5%]">
        <div className="max-w-4xl mx-auto flex gap-16 center ">

          {/* Left — Contact Info */}
          <div className="flex-1">
            <h2 className="text-3xl font-black text-[#1a1410] tracking-tight mb-4">CONTACT US</h2>
            <p className="text-gray-500 text-sm leading-relaxed">San Vicente, Urdaneta City, 2428, Pangasinan,</p>
            <p className="text-gray-500 text-sm">Email: aeonixph@gmail.com</p>
            <p className="text-gray-500 text-sm">09454888915</p>
          </div>

  
          
            

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;