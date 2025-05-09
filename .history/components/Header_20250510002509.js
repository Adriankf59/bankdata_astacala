import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-gray-800 bg-black">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-600">
            <circle cx="14" cy="14" r="14" fill="#2A0A0A"/>
            <path d="M8 19L14 7L20 19H8Z" fill="#DC2626"/>
          </svg>
          <span className="font-semibold text-lg text-white">Bank Data Astacala</span>
        </div>
        {/* Menu Navigasi */}
        <nav className="space-x-8 text-base text-gray-300">
          <Link href="/" className="hover:text-red-500 transition-colors">Home</Link>
          <Link href="/about" className="hover:text-red-500 transition-colors">About</Link>
          <Link href="/contact" className="hover:text-red-500 transition-colors">Contact</Link>
        </nav>
      </div>
    </header>
  );
}