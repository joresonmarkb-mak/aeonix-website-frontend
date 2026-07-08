import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../services/api.js";

function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] tracking-[1.5px] uppercase text-gray-500">{label}</label>
      <input
        {...props}
        className="border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a1410] transition-colors w-full disabled:bg-gray-50 disabled:text-gray-400"
      />
    </div>
  );
}

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function Profile() {
  const { user, login } = useAuth();
  const fileRef = useRef();

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    street: "",
    city: "",
    province: "",
    postalCode: "",
  });
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  const headers = { Authorization: `Bearer ${user?.token}` };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meRes, ordersRes] = await Promise.all([
          API.get("/auth/me", { headers }),
          API.get("/orders/mine", { headers }),
        ]);
        const me = meRes.data;
        setProfile({
          name: me.name || "",
          email: me.email || "",
          phone: me.phone || "",
          street: me.shippingAddresses?.[0]?.street || "",
          city: me.shippingAddresses?.[0]?.city || "",
          province: me.shippingAddresses?.[0]?.province || "",
          postalCode: me.shippingAddresses?.[0]?.postalCode || "",
        });
        if (me.avatar) setAvatarPreview(me.avatar);
        setOrders(ordersRes.data.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSaveProfile = async () => {
    setSaving(true); setError(""); setSuccess("");
    try {
      const data = new FormData();
      data.append("name", profile.name);
      data.append("phone", profile.phone);
      data.append("shippingAddress[street]", profile.street);
      data.append("shippingAddress[city]", profile.city);
      data.append("shippingAddress[province]", profile.province);
      data.append("shippingAddress[postalCode]", profile.postalCode);
      data.append("shippingAddress[country]", "Philippines");
      if (avatar) data.append("avatar", avatar);

      const res = await API.put("/auth/me", data, { headers });
      login({ ...user, name: res.data.name });
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError(""); setPasswordSuccess("");
    if (!passwords.new || !passwords.confirm) return setPasswordError("Please fill in all fields.");
    if (passwords.new !== passwords.confirm) return setPasswordError("Passwords do not match.");
    if (passwords.new.length < 6) return setPasswordError("Password must be at least 6 characters.");

    setSavingPassword(true);
    try {
      await API.put("/auth/me", { password: passwords.new }, { headers });
      setPasswords({ current: "", new: "", confirm: "" });
      setPasswordSuccess("Password changed successfully!");
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Failed to change password.");
    } finally {
      setSavingPassword(false);
    }
  };

  const tabs = ["profile", "password", "orders"];

  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-[5%] pt-28 pb-16">
        <p className="text-[#C8A03C] text-[11px] tracking-[4px] uppercase mb-2">My Account</p>
        <h1 className="font-serif text-3xl font-bold text-[#1a1410] mb-8">Profile</h1>

        {loading ? (
          <div className="bg-white p-8 animate-pulse">
            <div className="h-20 w-20 bg-gray-200 rounded-full mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/4" />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">

            {/* Left — Avatar + nav */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white p-6 flex flex-col items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-[#C8A03C]/10 flex items-center justify-center">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-serif text-3xl font-bold text-[#C8A03C]">
                        {profile.name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => fileRef.current.click()}
                    className="absolute bottom-0 right-0 w-7 h-7 bg-[#1a1410] text-white rounded-full flex items-center justify-center border-2 border-white cursor-pointer hover:bg-[#C8A03C] transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </div>

                <div className="text-center">
                  <p className="font-bold text-[#1a1410] text-sm">{profile.name}</p>
                  <p className="text-xs text-gray-400">{profile.email}</p>
                </div>

                {/* Tab nav */}
                <div className="w-full border-t border-gray-100 pt-4 flex flex-col gap-1">
                  {tabs.map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`w-full text-left px-3 py-2.5 text-xs font-semibold tracking-[1px] uppercase transition-colors rounded bg-transparent border-none cursor-pointer ${activeTab === tab ? "bg-[#1a1410] text-[#C8A03C]" : "text-gray-500 hover:text-[#1a1410]"}`}
                    >
                      {tab === "profile" ? "👤 Personal Info" : tab === "password" ? "🔒 Password" : "📦 Order History"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — Content */}
            <div className="flex-1">

              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="bg-white p-6 flex flex-col gap-5">
                  <h2 className="font-bold text-[#1a1410] text-sm tracking-wide">Personal Information</h2>

                  {success && <p className="text-green-600 text-xs bg-green-50 px-3 py-2">{success}</p>}
                  {error && <p className="text-red-500 text-xs bg-red-50 px-3 py-2">{error}</p>}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Full Name" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
                    <Input label="Email" value={profile.email} disabled />
                    <Input label="Phone Number" placeholder="+63XXXXXXXXXX" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[1.5px] mb-4">Shipping Address</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <Input label="Street" placeholder="123 Rizal Street" value={profile.street} onChange={e => setProfile(p => ({ ...p, street: e.target.value }))} />
                      </div>
                      <Input label="City" placeholder="Urdaneta" value={profile.city} onChange={e => setProfile(p => ({ ...p, city: e.target.value }))} />
                      <Input label="Province" placeholder="Pangasinan" value={profile.province} onChange={e => setProfile(p => ({ ...p, province: e.target.value }))} />
                      <Input label="Postal Code" placeholder="2428" value={profile.postalCode} onChange={e => setProfile(p => ({ ...p, postalCode: e.target.value }))} />
                      <Input label="Country" value="Philippines" disabled />
                    </div>
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="self-start px-8 py-3 bg-[#1a1410] text-[#C8A03C] text-xs font-bold tracking-[2px] uppercase hover:bg-[#2a2018] transition-colors border-none cursor-pointer disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}

              {/* Password Tab */}
              {activeTab === "password" && (
                <div className="bg-white p-6 flex flex-col gap-5">
                  <h2 className="font-bold text-[#1a1410] text-sm tracking-wide">Change Password</h2>

                  {passwordSuccess && <p className="text-green-600 text-xs bg-green-50 px-3 py-2">{passwordSuccess}</p>}
                  {passwordError && <p className="text-red-500 text-xs bg-red-50 px-3 py-2">{passwordError}</p>}

                  <div className="flex flex-col gap-4 max-w-sm">
                    <Input label="New Password" type="password" placeholder="Min. 6 characters" value={passwords.new} onChange={e => setPasswords(p => ({ ...p, new: e.target.value }))} />
                    <Input label="Confirm New Password" type="password" placeholder="Repeat new password" value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} />
                  </div>

                  <p className="text-xs text-gray-400">Note: If you signed in with Google, you may not be able to change your password here.</p>

                  <button
                    onClick={handleChangePassword}
                    disabled={savingPassword}
                    className="self-start px-8 py-3 bg-[#1a1410] text-[#C8A03C] text-xs font-bold tracking-[2px] uppercase hover:bg-[#2a2018] transition-colors border-none cursor-pointer disabled:opacity-50"
                  >
                    {savingPassword ? "Saving..." : "Change Password"}
                  </button>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div className="bg-white p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-[#1a1410] text-sm tracking-wide">Recent Orders</h2>
                    <Link to="/orders" className="text-xs text-[#C8A03C] hover:underline no-underline">View all →</Link>
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-3xl mb-3">📦</p>
                      <p className="text-gray-400 text-sm">No orders yet</p>
                    </div>
                  ) : (
                    orders.map(order => (
                      <div key={order._id} className="border border-gray-100 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-mono text-[#1a1410]">#{order._id.slice(-8).toUpperCase()}</p>
                          <span className={`text-[10px] font-bold tracking-[1px] uppercase px-2.5 py-1 rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex gap-2 mb-3">
                          {order.items.map((item, i) => (
                            <img
                              key={i}
                              src={item.image?.replace(/"/g, '') || "https://placehold.co/40x40?text=?"}
                              alt={item.name}
                              className="w-10 h-10 object-cover bg-gray-100"
                            />
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                          <p className="text-xs font-bold text-[#1a1410]">₱{order.totalAmount.toLocaleString()}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}