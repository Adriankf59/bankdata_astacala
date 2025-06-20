import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Check initial scroll position
    handleScroll();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`border-b sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-black/60 backdrop-blur-md border-gray-800/50 shadow-lg' 
        : 'bg-black border-gray-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <img 
              src="/favicon.ico" 
              alt="Astacala Logo" 
              width="28" 
              height="28"
              className="transition-transform group-hover:scale-110"
            />
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
            className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-300"
            aria-label="Toggle menu"
          >
            <svg 
              className={`h-6 w-6 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}
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

        {/* Mobile Menu with Smooth Animation */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="mt-4 pb-3 border-t border-gray-800 pt-4">
            <div className="flex flex-col space-y-1">
              <Link 
                href="/" 
                className="text-gray-300 hover:text-red-500 hover:bg-gray-900 px-3 py-2 rounded-md transition-all duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <i className="fas fa-home w-5"></i>
                  <span>Home</span>
                </div>
              </Link>
              <Link 
                href="/activities" 
                className="text-gray-300 hover:text-red-500 hover:bg-gray-900 px-3 py-2 rounded-md transition-all duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <i className="fas fa-hiking w-5"></i>
                  <span>Activities</span>
                </div>
              </Link>
              <Link 
                href="/rescue-history" 
                className="text-gray-300 hover:text-red-500 hover:bg-gray-900 px-3 py-2 rounded-md transition-all duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <i className="fas fa-life-ring w-5"></i>
                  <span>Rescue History</span>
                </div>
              </Link>
              <Link 
                href="/about" 
                className="text-gray-300 hover:text-red-500 hover:bg-gray-900 px-3 py-2 rounded-md transition-all duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <i className="fas fa-info-circle w-5"></i>
                  <span>About</span>
                </div>
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-300 hover:text-red-500 hover:bg-gray-900 px-3 py-2 rounded-md transition-all duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <i className="fas fa-envelope w-5"></i>
                  <span>Contact</span>
                </div>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}