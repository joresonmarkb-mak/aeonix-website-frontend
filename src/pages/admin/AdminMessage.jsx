import {useState, useEffect} from 'react';
import AdminLayout from './AdminLayout.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import API from '../../services/Api.js';

const statusColorsIsRead = {
  Read: "bg-green-100 text-black-700",
  Unread: "bg-red-100 text-black-700",

};

const statusColorsResponse = {
  Responded: "bg-green-100 text-black-700",
  NoResponse: "bg-red-100 text-black-700",
};

export default function AdminMessage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const headers = { Authorization: `Bearer ${user?.token}` };

  useEffect(() => {
    API.get('/messages/getAllMessages', { headers })
      .then(res => setMessages(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.token]);

  const handlesMessageIsRead = async (messageId, status) => {
    try {
        if(status){
            await API.put(`/messages/updateMessageIsRead/${messageId}`, { isRead: status }, { headers });
        setMessages(prevMessages =>
          prevMessages.map(item =>
            item._id === messageId ? { ...item, isRead: status } : item
          )
        );
        }
      
    } catch (error) {
      console.error("Error updating message status:", error);
    }
  };
  const updateMessageState = (messageId, updates) => {
    setMessages(prevMessages =>
      prevMessages.map(item =>
        item._id === messageId ? { ...item, ...updates } : item
      )
    );

    setSelected(prevSelected =>
      prevSelected && prevSelected._id === messageId
        ? { ...prevSelected, ...updates }
        : prevSelected
    );
  };

  const handlesMessageIsResponse = async (messageId, status) => {
    updateMessageState(messageId, { response: status });

    try {
      await API.put(`/messages/updateMessageResponse/${messageId}`, { response: status }, { headers });
    } catch (error) {
      updateMessageState(messageId, { response: !status });
      console.error("Error updating message status:", error);
    }
  };


  const handleMessageClick = (message) => {
    setSelected(message);

   
  };

  return (
    <AdminLayout>
      <div className="flex gap-6">
        <div className="flex-1 bg-white">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-[#1a1410]">All Messages ({messages.length})</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Sender</th>
                <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Phone Number</th>
                <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Status</th>
                <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Response</th>
                <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Date</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(message => (
                <tr
                  key={message._id}
                  className="border-b border-gray-100 cursor-pointer hover:bg-gray-50"
                  onClick={() => {handlesMessageIsRead(message._id, !message.isRead),handleMessageClick(message)}}
                >
                  <td className="px-5 py-3 text-sm text-[#1a1410]">{message.email}</td>
                  <td className="px-5 py-3 text-sm text-[#1a1410]">{message.phone}</td>
                  <td className="px-5 py-3 text-sm text-[#1a1410]">
                    {message.isRead ? (
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColorsIsRead.Read}`}>Read</span>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColorsIsRead.Unread}`}>Unread</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-sm text-[#1a1410]">{new Date(message.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-sm text-[#1a1410]">
                    {message.response ? (
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColorsResponse.Responded}`}>Responded</span>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColorsResponse.NoResponse}`}>No Response</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Detail panel */}
        {selected && (
          <div className="w-80 flex-shrink-0 bg-white h-fit sticky top-6">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-[#1a1410]">Review Detail</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 bg-transparent border-none cursor-pointer text-lg">×</button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div>
                  <p className="text-xs font-bold text-[#1a1410]">{selected.name || selected.email}</p>
                  <p className="text-xs text-gray-500">{selected.email}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-[1px] mb-1">Phone</p>
                <p className="text-xs font-semibold text-[#1a1410]">{selected.phone}</p>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-[1px] mb-1">Message</p>
                <p className="text-xs text-gray-600 leading-relaxed">{selected.message}</p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-[1px] mb-1">
                  <span>Response</span>
                  <input
                    type="checkbox"
                    checked={Boolean(selected.response)}
                    onChange={(e) => handlesMessageIsResponse(selected._id, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </label>
              </div>
              <div>
              </div>


             

             

             
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}