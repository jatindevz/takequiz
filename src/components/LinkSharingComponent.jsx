import React, { useState, useEffect, useRef } from 'react';
import { FaCopy, FaCheck, FaLink } from 'react-icons/fa';

const LinkSharingComponent = ({link}) => {
    const [isCopied, setIsCopied] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const tooltipTimeout = useRef(null);
    const origin = window.location.origin;
    const copyToClipboard = () => {
        navigator.clipboard.writeText(link)
            .then(() => {
                setIsCopied(true);
                setShowTooltip(true);

                // Clear any existing timeout
                if (tooltipTimeout.current) {
                    clearTimeout(tooltipTimeout.current);
                }

                // Hide tooltip after 2 seconds
                tooltipTimeout.current = setTimeout(() => {
                    setShowTooltip(false);
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    };

    useEffect(() => {
        // Clear timeout on component unmount
        return () => {
            if (tooltipTimeout.current) {
                clearTimeout(tooltipTimeout.current);
            }
        };
    }, []);

    return (
        <div className="relative max-w-2xl w-full">
            <div
                className="flex justify-between items-center gap-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow hover:shadow-md cursor-pointer transition-all duration-300 group"
                onClick={copyToClipboard}
            >
                <div className="flex items-center gap-3 min-w-0">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                        <FaLink className="text-blue-600 dark:text-blue-400 text-lg" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Share this quiz</p>
                        <p className="font-medium text-blue-600 dark:text-blue-400 truncate">
                            {`${link}`}
                        </p>
                    </div>
                </div>

                <button
                    className={`p-2 rounded-lg flex-shrink-0 transition-all ${isCopied
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400'
                        }`}
                    aria-label={isCopied ? "Copied!" : "Copy to clipboard"}
                >
                    {isCopied ? <FaCheck /> : <FaCopy />}
                </button>
            </div>

            {/* Tooltip */}
            {showTooltip && (
                <div className="absolute -top-10 right-0 bg-gray-800 text-white text-xs py-1.5 px-3 rounded-lg shadow-lg animate-fade-in">
                    <div className="absolute bottom-0 right-3 -mb-1.5 w-3 h-3 bg-gray-800 transform rotate-45"></div>
                    Copied to clipboard!
                </div>
            )}

            {/* Success animation */}
            {/* {isCopied && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-green-500/10 backdrop-blur-sm rounded-lg w-full h-full flex items-center justify-center">
                        <div className="animate-ping absolute h-16 w-16 rounded-full bg-green-400/30"></div>
                        <div className="relative z-10 bg-green-100 dark:bg-green-900 p-3 rounded-full">
                            <FaCheck className="text-green-600 dark:text-green-400 text-xl" />
                        </div>
                    </div>
                </div>
            )} */}
        </div>
    );
};

// Add this to your global CSS for the animation
// @keyframes fadeIn {
//   from { opacity: 0; transform: translateY(5px); }
//   to { opacity: 1; transform: translateY(0); }
// }
// .animate-fade-in {
//   animation: fadeIn 0.3s ease-out forwards;
// }

export default LinkSharingComponent;