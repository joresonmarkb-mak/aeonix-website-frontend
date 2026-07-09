import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import API from "../../services/Api.js";

export default function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const headers = { Authorization: `Bearer ${user?.token}` };

  useEffect(() => {
    API.get("/users", { headers })
      .then(res => setUsers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    try {
      await API.delete(`/users/${id}`, { headers });
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch { }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4">

        <div className="flex items-center justify-between">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
              className="pl-8 pr-4 py-2 border border-gray-200 text-sm focus:outline-none focus:border-[#1a1410] w-64" />
          </div>
          <p className="text-xs text-gray-400">{users.length} total users</p>
        </div>

        <div className="bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">User</th>
                <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Phone</th>
                <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Role</th>
                <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Joined</th>
                <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td colSpan={5} className="px-5 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-400 text-sm">No users found</td></tr>
              ) : (
                filtered.map(u => (
                  <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#C8A03C]/10 flex items-center justify-center text-[#C8A03C] text-xs font-bold flex-shrink-0">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[#1a1410]">{u.name}</p>
                          <p className="text-[10px] text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-600">{u.phone || "—"}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] font-bold tracking-[1px] uppercase px-2 py-0.5 ${u.role === "admin" ? "bg-[#C8A03C]/10 text-[#C8A03C]" : "bg-gray-100 text-gray-500"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-400">{new Date(u.createdAt).toLocaleDateString('en-PH')}</td>
                    <td className="px-5 py-3">
                      {u._id !== user?._id && (
                        <button onClick={() => handleDelete(u._id)} className="text-xs text-red-400 hover:underline bg-transparent border-none cursor-pointer">
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}