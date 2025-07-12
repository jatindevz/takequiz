'use client'
import React, { useState } from 'react';

const AuthPages = () => {
    const [isLogin, setIsLogin] = useState(true);

    // Empty functions for form submission
    const handleLogin = (e) => {
        e.preventDefault();
        // Login logic would go here
    };

    const handleRegister = (e) => {
        e.preventDefault();
        // Registration logic would go here
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
            {/* Navigation */}
            <div className="absolute top-6 left-6">
                <div className="flex items-center">
                    <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                        QuizMaster
                    </span>
                </div>
            </div>

            {/* Auth Container */}
            <div className="w-full max-w-md">
                {/* Toggle */}
                <div className="flex mb-8 bg-gray-800 rounded-lg p-1">
                    <button
                        className={`flex-1 py-3 rounded-md text-center font-medium transition-all ${isLogin
                                ? 'bg-gradient-to-r from-cyan-600/50 to-blue-600/50 text-white shadow-lg'
                                : 'text-gray-400 hover:text-white'
                            }`}
                        onClick={() => setIsLogin(true)}
                    >
                        Login
                    </button>
                    <button
                        className={`flex-1 py-3 rounded-md text-center font-medium transition-all ${!isLogin
                                ? 'bg-gradient-to-r from-cyan-600/50 to-blue-600/50 text-white shadow-lg'
                                : 'text-gray-400 hover:text-white'
                            }`}
                        onClick={() => setIsLogin(false)}
                    >
                        Register
                    </button>
                </div>

                {/* Login Form */}
                {isLogin ? (
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 shadow-xl">
                        <h2 className="text-2xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                            Welcome Back
                        </h2>

                        <form onSubmit={handleLogin}>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Email</label>
                                    <input
                                        type="email"
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-gray-400 text-sm">Password</label>
                                        <a href="#" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                                            Forgot?
                                        </a>
                                    </div>
                                    <input
                                        type="password"
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-cyan-500/20"
                                >
                                    Login
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 text-center text-gray-500 text-sm">
                            Don't have an account?{' '}
                            <button
                                onClick={() => setIsLogin(false)}
                                className="text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                                Register
                            </button>
                        </div>

                        
                    </div>
                ) : (
                    /* Register Form */
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 shadow-xl">
                        <h2 className="text-2xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                            Create Account
                        </h2>

                        <form onSubmit={handleRegister}>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Email</label>
                                    <input
                                        type="email"
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Password</label>
                                    <input
                                        type="password"
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-cyan-500/20"
                                >
                                    Create Account
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 text-center text-gray-500 text-sm">
                            Already have an account?{' '}
                            <button
                                onClick={() => setIsLogin(true)}
                                className="text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
          
        </div>
    );
};

export default AuthPages;