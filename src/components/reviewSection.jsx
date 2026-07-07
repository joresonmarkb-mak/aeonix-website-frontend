import { useState, useEffect } from "react";
import API from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import ReviewModal from "./ReviewModal.jsx";

function Stars({ rating, size = "text-base" }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} className={`${size} ${s <= rating ? "text-[#C8A03C]" : "text-gray-200"}`}>★</span>
      ))}
    </div>
  );
}

export default function ReviewsSection({ productId, productName }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [total, setTotal] = useState(0);
  const [canReview, setCanReview] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await API.get(`/reviews/${productId}`);
      setReviews(res.data.reviews);
      setAvgRating(res.data.avgRating);
      setTotal(res.data.total);
    } catch { } finally { setLoading(false); }
  };

  const checkCanReview = async () => {
    if (!user) return;
    try {
      const res = await API.get(`/reviews/can-review/${productId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setCanReview(res.data.canReview);
      setOrderId(res.data.orderId);
    } catch { }
  };

  useEffect(() => {
    fetchReviews();
    checkCanReview();
  }, [productId, user]);

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#1a1410]">Customer Reviews</h2>
          {total > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <Stars rating={Math.round(avgRating)} />
              <span className="text-sm text-gray-500">{avgRating} out of 5 · {total} review{total !== 1 ? "s" : ""}</span>
            </div>
          )}
        </div>
        {canReview && (
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 bg-[#1a1410] text-[#C8A03C] text-xs font-bold tracking-[2px] uppercase hover:bg-[#2a2018] transition-colors border-none cursor-pointer"
          >
            Write a Review
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-gray-50 p-5 animate-pulse">
              <div className="h-3 bg-gray-200 rounded w-1/4 mb-3" />
              <div className="h-3 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-gray-50 p-10 text-center">
          <p className="text-3xl mb-3">⭐</p>
          <p className="text-gray-400 text-sm">No reviews yet. Be the first to review this watch!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map(review => (
            <div key={review._id} className="bg-gray-50 p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-bold text-[#1a1410]">{review.user?.name || "Customer"}</p>
                  <Stars rating={review.rating} size="text-sm" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Received: {new Date(review.timeReceived).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mt-2">{review.feedback}</p>
              {review.images?.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {review.images.map((img, i) => (
                    <img key={i} src={img} alt="" className="w-20 h-20 object-cover border border-gray-200" />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <ReviewModal
          productId={productId}
          productName={productName}
          orderId={orderId}
          onClose={() => setShowModal(false)}
          onSuccess={fetchReviews}
        />
      )}
    </div>
  );
}