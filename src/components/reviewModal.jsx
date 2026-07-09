import { useState } from "react";
import API from "../services/Api.js";
import { useAuth } from "../context/AuthContext.jsx";

function StarRating({ rating, setRating }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          onClick={() => setRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="bg-transparent border-none cursor-pointer p-0 text-2xl transition-colors"
        >
          <span className={`${(hover || rating) >= star ? "text-[#C8A03C]" : "text-gray-300"}`}>★</span>
        </button>
      ))}
    </div>
  );
}

export default function ReviewModal({ productId, productName, orderId, onClose, onSuccess }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [timeReceived, setTimeReceived] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setPreviews(selected.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async () => {
    if (!rating) return setError("Please select a rating.");
    if (!feedback.trim()) return setError("Please write a feedback.");
    if (!timeReceived) return setError("Please enter when you received it.");

    setLoading(true);
    setError("");
    try {
      const data = new FormData();
      data.append("productId", productId);
      data.append("orderId", orderId);
      data.append("rating", rating);
      data.append("feedback", feedback);
      data.append("timeReceived", timeReceived);
      files.forEach(f => data.append("images", f));

      await API.post("/reviews", data, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-[#1a1410] text-sm">Write a Review</h2>
            <p className="text-xs text-gray-400 mt-0.5">{productName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-[#1a1410] bg-transparent border-none cursor-pointer text-xl">×</button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {error && <p className="text-red-500 text-xs">{error}</p>}

          {/* Star Rating */}
          <div>
            <label className="text-[10px] tracking-[1.5px] uppercase text-gray-500 block mb-2">Rating</label>
            <StarRating rating={rating} setRating={setRating} />
            <p className="text-xs text-gray-400 mt-1">
              {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
            </p>
          </div>

          {/* Feedback */}
          <div>
            <label className="text-[10px] tracking-[1.5px] uppercase text-gray-500 block mb-2">Feedback</label>
            <textarea
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder="Share your experience with this watch..."
              rows={4}
              className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a1410] resize-none"
            />
          </div>

          {/* Time Received */}
          <div>
            <label className="text-[10px] tracking-[1.5px] uppercase text-gray-500 block mb-2">Date & Time Received</label>
            <input
              type="datetime-local"
              value={timeReceived}
              onChange={e => setTimeReceived(e.target.value)}
              className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a1410]"
            />
          </div>

          {/* Images */}
          <div>
            <label className="text-[10px] tracking-[1.5px] uppercase text-gray-500 block mb-2">Photos (optional, max 3)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFiles}
              className="text-sm text-gray-500 w-full"
            />
            {previews.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {previews.map((p, i) => (
                  <img key={i} src={p} alt="" className="w-20 h-20 object-cover border border-gray-200" />
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-[#1a1410] text-[#C8A03C] text-xs font-bold tracking-[2px] uppercase hover:bg-[#2a2018] transition-colors border-none cursor-pointer disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
}