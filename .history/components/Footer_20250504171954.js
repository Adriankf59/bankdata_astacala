export default function Footer() {
  return (
    <footer className="bg-[#181818] text-white py-4 border-t border-gray-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        <span className="text-xs md:text-sm"> 2025 Bank Data Astacala. Semua Hak Cipta Dilindungi.</span>
        <div className="flex gap-4 mt-2 md:mt-0">
          <a
            href="https://facebook.com/astacala"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400"
            aria-label="Facebook"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            href="https://twitter.com/astacala"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400"
            aria-label="Twitter"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="https://x.com/astacala"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400"
            aria-label="X"
          >
            <i className="fab fa-x-twitter"></i>
          </a>
          <a
            href="https://linkedin.com/company/astacala"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400"
            aria-label="LinkedIn"
          >
            <i className="fab fa-linkedin-in"></i>
          </a>
          <a
            href="https://instagram.com/astacala"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400"
            aria-label="Instagram"
          >
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}