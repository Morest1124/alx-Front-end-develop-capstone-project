import React from 'react';
import Loader from './Loader';

const LoadingOverlay = ({ message = 'Loading...' }) => {
    return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="text-center">
                <Loader size="xl" />
                <p className="mt-4 text-lg font-medium text-gray-700">{message}</p>
            </div>
        </div>
    );
};

export default LoadingOverlay;
