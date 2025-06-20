import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import Head from 'next/head';
import { useState, useRef, useEffect } from 'react';

const activities = [
  {
    title: 'Rock Climbing',
    image: '/rc.jpg',
    desc: 'Experience the thrill of climbing with breathtaking views from the top.',
    link: '/activities/rock-climbing',
    type: 'rock climbing',
  },
  {
    title: 'Caving',
    image: '/caving.jpg',
    desc: 'Discover the hidden world beneath with our thrilling caving adventures.',
    link: '/activities/caving',
    type: 'caving',
  },
  {
    title: 'Rafting',
    image: '/rafting.jpg',
    desc: 'Navigate wild rivers and enjoy the adrenaline rush with our rafting activities.',
    link: '/activities/rafting',
    type: 'rafting',
  },
  {
    title: 'Diving',
    image: '/diving.jpg',
    desc: 'Explore underwater worlds and marine life with our diving experiences.',
    link: '/activities/diving',
    type: 'diving',
  },
  {
    title: 'Conservation',
    image: '/konservasi.jpg',
    desc: 'Join our conservation efforts to protect nature and wildlife.',
    link: '/activities/conservation',
    type: 'conservation',
  },
  {
    title: 'Paralayang',
    image: '/paralayang.jpg',
    desc: 'Soar high and enjoy breathtaking views with our paragliding (paralayang) activities.',
    link: '/activities/paralayang',
    type: 'paralayang',
  },
  {
    title: 'Diksar',
    image: '/diksar.jpg',
    desc: 'Pendidikan Dasar Astacala adalah tahapan awal yang harus dilalui oleh calon anggota untuk menjadi anggota resmi Astacala.',
    link: '/activities/diksar',
    type: 'diksar',
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
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const filterContainerRef = useRef(null);
  
  const filtered = selected === 'all' ? activities : activities.filter(a => a.type === selected);

  // Check scroll position for arrows
  const checkScroll = () => {
    if (filterContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = filterContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Scroll handlers
  const scrollLeft = () => {
    if (filterContainerRef.current) {
      filterContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (filterContainerRef.current) {
      filterContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  return (
    <>
      <Head>
        <title>Kegiatan Alam Bebas - Astacala</title>
        <meta name="description" content="Jelajahi berbagai kegiatan alam bebas Astacala: rock climbing, caving, rafting, diving, conservation, dan paralayang." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Header />
      <main className="bg-black min-h-screen flex flex-col justify-between relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 -left-4 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
            <div className="absolute top-40 -right-4 w-72 h-72 bg-red-600 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-40 w-72 h-72 bg-red-700 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-4 relative z-10">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                Kegiatan Alam Bebas Kami
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">
                Temukan petualangan yang sesuai dengan minat Anda
              </p>
            </div>
            
            {/* Filter Section with Scroll */}
            <div className="relative flex items-center">
              {/* Left Arrow */}
              {showLeftArrow && (
                <button
                  onClick={scrollLeft}
                  className="absolute left-0 z-20 bg-gradient-to-r from-black to-transparent pl-2 pr-4 h-full flex items-center lg:hidden"
                  aria-label="Scroll left"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              
              {/* Filter Container */}
              <div 
                ref={filterContainerRef}
                onScroll={checkScroll}
                className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth max-w-full lg:max-w-none"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <div className="flex gap-2 px-8 lg:px-0">
                  {FILTERS.map(f => (
                    <button
                      key={f.value}
                      className={`px-4 py-2 rounded-full font-semibold text-sm border transition-all duration-300 whitespace-nowrap transform hover:scale-105 ${
                        selected === f.value 
                          ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/30' 
                          : 'bg-gray-900/80 backdrop-blur-sm text-gray-300 border-gray-700 hover:bg-gray-800 hover:border-red-700'
                      }`}
                      onClick={() => setSelected(f.value)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Right Arrow */}
              {showRightArrow && (
                <button
                  onClick={scrollRight}
                  className="absolute right-0 z-20 bg-gradient-to-l from-black to-transparent pr-2 pl-4 h-full flex items-center lg:hidden"
                  aria-label="Scroll right"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Activities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filtered.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-16">
                <div className="text-6xl mb-4 opacity-20">🔍</div>
                <p className="text-lg">No activities found for this category.</p>
                <button 
                  onClick={() => setSelected('all')}
                  className="mt-4 text-red-500 hover:text-red-400 underline"
                >
                  Show all activities
                </button>
              </div>
            ) : (
              filtered.map((act, idx) => (
                <div 
                  key={idx} 
                  className="group bg-gray-900/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-md overflow-hidden hover:shadow-red-900/20 hover:shadow-xl transition-all duration-300 border border-gray-800 hover:border-gray-700 transform hover:-translate-y-1"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {/* Image Container */}
                  <div className="relative h-48 sm:h-52 w-full bg-gray-800 overflow-hidden">
                    <img 
                      src={act.image} 
                      alt={act.title} 
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    <h2 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                      {act.title}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-400 mb-4 flex-1 leading-relaxed">
                      {act.desc}
                    </p>
                    <Link 
                      href={act.link} 
                      className="inline-flex items-center text-red-500 text-sm font-semibold hover:text-red-400 transition-colors group/link"
                    >
                      <span className="mr-1">Learn More</span>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4 transform group-hover/link:translate-x-1 transition-transform" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* CSS for animations */}
        <style jsx>{`
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
          
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </main>
      <Footer />
    </>
  );
}