import Link from 'next/link';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Head>
        <title>Bank Data Astacala - Platform Kegiatan Alam Bebas</title>
        <meta name="description" content="Platform informasi lengkap tentang kegiatan alam bebas dan penyelamatan Astacala. Jelajahi destinasi dan kegiatan menarik untuk pengalaman tak terlupakan." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="Bank Data Astacala" />
        <meta property="og:description" content="Platform kegiatan alam bebas dan penyelamatan Astacala" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://yourdomain.com" />
      </Head>

      <Header />
      <main className="bg-black min-h-screen flex flex-col justify-between relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="fixed inset-0 z-0">
          {/* Gradient mesh background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-red-600 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-red-700 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
          </div>
          
          {/* Subtle grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          ></div>
        </div>

        {/* Hero Section with Optimized Background */}
        <section className="relative w-full px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 lg:mt-10 mb-8 sm:mb-10 lg:mb-12 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="relative rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg overflow-hidden border border-gray-800 backdrop-blur-sm">
              {/* Background Image with lazy loading */}
              <div 
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{ 
                  backgroundImage: 'url("/bg-astacala.jpg")',
                  backgroundPosition: 'center',
                  backgroundSize: 'cover'
                }}
                aria-hidden="true"
              />
              
              {/* Gradient Overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70 z-10"></div>
              
              {/* Content with responsive padding and text */}
              <div className="relative z-20 px-6 py-12 sm:px-8 sm:py-16 md:px-10 md:py-20 lg:p-20 flex flex-col gap-4 text-white">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 leading-tight">
                  Selamat Datang di Bank Data Astacala
                </h1>
                <p className="text-base sm:text-lg md:text-xl mb-4 sm:mb-6 text-gray-300 max-w-3xl leading-relaxed">
                  Platform ini menyediakan informasi lengkap tentang kegiatan alam bebas dan penyelamatan yang dilakukan oleh Astacala. 
                  Jelajahi berbagai destinasi dan kegiatan menarik untuk pengalaman yang tak terlupakan.
                </p>
                <Link 
                  href="/map" 
                  className="inline-flex items-center bg-red-600 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 w-max group focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black"
                >
                  <span>Jelajahi Peta Kegiatan Alam Bebas</span>
                  <svg 
                    className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards Section */}
        <section className="flex-1 w-full px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {/* Card untuk Kegiatan Alam Bebas */}
              <Link 
                href="/activities" 
                className="group bg-gray-900/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-md p-6 sm:p-8 flex flex-col items-center text-center hover:shadow-red-900/20 hover:shadow-xl transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black border border-gray-800 hover:border-gray-700 transform hover:-translate-y-1"
              >
                <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 text-red-500 group-hover:scale-110 transition-transform duration-300">
                  <i className="fas fa-hiking"></i>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-white">
                  Kegiatan Alam Bebas
                </h3>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                  Temukan berbagai kegiatan alam bebas yang dapat Anda ikuti untuk pengalaman yang menantang dan menyenangkan.
                </p>
                <div className="mt-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm">Lihat Selengkapnya →</span>
                </div>
              </Link>

              {/* Card untuk Riwayat Rescue */}
              <Link 
                href="/rescue-history" 
                className="group bg-gray-900/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-md p-6 sm:p-8 flex flex-col items-center text-center hover:shadow-red-900/20 hover:shadow-xl transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black border border-gray-800 hover:border-gray-700 transform hover:-translate-y-1"
              >
                <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 text-red-500 group-hover:scale-110 transition-transform duration-300">
                  <i className="fas fa-life-ring"></i>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-white">
                  Riwayat Kegiatan Rescue
                </h3>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                  Dapatkan informasi lengkap tentang berbagai kegiatan penyelamatan yang telah dilakukan oleh tim Astacala.
                </p>
                <div className="mt-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm">Lihat Selengkapnya →</span>
                </div>
              </Link>

              {/* Card untuk Peta Lokasi */}
              <Link 
                href="/map" 
                className="group bg-gray-900/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-md p-6 sm:p-8 flex flex-col items-center text-center hover:shadow-red-900/20 hover:shadow-xl transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black border border-gray-800 hover:border-gray-700 transform hover:-translate-y-1 sm:col-span-2 lg:col-span-1"
              >
                <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 text-red-500 group-hover:scale-110 transition-transform duration-300">
                  <i className="fas fa-map-marked-alt"></i>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-white">
                  Peta Lokasi Kegiatan
                </h3>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                  Akses peta interaktif yang menampilkan berbagai lokasi kegiatan alam bebas yang dapat Anda jelajahi.
                </p>
                <div className="mt-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm">Lihat Selengkapnya →</span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* CSS for animations */}
        <style jsx global>{`
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }
          
          .animate-blob {
            animation: blob 7s infinite;
          }
          
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          
          @media (prefers-reduced-motion: reduce) {
            * {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}</style>
      </main>
      <Footer />
    </>
  );
}