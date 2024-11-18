import React from 'react';

const ProgressBar = ({ progress }) => {
    const roundedProgress = Math.round(progress);
    
    return (
        <div className="w-full bg-gray-300 rounded-full h-4"> {/* max-w sınırlaması kaldırıldı */}
            <div
                className="bg-yellow-400 h-4 rounded-full flex items-center justify-center"
                style={{ width: `${roundedProgress}%` }}
            >
                <span className="text-black text-xs font-semibold">{roundedProgress}%</span>
            </div>
        </div>
    );
};

export default ProgressBar;
