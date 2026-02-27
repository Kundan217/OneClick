import { useState, useEffect } from 'react';
import { type Review } from '../types';
import StarRating from './StarRating';

const API_URL = 'http://localhost:5000';

interface ReviewSectionProps {
    productId: string;
}

const ReviewSection = ({ productId }: ReviewSectionProps) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [canReview, setCanReview] = useState(false);
    const [canReviewReason, setCanReviewReason] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [newRating, setNewRating] = useState(0);
    const [newTitle, setNewTitle] = useState('');
    const [newFeedback, setNewFeedback] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const isLoggedIn = !!userInfo.token;

    const fetchReviews = async () => {
        try {
            const res = await fetch(`${API_URL}/api/reviews/${productId}`);
            const data = await res.json();
            setReviews(data);
        } catch (err) {
            console.error('Error fetching reviews:', err);
        } finally {
            setLoading(false);
        }
    };

    const checkCanReview = async () => {
        if (!isLoggedIn) return;
        try {
            const res = await fetch(`${API_URL}/api/reviews/${productId}/can-review`, {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            });
            const data = await res.json();
            setCanReview(data.canReview);
            setCanReviewReason(data.reason || '');
        } catch (err) {
            console.error('Error checking review eligibility:', err);
        }
    };

    useEffect(() => {
        fetchReviews();
        checkCanReview();
    }, [productId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newRating === 0) {
            setError('Please select a star rating.');
            return;
        }
        if (!newFeedback.trim()) {
            setError('Please write your review.');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const res = await fetch(`${API_URL}/api/reviews/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
                body: JSON.stringify({ rating: newRating, title: newTitle, feedback: newFeedback }),
            });

            if (res.ok) {
                setSuccessMsg('✅ Review submitted successfully!');
                setNewRating(0);
                setNewTitle('');
                setNewFeedback('');
                setShowForm(false);
                setCanReview(false);
                setCanReviewReason('already_reviewed');
                await fetchReviews();
                setTimeout(() => setSuccessMsg(''), 3000);
            } else {
                const data = await res.json();
                setError(data.message || 'Failed to submit review.');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (reviewId: string) => {
        if (!confirm('Are you sure you want to delete your review?')) return;
        try {
            const res = await fetch(`${API_URL}/api/reviews/${reviewId}/delete`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${userInfo.token}` },
            });
            if (res.ok) {
                setCanReview(true);
                setCanReviewReason('');
                await fetchReviews();
            }
        } catch (err) {
            console.error('Error deleting review:', err);
        }
    };

    // Rating breakdown
    const getRatingBreakdown = () => {
        const breakdown = [0, 0, 0, 0, 0]; // 1★ to 5★
        reviews.forEach((r) => { breakdown[r.rating - 1]++; });
        return breakdown;
    };

    const breakdown = getRatingBreakdown();
    const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Find current user's review
    const myReview = reviews.find((r) => {
        const customer = JSON.parse(localStorage.getItem('userInfo') || '{}');
        return r.customerName === customer.name;
    });

    if (loading) {
        return (
            <div className="mt-16 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
                <div className="h-40 bg-gray-200 rounded mb-4"></div>
            </div>
        );
    }

    return (
        <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <span>⭐</span> Ratings & Reviews
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Rating Summary */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="text-center mb-6">
                        <p className="text-5xl font-extrabold text-gray-900">{avgRating > 0 ? avgRating.toFixed(1) : '—'}</p>
                        <div className="flex justify-center mt-2">
                            <StarRating rating={avgRating} size="lg" />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                        </p>
                    </div>

                    {/* Rating Bars */}
                    <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = breakdown[star - 1];
                            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                            return (
                                <div key={star} className="flex items-center gap-3 text-sm">
                                    <span className="w-6 text-right font-medium text-gray-600">{star}★</span>
                                    <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{
                                                width: `${percentage}%`,
                                                background: star >= 4 ? '#22c55e' : star === 3 ? '#f59e0b' : '#ef4444',
                                            }}
                                        ></div>
                                    </div>
                                    <span className="w-8 text-gray-500 text-xs">{count}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Write Review Button */}
                    <div className="mt-6">
                        {!isLoggedIn ? (
                            <p className="text-sm text-gray-500 text-center bg-gray-50 p-3 rounded-lg">
                                🔒 Login to write a review
                            </p>
                        ) : canReview ? (
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-semibold transition-colors"
                            >
                                ✍️ Write a Review
                            </button>
                        ) : canReviewReason === 'already_reviewed' ? (
                            <p className="text-sm text-green-600 text-center bg-green-50 p-3 rounded-lg">
                                ✅ You've reviewed this product
                            </p>
                        ) : canReviewReason === 'not_purchased' ? (
                            <p className="text-sm text-gray-500 text-center bg-gray-50 p-3 rounded-lg">
                                🛒 Purchase & receive this product to review
                            </p>
                        ) : null}
                    </div>
                </div>

                {/* Review Form + Review List */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Success Message */}
                    {successMsg && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium animate-fade-in">
                            {successMsg}
                        </div>
                    )}

                    {/* Review Form */}
                    {showForm && canReview && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Write Your Review</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Star Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating *</label>
                                    <div className="flex items-center gap-3">
                                        <StarRating rating={newRating} size="lg" interactive onRate={setNewRating} />
                                        {newRating > 0 && (
                                            <span className="text-sm font-medium text-amber-600">
                                                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][newRating]}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Review Title</label>
                                    <input
                                        type="text"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        placeholder="e.g. Great product, loved it!"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all"
                                    />
                                </div>

                                {/* Feedback */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Review *</label>
                                    <textarea
                                        value={newFeedback}
                                        onChange={(e) => setNewFeedback(e.target.value)}
                                        rows={4}
                                        placeholder="Share your experience with this product..."
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all resize-none"
                                    />
                                </div>

                                {error && <p className="text-red-500 text-sm">{error}</p>}

                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors"
                                    >
                                        {submitting ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setShowForm(false); setError(''); }}
                                        className="text-gray-500 hover:text-gray-700 px-4 py-2.5 font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Reviews List */}
                    {reviews.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                            <p className="text-6xl mb-4">📝</p>
                            <p className="text-gray-500 text-lg">No reviews yet. Be the first to review!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div
                                    key={review._id}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                {review.customerName?.charAt(0)?.toUpperCase() || '?'}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{review.customerName}</p>
                                                <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>
                                            </div>
                                        </div>
                                        {/* Check if it's the current user's review */}
                                        {myReview?._id === review._id && (
                                            <button
                                                onClick={() => handleDelete(review._id)}
                                                className="text-red-400 hover:text-red-600 text-xs font-medium transition-colors px-2 py-1 rounded hover:bg-red-50"
                                            >
                                                🗑️ Delete
                                            </button>
                                        )}
                                    </div>

                                    <div className="mt-3">
                                        <StarRating rating={review.rating} size="sm" />
                                    </div>

                                    {review.title && (
                                        <p className="mt-2 font-semibold text-gray-800">{review.title}</p>
                                    )}
                                    <p className="mt-1 text-gray-600 text-sm leading-relaxed">{review.feedback}</p>

                                    {/* Verified Purchase Badge */}
                                    <div className="mt-3 flex items-center gap-1">
                                        <span className="text-green-600 text-xs font-medium bg-green-50 px-2 py-0.5 rounded-full">
                                            ✓ Verified Purchase
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewSection;
