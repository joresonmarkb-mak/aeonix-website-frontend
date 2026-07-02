import { useState } from "react";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, googleProvider } from "../services/firebase.js";
import API from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

// ── Step indicators ───────────────────────────────────────
const steps = ["Account", "Profile", "Done"];

function StepBar({ step }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${i < step ? "bg-[#C8A03C] text-black" : i === step ? "bg-[#1a1410] text-[#C8A03C] border border-[#C8A03C]" : "bg-gray-200 text-gray-400"}`}>
            {i < step ? "✓" : i + 1}
          </div>
          <span className={`text-[10px] tracking-[1px] uppercase ${i === step ? "text-[#1a1410] font-bold" : "text-gray-400"}`}>{s}</span>
          {i < steps.length - 1 && <div className={`w-8 h-px ${i < step ? "bg-[#C8A03C]" : "bg-gray-200"}`} />}
        </div>
      ))}
    </div>
  );
}

// ── Input ─────────────────────────────────────────────────
function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] tracking-[1.5px] uppercase text-gray-500">{label}</label>
      <input
        {...props}
        className="border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a1410] transition-colors"
      />
    </div>
  );
}

// ── Google Button ─────────────────────────────────────────
function GoogleBtn({ onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 border border-gray-200 py-2.5 text-sm font-medium hover:border-[#1a1410] transition-colors bg-white cursor-pointer disabled:opacity-50"
    >
      <svg width="18" height="18" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      </svg>
      Continue with Google
    </button>
  );
}

// ── Auth Modal ────────────────────────────────────────────
 function AuthModal({ onClose, defaultTab = "login" }) {
  const { login } = useAuth();
  const [tab, setTab] = useState(defaultTab); // login | register | verify | profile
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [firebaseUser, setFirebaseUser] = useState(null);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState({
    name: "", phone: "", street: "", city: "", province: "", postalCode: "",
  });

  const clearError = () => setError("");

  // ── Login ───────────────────────────────────────────────
  const handleLogin = async () => {
    if (!email || !password) return setError("Please fill in all fields.");
    setLoading(true); clearError();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (!result.user.emailVerified) {
        return setError("Please verify your email before logging in.");
      }
      const token = await result.user.getIdToken();
      await API.post("/auth/firebase-login", { token });
      const user = {
        name: result.user.displayName || email.split("@")[0],
        email: result.user.email || email,
        role: "customer",
        token,
      };
      login({ name: user.name, email: user.email, role: user.role, token: user.token });
      onClose();
    } catch (err) {
      setError(err.code === "auth/invalid-credential" ? "Invalid email or password." : err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Register step 1 ─────────────────────────────────────
  const handleRegister = async () => {
    if (!email || !password) return setError("Please fill in all fields.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true); clearError();
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(result.user);
      setFirebaseUser(result.user);
      setTab("verify");
      setStep(1);
    } catch (err) {
      setError(err.code === "auth/email-already-in-use" ? "Email already registered." : err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Check verification ──────────────────────────────────
  const handleCheckVerified = async () => {
    setLoading(true); clearError();
    try {
      await firebaseUser.reload();
      if (firebaseUser.emailVerified) {
        setTab("profile");
        setStep(2);
      } else {
        setError("Email not verified yet. Check your inbox.");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Resend verification ─────────────────────────────────
  const handleResend = async () => {
    setLoading(true); clearError();
    try {
      await sendEmailVerification(firebaseUser);
      setError("Verification email resent!");
    } catch {
      setError("Couldn't resend. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Google sign-in ──────────────────────────────────────
  const handleGoogle = async () => {
    setLoading(true); clearError();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const isNew = GoogleAuthProvider.credentialFromResult(result);
      setFirebaseUser(result.user);
      setProfile(p => ({ ...p, name: result.user.displayName || "" }));
      if (isNew) {
        setTab("profile");
        setStep(2);
      } else {
        const token = await result.user.getIdToken();
        await API.post("/auth/firebase-login", { token });
        const user = {
          name: result.user.displayName || profile.name || "",
          email: result.user.email || "",
          role: "customer",
          token,
        };
        login({ name: user.name, email: user.email, role: user.role, token: user.token });
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Save profile ────────────────────────────────────────
  const handleSaveProfile = async () => {
    if (!profile.name || !profile.phone) return setError("Name and phone are required.");
    setLoading(true); clearError();
    try {
      const token = await firebaseUser.getIdToken();
      await API.post("/auth/firebase-register", {
        token,
        name: profile.name,
        phone: profile.phone,
        shippingAddress: {
          street: profile.street,
          city: profile.city,
          province: profile.province,
          postalCode: profile.postalCode,
          country: "Philippines",
        },
      });
      const user = {
        name: profile.name,
        email: firebaseUser.email,
        role: "customer",
        token,
      };
      login({ name: user.name, email: user.email, role: user.role, token: user.token });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => onClose()} />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-md shadow-2xl">
        {/* Close */}
        <button
          onClick={() => onClose()}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#1a1410] bg-transparent border-none cursor-pointer text-xl leading-none"
        >
          ×
        </button>

        <div className="p-8">
          {/* Logo */}
          <div className="flex justify-center ">
           <img src="https://res.cloudinary.com/dp3iviwzj/image/upload/v1782254317/png_iikwqh.png" alt="Aeonix Logo" className="h-40" />
          </div>

          {/* ── LOGIN ── */}
          {tab === "login" && (
            <>
              <h2 className="font-serif text-2xl font-bold text-[#1a1410] text-center mb-6">Welcome Back</h2>
              {error && <p className="text-red-500 text-xs text-center mb-4">{error}</p>}
              <div className="flex flex-col gap-3 mb-4">
                <Input label="Email" type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-3 bg-[#1a1410] text-[#C8A03C] text-xs font-bold tracking-[2px] uppercase hover:bg-[#2a2018] transition-colors border-none cursor-pointer disabled:opacity-50 mb-4"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <GoogleBtn onClick={handleGoogle} loading={loading} />
              <p className="text-center text-xs text-gray-500 mt-6">
                No account?{" "}
                <button onClick={() => { setTab("register"); clearError(); }} className="text-[#C8A03C] font-bold bg-transparent border-none cursor-pointer">
                  Register
                </button>
              </p>
            </>
          )}

          {/* ── REGISTER ── */}
          {tab === "register" && (
            <>
              <StepBar step={step} />
              <h2 className="font-serif text-2xl font-bold text-[#1a1410] text-center mb-6">Create Account</h2>
              {error && <p className="text-red-500 text-xs text-center mb-4">{error}</p>}
              <div className="flex flex-col gap-3 mb-4">
                <Input label="Email" type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                <Input label="Password" type="password" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full py-3 bg-[#1a1410] text-[#C8A03C] text-xs font-bold tracking-[2px] uppercase hover:bg-[#2a2018] transition-colors border-none cursor-pointer disabled:opacity-50 mb-4"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <GoogleBtn onClick={handleGoogle} loading={loading} />
              <p className="text-center text-xs text-gray-500 mt-6">
                Already have an account?{" "}
                <button onClick={() => { setTab("login"); clearError(); }} className="text-[#C8A03C] font-bold bg-transparent border-none cursor-pointer">
                  Sign In
                </button>
              </p>
            </>
          )}

          {/* ── VERIFY EMAIL ── */}
          {tab === "verify" && (
            <>
              <StepBar step={step} />
              <div className="text-center">
                <div className="text-5xl mb-4">📧</div>
                <h2 className="font-serif text-2xl font-bold text-[#1a1410] mb-3">Check Your Email</h2>
                <p className="text-gray-500 text-sm mb-2">We sent a verification link to:</p>
                <p className="text-[#1a1410] font-bold text-sm mb-6">{email}</p>
                {error && <p className={`text-xs text-center mb-4 ${error.includes("resent") ? "text-green-500" : "text-red-500"}`}>{error}</p>}
                <button
                  onClick={handleCheckVerified}
                  disabled={loading}
                  className="w-full py-3 bg-[#1a1410] text-[#C8A03C] text-xs font-bold tracking-[2px] uppercase hover:bg-[#2a2018] transition-colors border-none cursor-pointer disabled:opacity-50 mb-3"
                >
                  {loading ? "Checking..." : "I've Verified My Email"}
                </button>
                <button
                  onClick={handleResend}
                  disabled={loading}
                  className="w-full py-2 text-xs text-gray-500 hover:text-[#1a1410] bg-transparent border-none cursor-pointer transition-colors"
                >
                  Resend verification email
                </button>
              </div>
            </>
          )}

          {/* ── PROFILE SETUP ── */}
          {tab === "profile" && (
            <>
              <StepBar step={2} />
              <h2 className="font-serif text-2xl font-bold text-[#1a1410] text-center mb-2">Complete Your Profile</h2>
              <p className="text-center text-xs text-gray-400 mb-6">This helps us deliver your orders correctly.</p>
              {error && <p className="text-red-500 text-xs text-center mb-4">{error}</p>}
              <div className="flex flex-col gap-3 mb-6">
                <Input label="Full Name" type="text" placeholder="Juan dela Cruz" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
                <Input label="Phone Number" type="text" placeholder="+63XXXXXXXXXX" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-[10px] tracking-[1.5px] uppercase text-gray-400 mb-3">Shipping Address</p>
                  <div className="flex flex-col gap-3">
                    <Input label="Street" type="text" placeholder="123 Rizal Street" value={profile.street} onChange={e => setProfile(p => ({ ...p, street: e.target.value }))} />
                    <div className="grid grid-cols-2 gap-3">
                      <Input label="City" type="text" placeholder="Urdaneta" value={profile.city} onChange={e => setProfile(p => ({ ...p, city: e.target.value }))} />
                      <Input label="Province" type="text" placeholder="Pangasinan" value={profile.province} onChange={e => setProfile(p => ({ ...p, province: e.target.value }))} />
                    </div>
                    <Input label="Postal Code" type="text" placeholder="2428" value={profile.postalCode} onChange={e => setProfile(p => ({ ...p, postalCode: e.target.value }))} />
                  </div>
                </div>
              </div>
              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="w-full py-3 bg-[#1a1410] text-[#C8A03C] text-xs font-bold tracking-[2px] uppercase hover:bg-[#2a2018] transition-colors border-none cursor-pointer disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save & Continue"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;