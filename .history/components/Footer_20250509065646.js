export default function Footer() {
  return (
    <footer className="bg-black text-white py-4 border-t border-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        <span className="text-xs md:text-sm text-gray-300"> 2025 Bank Data Astacala. Semua Hak Cipta Dilindungi.</span>
        <div className="flex gap-4 mt-2 md:mt-0">
          <a
            href="https://facebook.com/astacala"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-500 transition-colors"
            aria-label="Facebook"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            href="https://twitter.com/astacala"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-500 transition-colors"
            aria-label="Twitter"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="https://x.com/astacala"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-500 transition-colors"
            aria-label="X"
          >
            <i className="fab fa-x-twitter"></i>
          </a>
          <a
            href="https://linkedin.com/company/astacala"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-500 transition-colors"
            aria-label="LinkedIn"
          >
            <i className="fab fa-linkedin-in"></i>
          </a>
          <a
            href="https://instagram.com/astacala"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-500 transition-colors"
            aria-label="Instagram"
          >
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}