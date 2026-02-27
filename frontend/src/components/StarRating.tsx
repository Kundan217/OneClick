import { useState } from 'react';

interface StarRatingProps {
    rating?: number;
    maxStars?: number;
    size?: 'sm' | 'md' | 'lg';
    interactive?: boolean;
    onRate?: (rating: number) => void;
    showValue?: boolean;
}

const StarRating = ({
    rating = 0,
    maxStars = 5,
    size = 'md',
    interactive = false,
    onRate,
    showValue = false,
}: StarRatingProps) => {
    const [hoverRating, setHoverRating] = useState(0);

    const sizeMap = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-7 h-7',
    };

    const textSizeMap = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    };

    const starSize = sizeMap[size];
    const activeRating = interactive ? (hoverRating || rating) : rating;

    const renderStar = (index: number) => {
        const fillPercentage = Math.min(Math.max(activeRating - index, 0), 1) * 100;
        const isFull = fillPercentage >= 100;
        const isPartial = fillPercentage > 0 && fillPercentage < 100;

        return (
            <span
                key={index}
                className={`relative inline-block ${starSize} ${interactive ? 'cursor-pointer' : ''}`}
                onMouseEnter={() => interactive && setHoverRating(index + 1)}
                onMouseLeave={() => interactive && setHoverRating(0)}
                onClick={() => interactive && onRate?.(index + 1)}
            >
                {/* Empty star */}
                <svg viewBox="0 0 24 24" className="absolute inset-0 w-full h-full text-gray-300" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {/* Filled star (clipped for partial) */}
                {(isFull || isPartial) && (
                    <svg
                        viewBox="0 0 24 24"
                        className="absolute inset-0 w-full h-full text-amber-400"
                        fill="currentColor"
                        style={isPartial ? { clipPath: `inset(0 ${100 - fillPercentage}% 0 0)` } : undefined}
                    >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                )}
            </span>
        );
    };

    return (
        <div className="flex items-center gap-1">
            <div className="flex items-center">
                {Array.from({ length: maxStars }, (_, i) => renderStar(i))}
            </div>
            {showValue && (
                <span className={`${textSizeMap[size]} font-semibold text-gray-700 ml-1`}>
                    {rating > 0 ? rating.toFixed(1) : ''}
                </span>
            )}
        </div>
    );
};

export default StarRating;
