import React, { useState } from 'react';
import { signOut } from 'next-auth/react';
import { FiLogOut } from 'react-icons/fi';

const LogoutBtn = () => {
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        try {
            await signOut({ callbackUrl: '/' });
        } catch (error) {
            console.error('Logout failed:', error);
            setLoading(false);
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50">
            <button
                onClick={handleLogout}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 rounded-lg shadow-md hover:bg-red-50 transition-all duration-200 border border-red-200 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
                {loading ? (
                    <>
                        <svg
                            className="animate-spin h-5 w-5 text-red-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="hidden sm:inline">Logging out...</span>
                    </>
                ) : (
                    <>
                        <FiLogOut className="text-lg group-hover:scale-110 transition-transform" />
                        <span className="hidden sm:inline">Logout</span>
                    </>
                )}
            </button>
        </div>
    );
};

export default LogoutBtn;