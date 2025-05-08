import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main className="bg-[#f6f6f6] min-h-screen flex flex-col justify-between">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto mt-10 mb-12 p-10 rounded-2xl bg-[#171717] text-white shadow-lg flex flex-col gap-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Selamat Datang di Bank Data Astacala</h1>
          <p className="text-lg md:text-xl mb-6">Platform ini menyediakan informasi lengkap tentang kegiatan alam bebas dan penyelamatan yang dilakukan oleh Astacala. Jelajahi berbagai destinasi dan kegiatan menarik untuk pengalaman yang tak terlupakan.</p>
          <Link href="/map" className="inline-block bg-[#ff5722] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#ff784e] transition-colors w-max">
            Jelajahi Peta Kegiatan Alam Bebas
          </Link>
        </section>

        {/* Fitur Utama */}
        <section className="max-w-7xl mx-auto w-full flex-1 flex items-center justify-center pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {/* Card untuk Kegiatan Alam Bebas */}
            <Link href="/activities" className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300 cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-green-500 outline-none">
              <div className="text-5xl mb-4 text-green-500">
                <i className="fas fa-hiking"></i>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Kegiatan Alam Bebas</h3>
              <p className="text-gray-600 mb-4">Temukan berbagai kegiatan alam bebas yang dapat Anda ikuti untuk pengalaman yang menantang dan menyenangkan.</p>
            </Link>

            {/* Card untuk Riwayat Rescue */}
            <Link href="/rescue-history" className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300 cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 outline-none">
              <div className="text-5xl mb-4 text-teal-500">
                <i className="fas fa-life-ring"></i>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Riwayat Kegiatan Rescue</h3>
              <p className="text-gray-600 mb-4">Dapatkan informasi lengkap tentang berbagai kegiatan penyelamatan yang telah dilakukan oleh tim Astacala.</p>
            </Link>

            {/* Card untuk Peta Lokasi */}
            <Link href="/map" className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300 cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-green-600 outline-none">
              <div className="text-5xl mb-4 text-green-600">
                <i className="fas fa-map-marked-alt"></i>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Peta Lokasi Kegiatan</h3>
              <p className="text-gray-600 mb-4">Akses peta interaktif yang menampilkan berbagai lokasi kegiatan alam bebas yang dapat Anda jelajahi.</p>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
