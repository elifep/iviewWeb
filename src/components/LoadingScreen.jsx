import React from 'react';
const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
            <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-white text-lg font-semibold">Yükleniyor...</p>
            </div>
        </div>
    );
};
export default LoadingScreen;