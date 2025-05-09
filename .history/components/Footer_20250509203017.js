import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-16 border-t border-gray-800">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Social links */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-white text-lg font-semibold mb-4">Astacala</h3>
            <div className="flex space-x-4 mb-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <i className="fab fa-facebook-f text-xl"></i>
                <span className="sr-only">Facebook</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <i className="fab fa-instagram text-xl"></i>
                <span className="sr-only">Instagram</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <i className="fab fa-twitter text-xl"></i>
                <span className="sr-only">Twitter</span>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <i className="fab fa-youtube text-xl"></i>
                <span className="sr-only">YouTube</span>
              </a>
            </div>
            <p className="text-sm">©{new Date().getFullYear()} Astacala. All Rights Reserved.</p>
          </div>

          {/* Navigation links */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4">Navigasi</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm hover:text-white transition-colors">Beranda</Link></li>
              <li><Link href="/activities" className="text-sm hover:text-white transition-colors">Kegiatan</Link></li>
              <li><Link href="/rescue-history" className="text-sm hover:text-white transition-colors">Rescue</Link></li>
              <li><Link href="/map" className="text-sm hover:text-white transition-colors">Peta</Link></li>
              <li><Link href="/about" className="text-sm hover:text-white transition-colors">Tentang Kami</Link></li>
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="text-sm hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4">Kontak</h3>
            <ul className="space-y-2">
              <li className="text-sm flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-2"></i>
                <span>Jl. Terusan Raya No. 123, Bandung, Jawa Barat, Indonesia</span>
              </li>
              <li className="text-sm flex items-center">
                <i className="fas fa-envelope mr-2"></i>
                <a href="mailto:info@astacala.org" className="hover:text-white transition-colors">info@astacala.org</a>
              </li>
              <li className="text-sm flex items-center">
                <i className="fas fa-phone mr-2"></i>
                <a href="tel:+6281234567890" className="hover:text-white transition-colors">+62 812-3456-7890</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section with app info */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-600">
          <p className="mb-2">Bank Data Astacala versi 1.0.0</p>
          <p>Developed with ❤️ in Bandung, Indonesia</p>
        </div>
      </div>
    </footer>
  );
}