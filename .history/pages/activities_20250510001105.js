import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PlayIcon } from '@heroicons/react/24/solid';

const activities = [
  {
    title: 'Rock Climbing',
    image: '/rc.jpg',
    desc: 'Experience the thrill of climbing with breathtaking views from the top.',
    link: '/activities/rock-climbing',
    type: 'rock climbing',
    location: 'Bandung, Jawa Barat',
    difficulty: 'Menengah'
  },
  {
    title: 'Caving',
    image: '/caving.jpg',
    desc: 'Discover the hidden world beneath with our thrilling caving adventures.',
    link: '/activities/caving',
    type: 'caving',
    location: 'Gunungkidul, Yogyakarta',
    difficulty: 'Menengah'
  },
  {
    title: 'Rafting',
    image: '/rafting.jpg',
    desc: 'Navigate wild rivers and enjoy the adrenaline rush with our rafting activities.',
    link: '/activities/rafting',
    type: 'rafting',
    location: 'Sungai Ayung, Bali',
    difficulty: 'Pemula'
  },
  {
    title: 'Diving',
    image: '/diving.jpg',
    desc: 'Explore underwater worlds and marine life with our diving experiences.',
    link: '/activities/diving',
    type: 'diving',
    location: 'Raja Ampat, Papua',
    difficulty: 'Menengah'
  },
  {
    title: 'Conservation',
    image: '/konservasi.jpg',
    desc: 'Join our conservation efforts to protect nature and wildlife.',
    link: '/activities/conservation',
    type: 'conservation',
    location: 'Taman Nasional Komodo',
    difficulty: 'Semua Level'
  },
  {
    title: 'Paralayang',
    image: '/paralayang.jpg',
    desc: 'Soar high and enjoy breathtaking views with our paragliding (paralayang) activities.',
    link: '/activities/paralayang',
    type: 'paralayang',
    location: 'Puncak, Bogor',
    difficulty: 'Lanjutan'
  },
];

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Caving', value: 'caving' },
  { label: 'Rock Climbing', value: 'rock climbing' },
  { label: 'Rafting', value: 'rafting' },
  { label: 'Diving', value: 'diving' },
  { label: 'Conservation', value: 'conservation' },
  { label: 'Paralayang', value: 'paralayang' },
];

export default function Activities() {
  const [selected, setSelected] = useState('all');
  const [isLoaded, setIsLoaded] = useState(false);
  const filtered = selected === 'all' ? activities : activities.filter(a => a.type === selected);
  
  // Feature activity (first item for hero section)
  const featuredActivity = activities[0];
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Variants for framer-motion animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <>
      <Head>
        <title>Kegiatan Alam Bebas | Astacala</title>
        <meta name="description" content="Jelajahi berbagai kegiatan alam bebas dengan Astacala" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css" />
      </Head>
    
      <div className="bg-black text-white min-h-screen">
        <Header />
        
        {/* Hero Section with Featured Activity - Netflix Style */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 1 }}
          className="w-full h-[70vh] relative"
          style={{ 
            backgroundImage: `url(${featuredActivity.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Dark gradient overlay - Netflix Style */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40"></div>
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 z-10">
            <div className="container mx-auto max-w-7xl">
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="max-w-2xl"
              >
                <span className="bg-red-600 text-white text-sm px-2 py-1 rounded mb-4 inline-block">
                  {featuredActivity.type.toUpperCase()}
                </span>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">{featuredActivity.title}</h1>
                <div className="flex flex-wrap items-center text-sm text-gray-300 mb-4 gap-4">
                  <span className="flex items-center">
                    <i className="fas fa-map-marker-alt mr-2"></i>
                    {featuredActivity.location}
                  </span>
                  <span className="flex items-center">
                    <i className="fas fa-signal mr-2"></i>
                    {featuredActivity.difficulty}
                  </span>
                </div>
                <p className="text-lg text-gray-200 mb-6">{featuredActivity.desc}</p>
                <div className="flex flex-wrap gap-4">
                  <Link href={featuredActivity.link} className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white text-lg font-semibold px-6 py-3 rounded-md transition-colors">
                    <PlayIcon className="w-5 h-5 mr-2" />
                    <span>Informasi Lengkap</span>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>
        
        <main className="relative -mt-20 pb-20 z-10">
          <div className="container mx-auto px-6">
            {/* Filter Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 mb-12 border border-gray-800"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Jelajahi Kegiatan
                </h2>
                <div className="flex flex-wrap gap-2">
                  {FILTERS.map(f => (
                    <button
                      key={f.value}
                      className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-300 ${
                        selected === f.value 
                          ? 'bg-red-600 text-white border-red-600' 
                          : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                      onClick={() => setSelected(f.value)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
            
            {/* Activities Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {filtered.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
                  <i className="fas fa-search text-5xl mb-4 text-gray-600"></i>
                  <p className="text-xl">Tidak ada kegiatan ditemukan</p>
                  <button 
                    onClick={() => setSelected('all')} 
                    className="mt-4 text-red-500 hover:text-red-400 underline"
                  >
                    Tampilkan semua kegiatan
                  </button>
                </div>
              ) : (
                filtered.map((activity, idx) => (
                  <motion.div
                    key={idx}
                    className="h-full"
                    variants={itemVariants}
                  >
                    <div className="bg-gray-900/80 backdrop-blur rounded-xl overflow-hidden border border-gray-800 h-full transition-all hover:shadow-lg hover:shadow-red-900/20 group">
                      {/* Image Container */}
                      <div className="relative h-[200px] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <img 
                          src={activity.image} 
                          alt={activity.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                          <Link 
                            href={activity.link}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300"
                          >
                            <PlayIcon className="w-6 h-6" />
                          </Link>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-white group-hover:text-red-500 transition-colors">
                            {activity.title}
                          </h3>
                          <span className="bg-red-600/80 text-white text-xs px-2 py-1 rounded">
                            {activity.difficulty}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-400 mb-4">
                          {activity.desc}
                        </p>
                        
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-xs text-gray-500 flex items-center">
                            <i className="fas fa-map-marker-alt mr-1"></i>
                            {activity.location}
                          </span>
                          
                          <Link 
                            href={activity.link} 
                            className="text-red-500 text-sm font-medium hover:text-red-400 transition-colors flex items-center"
                          >
                            Detail
                            <i className="fas fa-chevron-right ml-1 text-xs"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}