import React from 'react';

const Loader = ({ size = 'medium', color = 'primary', className = '' }) => {
    const sizeClasses = {
        small: 'w-5 h-5 border-2',
        medium: 'w-8 h-8 border-3',
        large: 'w-12 h-12 border-4',
        xl: 'w-16 h-16 border-4',
    };

    const colorClasses = {
        primary: 'border-t-[var(--color-accent)] border-r-[var(--color-secondary)]',
        white: 'border-t-white border-r-white/50',
    };

    const currentSize = sizeClasses[size] || sizeClasses.medium;
    const currentColor = colorClasses[color] || colorClasses.primary;

    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            {/* Outer Ring */}
            <div
                className={`${currentSize} rounded-full border-transparent ${currentColor} animate-spin`}
                style={{ animationDuration: '1s' }}
            ></div>

            {/* Inner Ring (for larger sizes) */}
            {(size === 'large' || size === 'xl') && (
                <div
                    className={`absolute ${size === 'xl' ? 'w-10 h-10' : 'w-8 h-8'} rounded-full border-2 border-transparent ${color === 'white' ? 'border-b-white/30' : 'border-b-[var(--color-accent-hover)]'} animate-spin`}
                    style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}
                ></div>
            )}
        </div>
    );
};

export default Loader;
