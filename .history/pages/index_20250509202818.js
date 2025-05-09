import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import { ChevronRightIcon, PlayIcon, InformationCircleIcon } from '@heroicons/react/24/solid';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Import CSS untuk slider
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
    
    // Tambahkan event listener untuk animasi parallax pada hero section
    const heroSection = document.querySelector('.hero-section');
    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY;
      if (heroSection) {
        heroSection.style.backgroundPosition = `center ${scrollPos * 0.5}px`;
      }
    });
    
    return () => {
      window.removeEventListener('scroll', () => {});
    };
  }, []);

  // Settings untuk slider kegiatan terbaru
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  // Data dummy untuk kegiatan
  const featuredActivities = [
    {
      id: 1,
      title: "Pendakian Gunung Semeru",
      image: "/semeru.jpg",
      description: "Pendakian ke puncak tertinggi di Pulau Jawa dengan ketinggian 3.676 mdpl.",
      category: "Pendakian"
    },
    {
      id: 2,
      title: "Susur Gua Jomblang",
      image: "/gua-jomblang.jpg",
      description: "Eksplorasi gua vertikal dengan fenomena cahaya surga di Yogyakarta.",
      category: "Caving"
    },
    {
      id: 3,
      title: "Arung Jeram Sungai Elo",
      image: "/rafting.jpg",
      description: "Petualangan menyusuri sungai dengan jeram kelas III-IV.",
      category: "Rafting"
    },
    {
      id: 4,
      title: "Rock Climbing Citatah",
      image: "/rock-climbing.jpg",
      description: "Pemanjatan tebing alam dengan berbagai jalur tantangan.",
      category: "Climbing"
    },
    {
      id: 5,
      title: "Hiking Gunung Rinjani",
      image: "/rinjani.jpg",
      description: "Trekking menuju Segara Anak dan puncak Rinjani di Lombok.",
      category: "Pendakian"
    },
    {
      id: 6,
      title: "Ekspedisi Goa Pindul",
      image: "/pindul.jpg",
      description: "Cave tubing di gua dengan formasi stalaktit dan stalakmit yang indah.",
      category: "Caving"
    },
  ];

  // Data dummy untuk kegiatan rescue
  const rescueOperations = [
    {
      id: 1,
      title: "Evakuasi Pendaki di Gunung Merapi",
      image: "/rescue1.jpg",
      date: "24 Mei 2023"
    },
    {
      id: 2,
      title: "Penyelamatan Korban Banjir di Garut",
      image: "/rescue2.jpg",
      date: "12 Februari 2023"
    },
    {
      id: 3,
      title: "Pencarian Orang Hilang di Hutan Bukit Lawang",
      image: "/rescue3.jpg",
      date: "5 Juli 2023"
    },
    {
      id: 4,
      title: "Evakuasi Korban Longsor Banjarnegara",
      image: "/rescue4.jpg",
      date: "18 Desember 2022"
    },
    {
      id: 5,
      title: "Misi SAR Pendaki Hilang di Gunung Gede",
      image: "/rescue5.jpg",
      date: "3 Agustus 2023"
    },
  ];

  return (
    <>
      <Head>
        <title>Astacala | Bank Data Kegiatan Alam Bebas</title>
        <meta name="description" content="Platform informasi kegiatan alam bebas dan penyelamatan oleh Astacala" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css" />
      </Head>

      <div className="bg-black text-white min-h-screen">
        <Header />

        {/* Hero Section - Netflix Style */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 1.2 }}
          className="hero-section relative w-full h-[80vh] bg-cover bg-center"
          style={{ backgroundImage: 'url("/bg-astacala.jpg")' }}
        >
          {/* Dark gradient overlay, more prominent at bottom - Netflix Style */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40"></div>
          
          {/* Hero Content */}
          <div className="container mx-auto px-6 relative h-full flex flex-col justify-center z-10">
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="max-w-3xl"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-2 text-white">Bank Data Astacala</h1>
              <div className="flex items-center space-x-2 mb-4">
                <span className="bg-red-600 text-white text-sm px-2 py-1 rounded">SEJAK 1990</span>
                <span className="border border-gray-400 text-gray-200 text-sm px-2 py-1 rounded">PETUALANGAN</span>
                <span className="border border-gray-400 text-gray-200 text-sm px-2 py-1 rounded">PENYELAMATAN</span>
              </div>
              <p className="text-xl text-gray-200 mb-8">
                Platform informasi lengkap tentang kegiatan alam bebas dan misi penyelamatan yang dilakukan oleh Tim Astacala di berbagai lokasi di Indonesia.
              </p>
              
              {/* Netflix-style buttons */}
              <div className="flex flex-wrap gap-4">
                <Link href="/activities" className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white text-lg font-semibold px-8 py-4 rounded-md transition-colors">
                  <PlayIcon className="w-6 h-6 mr-2" />
                  <span>Mulai Jelajahi</span>
                </Link>
                <Link href="/about" className="flex items-center justify-center bg-gray-700/80 hover:bg-gray-600 text-white text-lg font-semibold px-8 py-4 rounded-md transition-colors">
                  <InformationCircleIcon className="w-6 h-6 mr-2" />
                  <span>Tentang Kami</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Main Content Sections */}
        <main className="relative z-10 -mt-16 pb-20">
          {/* Kegiatan Alam Bebas Section */}
          <section className="mb-16 px-6">
            <div className="container mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Kegiatan Alam Bebas Terbaru</h2>
                <Link href="/activities" className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                  <span>Lihat Semua</span>
                  <ChevronRightIcon className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              {/* Netflix-style carousel */}
              <div className="netflix-slider">
                <Slider {...sliderSettings}>
                  {featuredActivities.map((activity) => (
                    <div key={activity.id} className="px-2">
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative overflow-hidden rounded-lg aspect-video bg-gray-800 cursor-pointer"
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10"></div>
                        <img 
                          src={activity.image} 
                          alt={activity.title} 
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                          <span className="inline-block bg-red-600 text-white text-xs px-2 py-1 rounded mb-2">{activity.category}</span>
                          <h3 className="text-lg font-bold text-white">{activity.title}</h3>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </section>

          {/* Rescue Operations Section */}
          <section className="mb-16 px-6">
            <div className="container mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Operasi Penyelamatan Terkini</h2>
                <Link href="/rescue-history" className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                  <span>Lihat Semua</span>
                  <ChevronRightIcon className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              {/* Netflix-style carousel for rescue operations */}
              <div className="netflix-slider">
                <Slider {...sliderSettings}>
                  {rescueOperations.map((operation) => (
                    <div key={operation.id} className="px-2">
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative overflow-hidden rounded-lg aspect-video bg-gray-800 cursor-pointer"
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10"></div>
                        <img 
                          src={operation.image} 
                          alt={operation.title} 
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                          <span className="inline-block bg-red-600 text-white text-xs px-2 py-1 rounded mb-2">{operation.date}</span>
                          <h3 className="text-lg font-bold text-white">{operation.title}</h3>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </section>

          {/* Fitur Aplikasi Section */}
          <section className="px-6">
            <div className="container mx-auto">
              <h2 className="text-2xl font-bold text-white mb-8">Fitur Utama</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Card untuk Kegiatan Alam Bebas */}
                <motion.div 
                  whileHover={{ y: -10 }}
                  className="bg-gray-900/80 backdrop-blur rounded-xl overflow-hidden border border-gray-800"
                >
                  <div className="h-40 bg-gradient-to-r from-red-700 to-red-900 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      <i className="fas fa-hiking text-6xl"></i>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-white">Katalog Kegiatan Alam Bebas</h3>
                    <p className="text-gray-400 mb-4">Akses informasi lengkap dan terperinci tentang berbagai kegiatan alam bebas yang dilakukan oleh tim Astacala.</p>
                    <Link href="/activities" className="text-red-500 hover:text-red-400 inline-flex items-center">
                      <span>Jelajahi Katalog</span>
                      <ChevronRightIcon className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </motion.div>

                {/* Card untuk Riwayat Rescue */}
                <motion.div 
                  whileHover={{ y: -10 }}
                  className="bg-gray-900/80 backdrop-blur rounded-xl overflow-hidden border border-gray-800"
                >
                  <div className="h-40 bg-gradient-to-r from-red-900 to-red-700 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      <i className="fas fa-life-ring text-6xl"></i>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-white">Riwayat Operasi Penyelamatan</h3>
                    <p className="text-gray-400 mb-4">Dapatkan informasi lengkap tentang berbagai kegiatan penyelamatan yang telah dilakukan oleh tim Astacala.</p>
                    <Link href="/rescue-history" className="text-red-500 hover:text-red-400 inline-flex items-center">
                      <span>Lihat Riwayat</span>
                      <ChevronRightIcon className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </motion.div>

                {/* Card untuk Peta Lokasi */}
                <motion.div 
                  whileHover={{ y: -10 }}
                  className="bg-gray-900/80 backdrop-blur rounded-xl overflow-hidden border border-gray-800"
                >
                  <div className="h-40 bg-gradient-to-r from-red-800 to-red-600 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      <i className="fas fa-map-marked-alt text-6xl"></i>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-white">Peta Interaktif</h3>
                    <p className="text-gray-400 mb-4">Akses peta interaktif yang menampilkan berbagai lokasi kegiatan alam bebas yang dapat Anda jelajahi.</p>
                    <Link href="/map" className="text-red-500 hover:text-red-400 inline-flex items-center">
                      <span>Buka Peta</span>
                      <ChevronRightIcon className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}