import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useInView } from 'react-intersection-observer';

// Sections data
const sections = [
  {
    id: "hero",
    title: "Astacala Expedition",
    subtitle: "Jelajahi Alam Indonesia",
    image: "/bg-astacala.jpg",
    darkOverlay: false,
    buttons: [
      {
        text: "Jelajahi Kegiatan",
        link: "/activities",
        primary: true
      },
      {
        text: "Tentang Kami",
        link: "/about",
        primary: false
      }
    ]
  },
  {
    id: "climbing",
    title: "Rock Climbing",
    subtitle: "Pengalaman naik tebing dengan pemandangan menakjubkan",
    image: "/rock-climbing.jpg",
    darkOverlay: true,
    buttons: [
      {
        text: "Detail Kegiatan",
        link: "/activities/rock-climbing",
        primary: true
      },
      {
        text: "Lihat Jadwal",
        link: "/schedule/rock-climbing",
        primary: false
      }
    ]
  },
  {
    id: "caving",
    title: "Caving",
    subtitle: "Jelajahi dunia bawah tanah yang menakjubkan",
    image: "/gua-jomblang.jpg",
    darkOverlay: true,
    buttons: [
      {
        text: "Detail Kegiatan",
        link: "/activities/caving",
        primary: true
      },
      {
        text: "Lihat Jadwal",
        link: "/schedule/caving",
        primary: false
      }
    ]
  },
  {
    id: "hiking",
    title: "Pendakian",
    subtitle: "Taklukkan puncak tertinggi di Indonesia",
    image: "/semeru.jpg",
    darkOverlay: true,
    buttons: [
      {
        text: "Detail Kegiatan",
        link: "/activities/hiking",
        primary: true
      },
      {
        text: "Lihat Jadwal",
        link: "/schedule/hiking",
        primary: false
      }
    ]
  },
  {
    id: "rafting",
    title: "Rafting",
    subtitle: "Rasakan sensasi adrenalin menyusuri sungai",
    image: "/rafting.jpg",
    darkOverlay: true,
    buttons: [
      {
        text: "Detail Kegiatan",
        link: "/activities/rafting",
        primary: true
      },
      {
        text: "Lihat Jadwal",
        link: "/schedule/rafting",
        primary: false
      }
    ]
  },
  {
    id: "rescue",
    title: "Tim Penyelamatan",
    subtitle: "Misi kemanusiaan dalam situasi darurat",
    image: "/rescue1.jpg",
    darkOverlay: true,
    buttons: [
      {
        text: "Riwayat Operasi",
        link: "/rescue-history",
        primary: true
      },
      {
        text: "Hubungi Tim SAR",
        link: "/contact",
        primary: false
      }
    ]
  }
];

// Navigation Component
const Navigation = ({ activeSection, darkMode, setMenuOpen, menuOpen }) => {
  return (
    <>
      {/* Desktop Navigation */}
      <header className={`fixed top-0 left-0 w-full z-40 transition-colors duration-500 ${darkMode ? 'text-white' : 'text-black'}`}>
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-2xl tracking-tighter">
            ASTACALA
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/activities" className="font-medium hover:opacity-70 transition-opacity">
              Kegiatan
            </Link>
            <Link href="/rescue-history" className="font-medium hover:opacity-70 transition-opacity">
              Rescue
            </Link>
            <Link href="/map" className="font-medium hover:opacity-70 transition-opacity">
              Peta
            </Link>
            <Link href="/about" className="font-medium hover:opacity-70 transition-opacity">
              Tentang
            </Link>
            <Link href="/contact" className="font-medium hover:opacity-70 transition-opacity">
              Kontak
            </Link>
          </nav>
          
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-xl leading-none"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-white z-30 pt-20 pb-6 px-6 md:hidden"
          >
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/activities" 
                className="py-3 px-4 font-medium text-xl border-b border-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                Kegiatan
              </Link>
              <Link 
                href="/rescue-history" 
                className="py-3 px-4 font-medium text-xl border-b border-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                Rescue
              </Link>
              <Link 
                href="/map" 
                className="py-3 px-4 font-medium text-xl border-b border-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                Peta
              </Link>
              <Link 
                href="/about" 
                className="py-3 px-4 font-medium text-xl border-b border-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                Tentang
              </Link>
              <Link 
                href="/contact" 
                className="py-3 px-4 font-medium text-xl"
                onClick={() => setMenuOpen(false)}
              >
                Kontak
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Section Component
const Section = ({ data, index, activeSection, setActiveSection }) => {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false
  });

  useEffect(() => {
    if (inView) {
      setActiveSection(index);
    }
  }, [inView, index, setActiveSection]);

  const isActive = activeSection === index;
  const isDark = data.darkOverlay;

  return (
    <section 
      id={data.id}
      ref={ref}
      className="relative w-full h-screen overflow-hidden snap-start flex flex-col justify-center items-center"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[3000ms] ease-out"
        style={{ 
          backgroundImage: `url(${data.image})`,
          transform: isActive ? 'scale(1.05)' : 'scale(1)'
        }}
      />
      
      {/* Overlay for darker images */}
      {isDark && (
        <div className="absolute inset-0 bg-black/30"></div>
      )}
      
      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 30 }}
          transition={{ duration: 0.8 }}
          className={`max-w-4xl mx-auto ${isDark ? 'text-white' : 'text-black'}`}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-2">{data.title}</h2>
          <p className="text-lg md:text-xl mb-10 opacity-90">{data.subtitle}</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            {data.buttons.map((button, btnIndex) => (
              <Link 
                key={btnIndex}
                href={button.link}
                className={`
                  py-3 px-10 rounded-md font-medium text-base md:text-lg transition-colors
                  ${button.primary 
                    ? isDark 
                      ? 'bg-white text-black hover:bg-gray-200' 
                      : 'bg-black text-white hover:bg-gray-800'
                    : isDark
                      ? 'bg-black/30 backdrop-blur-sm text-white border border-white hover:bg-black/50'
                      : 'bg-white/30 backdrop-blur-sm text-black border border-black hover:bg-white/50'
                  }
                `}
              >
                {button.text}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Down Arrow (only on first section) */}
      {index === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
          className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 ${isDark ? 'text-white' : 'text-black'}`}
        >
          <ArrowDownIcon className="w-8 h-8" />
        </motion.div>
      )}
    </section>
  );
};

// Footer Component
const Footer = ({ darkMode }) => (
  <footer className={`py-8 ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
    <div className="container mx-auto px-6 text-center">
      <div className="flex flex-wrap justify-center gap-6 mb-6">
        <Link href="/privacy" className="text-sm hover:underline">Kebijakan Privasi</Link>
        <Link href="/terms" className="text-sm hover:underline">Syarat & Ketentuan</Link>
        <Link href="/contact" className="text-sm hover:underline">Kontak</Link>
        <Link href="/careers" className="text-sm hover:underline">Karir</Link>
        <Link href="/news" className="text-sm hover:underline">Berita</Link>
      </div>
      <p className="text-sm opacity-70">© {new Date().getFullYear()} Astacala. Hak Cipta Dilindungi.</p>
    </div>
  </footer>
);

export default function Home() {
  const [activeSection, setActiveSection] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Use the current section's overlay setting to determine if navigation should be in dark mode
  const darkMode = sections[activeSection]?.darkOverlay ?? false;

  return (
    <>
      <Head>
        <title>Astacala | Ekspedisi & Petualangan Indonesia</title>
        <meta name="description" content="Jelajahi kegiatan alam bebas dan petualangan di Indonesia bersama Astacala" />
      </Head>

      {/* Main Container with Snap Scroll */}
      <div className="h-screen w-full overflow-auto snap-y snap-mandatory" style={{ scrollBehavior: 'smooth' }}>
        {/* Navigation */}
        <Navigation 
          activeSection={activeSection} 
          darkMode={darkMode} 
          setMenuOpen={setMenuOpen}
          menuOpen={menuOpen}
        />
        
        {/* Sections */}
        {sections.map((section, index) => (
          <Section
            key={section.id}
            data={section}
            index={index}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        ))}
        
        {/* Footer */}
        <Footer darkMode={sections[sections.length - 1]?.darkOverlay ?? false} />
      </div>
    </>
  );
}