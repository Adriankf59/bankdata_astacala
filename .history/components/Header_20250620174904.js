import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-gray-800 bg-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <svg 
              width="28" 
              height="28" 
              viewBox="0 0 28 28" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              className="text-red-600 transition-transform group-hover:scale-110"
            >
              <circle cx="14" cy="14" r="14" fill="#2A0A0A"/>
              <path d="M8 19L14 7L20 19H8Z" fill="#DC2626"/>
            </svg>
            <span className="font-semibold text-base sm:text-lg text-white group-hover:text-red-500 transition-colors">
              Bank Data Astacala
            </span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-sm lg:text-base">
            <Link 
              href="/" 
              className="text-gray-300 hover:text-red-500 transition-colors duration-200 font-medium"
            >
              Home
            </Link>
            <Link 
              href="/activities" 
              className="text-gray-300 hover:text-red-500 transition-colors duration-200 font-medium"
            >
              Activities
            </Link>
            <Link 
              href="/rescue-history" 
              className="text-gray-300 hover:text-red-500 transition-colors duration-200 font-medium"
            >
              Rescue History
            </Link>
            <Link 
              href="/about" 
              className="text-gray-300 hover:text-red-500 transition-colors duration-200 font-medium"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-300 hover:text-red-500 transition-colors duration-200 font-medium"
            >
              Contact
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            <svg 
              className="h-6 w-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-3 border-t border-gray-800 pt-4">
            <div className="flex flex-col space-y-3">
              <Link 
                href="/" 
                className="text-gray-300 hover:text-red-500 hover:bg-gray-900 px-3 py-2 rounded-md transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/activities" 
                className="text-gray-300 hover:text-red-500 hover:bg-gray-900 px-3 py-2 rounded-md transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Activities
              </Link>
              <Link 
                href="/rescue-history" 
                className="text-gray-300 hover:text-red-500 hover:bg-gray-900 px-3 py-2 rounded-md transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Rescue History
              </Link>
              <Link 
                href="/about" 
                className="text-gray-300 hover:text-red-500 hover:bg-gray-900 px-3 py-2 rounded-md transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-300 hover:text-red-500 hover:bg-gray-900 px-3 py-2 rounded-md transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}