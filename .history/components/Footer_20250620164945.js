import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black text-white border-t border-gray-800 relative z-40">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section - Takes more space */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 28 28" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                className="text-red-600"
              >
                <circle cx="14" cy="14" r="14" fill="#2A0A0A"/>
                <path d="M8 19L14 7L20 19H8Z" fill="#DC2626"/>
              </svg>
              <span className="font-semibold text-lg">Astacala</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Platform informasi kegiatan alam bebas dan operasi penyelamatan. 
              Dedikasi kami untuk keselamatan dan kemanusiaan.
            </p>
          </div>

          {/* Links Container - Spans 3 columns */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {/* Quick Links */}
              <div>
                <h3 className="font-semibold text-white mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="inline-block text-sm text-gray-400 hover:text-red-500 transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/activities" className="inline-block text-sm text-gray-400 hover:text-red-500 transition-colors">
                      Activities
                    </Link>
                  </li>
                  <li>
                    <Link href="/rescue-history" className="inline-block text-sm text-gray-400 hover:text-red-500 transition-colors">
                      Rescue History
                    </Link>
                  </li>
                  <li>
                    <Link href="/map" className="inline-block text-sm text-gray-400 hover:text-red-500 transition-colors">
                      Map
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="font-semibold text-white mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/about" className="inline-block text-sm text-gray-400 hover:text-red-500 transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="inline-block text-sm text-gray-400 hover:text-red-500 transition-colors">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="/join-us" className="inline-block text-sm text-gray-400 hover:text-red-500 transition-colors">
                      Join Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="inline-block text-sm text-gray-400 hover:text-red-500 transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="font-semibold text-white mb-4">Contact Info</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <i className="fas fa-envelope mt-0.5"></i>
                    <a href="mailto:info@astacala.org" className="inline-block hover:text-red-500 transition-colors break-all">
                      info@astacala.org
                    </a>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-phone mt-0.5"></i>
                    <a href="tel:+622112345678" className="inline-block hover:text-red-500 transition-colors">
                      +62 21 1234 5678
                    </a>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-map-marker-alt mt-0.5"></i>
                    <span>Band, Indonesia</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <span className="text-xs sm:text-sm text-gray-400 text-center sm:text-left pointer-events-auto">
              © {currentYear} Bank Data Astacala. Semua Hak Cipta Dilindungi.
            </span>

            {/* Social Media Links */}
            <div className="flex items-center gap-4 pointer-events-auto">
              <a
                href="https://facebook.com/astacala"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-gray-400 hover:text-red-500 transition-colors duration-200 text-lg p-1"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="https://twitter.com/astacala"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-gray-400 hover:text-red-500 transition-colors duration-200 text-lg p-1"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="https://instagram.com/astacala"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-gray-400 hover:text-red-500 transition-colors duration-200 text-lg p-1"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://linkedin.com/company/pmpaastacala"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-gray-400 hover:text-red-500 transition-colors duration-200 text-lg p-1"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a
                href="https://youtube.com/@PMPAAstacala"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-gray-400 hover:text-red-500 transition-colors duration-200 text-lg p-1"
                aria-label="YouTube"
              >
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}