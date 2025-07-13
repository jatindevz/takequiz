'use client';
import Link from 'next/link';
import React, { useState } from 'react';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 border-b border-gray-700 shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              QuizMaster
            </span>
          </div>

          {/* Right Buttons (desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="px-4 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-cyan-600 to-blue-600 text-white transition-all duration-300 transform hover:scale-105 shadow-lg">
              Make Your Own Quiz
            </Link>
            <Link href="/login" className="px-4 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-800 transition-all duration-300 border border-gray-700 hover:border-cyan-500">
              Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              <div className="space-y-1 transform transition duration-300 ease-in-out">
                <div className={`w-6 h-0.5 bg-gray-400 transition duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-gray-400 transition duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}></div>
                <div className={`w-6 h-0.5 bg-gray-400 transition duration-300 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (dropdown) */}
      <div className={`md:hidden transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800">
          {['Home', 'About Us', 'Support Us', 'Make Your Own Quiz', 'Login'].map((item) => (
            <a
              key={item}
              href="#"
              className={`block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition duration-300 ${item === 'Make Your Own Quiz' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white' : ''
                }`}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;