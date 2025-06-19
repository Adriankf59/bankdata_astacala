import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import Head from 'next/head';
import { useState, useRef, useEffect } from 'react';

// Real data for rescue operations
const rescueOperations = [
  // SAR Operations
  {
    id: 1,
    title: "SAR Gunung Argopuro",
    date: "2000",
    location: "Gunung Argopuro, Jawa Timur",
    type: "sar",
    description: "Operasi pencarian pendaki yang hilang di kawasan Gunung Argopuro. Tim SAR Astacala bergabung dengan tim gabungan untuk menyisir area pegunungan.",
    team: "Tim SAR Astacala",
    casualties: "Data tidak tersedia",
    image: "/sar-mountain.jpg",
    details: "Gunung Argopuro terkenal dengan jalur pendakian panjangnya yang membutuhkan waktu 3-4 hari. Kondisi medan yang sulit dan cuaca ekstrem menjadi tantangan utama dalam operasi pencarian ini."
  },
  {
    id: 2,
    title: "SAR Gunung Cikuray",
    date: "2000",
    location: "Gunung Cikuray, Garut, Jawa Barat",
    type: "sar",
    description: "Operasi pencarian dan penyelamatan pendaki yang tersesat di kawasan hutan Gunung Cikuray saat kondisi cuaca buruk dan kabut tebal.",
    team: "Tim SAR Astacala",
    casualties: "Data tidak tersedia",
    image: "/sar-mountain.jpg",
    details: "Operasi SAR di Gunung Cikuray menghadapi tantangan berupa kabut tebal dan hujan lebat yang menghalangi visibilitas. Tim SAR menggunakan teknik navigasi khusus dan komunikasi radio untuk koordinasi antar tim."
  },
  {
    id: 3,
    title: "SAR Gunung Slamet",
    date: "2001",
    location: "Gunung Slamet, Jawa Tengah",
    type: "sar",
    description: "Pencarian pendaki yang hilang di jalur pendakian Gunung Slamet akibat kondisi kabut tebal dan cuaca buruk yang menurunkan visibilitas.",
    team: "Tim SAR Astacala",
    casualties: "Data tidak tersedia",
    image: "/sar-mountain.jpg",
    details: "Gunung Slamet adalah gunung berapi tertinggi di Jawa Tengah dengan jalur pendakian yang cukup menantang. Operasi pencarian melibatkan penyisiran area jalur pendakian dan area di luar jalur yang sering menjadi tempat pendaki tersesat."
  },
  {
    id: 4,
    title: "SAR Sungai Cikandang",
    date: "2011",
    location: "Sungai Cikandang, Jawa Barat",
    type: "sar",
    description: "Operasi pencarian korban hanyut di Sungai Cikandang setelah banjir bandang. Tim Astacala terlibat dalam pencarian di sepanjang aliran sungai.",
    team: "Tim SAR Air Astacala",
    casualties: "Data tidak tersedia",
    image: "/sar-river.jpg",
    details: "Operasi pencarian di sungai memerlukan keterampilan khusus dalam teknik water rescue. Tim menggunakan peralatan khusus seperti perahu karet dan pelampung untuk menyusuri aliran sungai yang masih deras pasca banjir."
  },
  {
    id: 5,
    title: "SAR Gunung Kendeng",
    date: "2013",
    location: "Gunung Kendeng, Jawa Barat",
    type: "sar",
    description: "Pencarian dan evakuasi pendaki yang mengalami cedera di jalur pendakian Gunung Kendeng yang terjal dan sulit diakses.",
    team: "Tim SAR Astacala",
    casualties: "Data tidak tersedia",
    image: "/sar-mountain.jpg",
    details: "Tim SAR Astacala melakukan evakuasi dengan teknik high-angle rescue untuk membawa korban yang mengalami cedera di area yang sulit dijangkau. Evakuasi membutuhkan koordinasi antar tim untuk memastikan keselamatan korban dan tim SAR."
  },
  
  // Disaster Response - Tsunami
  {
    id: 6,
    title: "Tanggap Bencana Tsunami Aceh",
    date: "2004-2005",
    location: "Aceh",
    type: "tsunami",
    description: "Tim Astacala terlibat dalam upaya tanggap bencana dan pemulihan pasca tsunami yang menghantam Aceh pada Desember 2004, salah satu bencana alam terburuk di Indonesia.",
    team: "Tim Gabungan Astacala",
    casualties: "Lebih dari 230.000 korban jiwa",
    image: "/tsunami-aceh.jpg",
    details: "Tim Astacala bergabung dengan relawan dari seluruh Indonesia untuk membantu korban tsunami. Kegiatan meliputi pencarian korban, distribusi bantuan, mendirikan tempat penampungan sementara, dan dukungan logistik untuk daerah yang terisolasi."
  },
  {
    id: 7,
    title: "Tanggap Bencana Tsunami Pangandaran",
    date: "2006",
    location: "Pangandaran, Jawa Barat",
    type: "tsunami",
    description: "Operasi tanggap darurat dan bantuan kemanusiaan untuk korban tsunami Pangandaran yang terjadi pada Juli 2006 akibat gempa bumi di lepas pantai selatan Jawa.",
    team: "Tim Tanggap Bencana Astacala",
    casualties: "Lebih dari 600 korban jiwa",
    image: "/tsunami-pangandaran.jpg",
    details: "Tim Astacala membantu evakuasi korban dan distribusi bantuan di kawasan wisata Pangandaran yang terdampak parah. Tim juga membantu dalam pencarian korban hilang dan koordinasi dengan tim SAR lainnya."
  },
  {
    id: 8,
    title: "Tanggap Bencana Tsunami Selat Sunda",
    date: "2018",
    location: "Banten dan Lampung",
    type: "tsunami",
    description: "Respons tanggap darurat untuk tsunami yang dipicu oleh letusan dan longsor bawah laut Gunung Anak Krakatau yang menghantam pesisir Banten dan Lampung.",
    team: "Tim Gabungan Astacala",
    casualties: "Lebih dari 400 korban jiwa",
    image: "/tsunami-selat-sunda.jpg",
    details: "Tim Astacala membantu evakuasi dan distribusi bantuan di daerah terdampak. Tantangan utama adalah area yang luas dan infrastruktur yang rusak. Tim juga terlibat dalam asesmen kerusakan untuk program rehabilitasi pasca bencana."
  },
  
  // Disaster Response - Earthquake
  {
    id: 9,
    title: "Tanggap Bencana Gempa Jogja dan Jawa Tengah",
    date: "2006",
    location: "Yogyakarta dan Jawa Tengah",
    type: "earthquake",
    description: "Operasi tanggap darurat pasca gempa berkekuatan 6.3 SR yang mengguncang Yogyakarta dan sekitarnya, menyebabkan kerusakan parah di beberapa kabupaten.",
    team: "Tim Tanggap Bencana Astacala",
    casualties: "Lebih dari 5.700 korban jiwa",
    image: "/earthquake-jogja.jpg",
    details: "Tim Astacala membantu evakuasi korban dari reruntuhan, mendirikan tempat pengungsian, dan distribusi bantuan. Tim juga membantu rehabilitasi awal dengan membangun hunian sementara bagi warga yang rumahnya hancur."
  },
  {
    id: 10,
    title: "Tanggap Bencana Gempa Padang",
    date: "2009",
    location: "Padang, Sumatera Barat",
    type: "earthquake",
    description: "Respons tanggap darurat untuk gempa berkekuatan 7.6 SR yang melanda Padang dan sekitarnya, menyebabkan kerusakan infrastruktur dan bangunan yang luas.",
    team: "Tim Tanggap Bencana Astacala",
    casualties: "Lebih dari 1.100 korban jiwa",
    image: "/earthquake-padang.jpg",
    details: "Tim Astacala terlibat dalam pencarian dan penyelamatan korban yang terjebak dalam reruntuhan. Tim juga membantu distribusi logistik dan pendirian tempat pengungsian di beberapa lokasi terdampak parah."
  },
  {
    id: 11,
    title: "Tanggap Bencana Gempa Mentawai",
    date: "2010",
    location: "Kepulauan Mentawai, Sumatera Barat",
    type: "earthquake",
    description: "Operasi tanggap darurat untuk gempa dan tsunami yang melanda Kepulauan Mentawai, daerah terpencil yang sulit dijangkau transportasi reguler.",
    team: "Tim Gabungan Astacala",
    casualties: "Lebih dari 400 korban jiwa",
    image: "/earthquake-mentawai.jpg",
    details: "Tantangan utama dalam operasi ini adalah akses yang sulit ke lokasi bencana. Tim Astacala bergabung dengan tim gabungan menggunakan kapal untuk mencapai pulau-pulau terdampak dan memberikan bantuan kemanusiaan."
  },
  {
    id: 12,
    title: "Tanggap Bencana Gempa Lombok",
    date: "2018",
    location: "Lombok, Nusa Tenggara Barat",
    type: "earthquake",
    description: "Respons tanggap darurat untuk rangkaian gempa besar yang mengguncang Lombok pada Juli-Agustus 2018, menyebabkan kerusakan luas terutama di Lombok Utara.",
    team: "Tim Tanggap Bencana Astacala",
    casualties: "Lebih dari 560 korban jiwa",
    image: "/earthquake-lombok.jpg",
    details: "Tim Astacala membantu evakuasi korban, distribusi bantuan, dan pendirian tempat pengungsian. Karakteristik unik operasi ini adalah menghadapi rangkaian gempa susulan yang terus terjadi selama beberapa minggu."
  },
  {
    id: 13,
    title: "Tanggap Bencana Gempa Cianjur",
    date: "2022",
    location: "Cianjur, Jawa Barat",
    type: "earthquake",
    description: "Operasi tanggap darurat untuk gempa berkekuatan 5.6 SR yang melanda Cianjur pada November 2022, menyebabkan kerusakan parah di beberapa kecamatan.",
    team: "Tim Tanggap Bencana Astacala",
    casualties: "Lebih dari 300 korban jiwa",
    image: "/earthquake-cianjur.jpg",
    details: "Tim Astacala terlibat dalam pencarian dan evakuasi korban dari reruntuhan, asesmen kerusakan, dan distribusi bantuan ke daerah-daerah terpencil yang sulit dijangkau. Tim juga membantu koordinasi relawan dan distribusi logistik."
  },
  
  // Disaster Response - Volcanic Eruption
  {
    id: 14,
    title: "Tanggap Bencana Erupsi Gunung Merapi",
    date: "2010",
    location: "Daerah sekitar Gunung Merapi, Yogyakarta dan Jawa Tengah",
    type: "volcano",
    description: "Operasi tanggap darurat untuk erupsi besar Gunung Merapi yang terjadi pada Oktober-November 2010, menyebabkan evakuasi massal penduduk sekitar.",
    team: "Tim Tanggap Bencana Astacala",
    casualties: "Lebih dari 350 korban jiwa",
    image: "/volcano-merapi.jpg",
    details: "Tim Astacala membantu evakuasi penduduk dari zona bahaya, distribusi bantuan di pengungsian, dan koordinasi informasi erupsi. Tim juga terlibat dalam membantu petani yang ternaknya terdampak oleh hujan abu vulkanik."
  },
  {
    id: 15,
    title: "Tanggap Bencana Erupsi Gunung Kelud",
    date: "2014",
    location: "Kediri, Blitar, dan Malang, Jawa Timur",
    type: "volcano",
    description: "Respons tanggap darurat untuk erupsi dahsyat Gunung Kelud yang terjadi pada Februari 2014, dengan hujan abu vulkanik mencapai radius ratusan kilometer.",
    team: "Tim Tanggap Bencana Astacala",
    casualties: "4 korban jiwa",
    image: "/volcano-kelud.jpg",
    details: "Tim Astacala membantu distribusi masker dan air bersih untuk masyarakat terdampak hujan abu, serta bantuan evakuasi dari zona bahaya. Tantangan utama adalah kondisi jalan yang tertutup abu tebal dan gangguan penerbangan di sebagian besar Jawa."
  },
  {
    id: 16,
    title: "Tanggap Bencana Erupsi Gunung Agung",
    date: "2017-2018",
    location: "Karangasem, Bali",
    type: "volcano",
    description: "Operasi tanggap darurat untuk erupsi Gunung Agung yang berlangsung dari November 2017 hingga awal 2018, menyebabkan evakuasi ribuan penduduk.",
    team: "Tim Tanggap Bencana Astacala",
    casualties: "Tidak ada korban jiwa langsung",
    image: "/volcano-agung.jpg",
    details: "Tim Astacala membantu koordinasi pengungsian dan distribusi bantuan. Karakteristik unik operasi ini adalah durasi yang panjang, karena aktivitas vulkanik berlangsung selama berbulan-bulan dengan intensitas fluktuatif."
  },
  {
    id: 17,
    title: "Tanggap Bencana Erupsi Gunung Semeru",
    date: "2021-2022",
    location: "Lumajang, Jawa Timur",
    type: "volcano",
    description: "Respons tanggap darurat untuk erupsi besar Gunung Semeru pada Desember 2021, yang menyebabkan aliran awan panas dan lahar dingin menerjang pemukiman.",
    team: "Tim Gabungan Astacala",
    casualties: "Lebih dari 50 korban jiwa",
    image: "/volcano-semeru.jpg",
    details: "Tim Astacala terlibat dalam evakuasi penduduk, pencarian korban, dan distribusi bantuan. Tantangan utama adalah medan yang sulit dan beberapa area yang terisolasi akibat jembatan putus oleh lahar."
  },
  
  // Disaster Response - Flood & Landslide
  {
    id: 18,
    title: "Tanggap Bencana Longsor Ciwidey",
    date: "2010",
    location: "Ciwidey, Bandung, Jawa Barat",
    type: "floodslide",
    description: "Operasi tanggap darurat untuk longsor besar yang melanda kawasan Ciwidey, menimbun pemukiman dan infrastruktur di bawahnya.",
    team: "Tim Tanggap Bencana Astacala",
    casualties: "Lebih dari 40 korban jiwa",
    image: "/landslide-ciwidey.jpg",
    details: "Tim Astacala membantu pencarian korban tertimbun longsor dan distribusi bantuan. Tantangan utama adalah kondisi tanah yang masih labil dan resiko longsor susulan yang mengancam operasi penyelamatan."
  },
  {
    id: 19,
    title: "Tanggap Bencana Longsor Banjarnegara",
    date: "2014",
    location: "Banjarnegara, Jawa Tengah",
    type: "floodslide",
    description: "Respons tanggap darurat untuk longsor besar yang menimbun Desa Jemblung di Kecamatan Karangkobar, Banjarnegara pada Desember 2014.",
    team: "Tim Tanggap Bencana Astacala",
    casualties: "Lebih dari 90 korban jiwa",
    image: "/landslide-banjarnegara.jpg",
    details: "Tim Astacala terlibat dalam operasi pencarian dan penyelamatan korban tertimbun longsor, yang melibatkan penggalian manual dan dengan alat berat. Tim juga membantu evakuasi penduduk dari daerah berisiko longsor susulan."
  },
  {
    id: 20,
    title: "Tanggap Bencana Banjir Garut",
    date: "2016",
    location: "Garut, Jawa Barat",
    type: "floodslide",
    description: "Operasi tanggap darurat untuk banjir bandang yang melanda Garut pada September 2016, merusak ribuan rumah dan infrastruktur publik.",
    team: "Tim Tanggap Bencana Astacala",
    casualties: "Lebih dari 30 korban jiwa",
    image: "/flood-garut.jpg",
    details: "Tim Astacala membantu evakuasi penduduk, pencarian korban hanyut, dan distribusi bantuan. Tantangan utama adalah kondisi sungai yang masih berbahaya dan infrastruktur yang rusak menghambat akses bantuan."
  },
  {
    id: 21,
    title: "Tanggap Bencana Banjir Jabodetabek",
    date: "2020",
    location: "Jakarta, Bogor, Depok, Tangerang, dan Bekasi",
    type: "floodslide",
    description: "Respons tanggap darurat untuk banjir besar yang melanda kawasan Jabodetabek pada awal 2020, menenggelamkan ribuan rumah di berbagai wilayah.",
    team: "Tim Tanggap Bencana Astacala",
    casualties: "Lebih dari 60 korban jiwa",
    image: "/flood-jakarta.jpg",
    details: "Tim Astacala terlibat dalam evakuasi penduduk terdampak menggunakan perahu karet dan distribusi bantuan di pengungsian. Operasi ini memerlukan koordinasi dengan banyak pihak karena luasnya area terdampak."
  },
  {
    id: 22,
    title: "Tanggap Bencana Longsor Garut",
    date: "2020",
    location: "Garut, Jawa Barat",
    type: "floodslide",
    description: "Operasi tanggap darurat untuk longsor yang melanda beberapa kecamatan di Garut akibat curah hujan tinggi pada musim hujan 2020.",
    team: "Tim Tanggap Bencana Astacala",
    casualties: "7 korban jiwa",
    image: "/landslide-garut.jpg",
    details: "Tim Astacala membantu pencarian korban tertimbun, evakuasi penduduk dari zona rawan longsor, dan distribusi bantuan. Tim juga membantu asesmen kerusakan untuk program rehabilitasi pasca bencana."
  },
  {
    id: 23,
    title: "Tanggap Bencana Banjir dan Longsor Sumedang",
    date: "2021",
    location: "Sumedang, Jawa Barat",
    type: "floodslide",
    description: "Respons tanggap darurat untuk bencana longsor di Desa Cihanjuang, Kecamatan Cimanggung, Sumedang yang terjadi pada Januari 2021.",
    team: "Tim Tanggap Bencana Astacala",
    casualties: "Lebih dari 40 korban jiwa",
    image: "/landslide-sumedang.jpg",
    details: "Karakteristik unik dari operasi ini adalah adanya longsor susulan yang menimpa tim penyelamat yang sedang bekerja di lokasi. Tim Astacala membantu pencarian korban dan koordinasi dengan tim SAR lainnya."
  },
  {
    id: 24,
    title: "Tanggap Bencana Banjir Bandung Selatan",
    date: "2023",
    location: "Bandung Selatan, Jawa Barat",
    type: "floodslide",
    description: "Operasi tanggap darurat untuk banjir yang melanda kawasan Bandung Selatan pada musim hujan 2023, menenggelamkan ratusan rumah dan mengisolasi beberapa desa.",
    team: "Tim Tanggap Bencana Astacala",
    casualties: "3 korban jiwa",
    image: "/flood-bandung.jpg",
    details: "Tim Astacala membantu evakuasi penduduk, distribusi bantuan logistik, dan pendirian dapur umum di pengungsian. Tim juga membantu membersihkan fasilitas publik seperti sekolah dari lumpur pasca banjir surut."
  }
];

// Filter options for the rescue types
const FILTERS = [
  { label: 'All Operations', value: 'all' },
  { label: 'SAR Operations', value: 'sar' },
  { label: 'Tsunami Response', value: 'tsunami' },
  { label: 'Earthquake Response', value: 'earthquake' },
  { label: 'Volcanic Eruption', value: 'volcano' },
  { label: 'Flood & Landslide', value: 'floodslide' },
];

export default function RescueHistory() {
  const [selected, setSelected] = useState('all');
  const [activeRescue, setActiveRescue] = useState(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const filterContainerRef = useRef(null);
  
  // Filter rescue operations based on selected type
  const filteredOperations = selected === 'all' 
    ? rescueOperations 
    : rescueOperations.filter(op => op.type === selected);

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
        <title>Rescue Operations History - Astacala</title>
        <meta name="description" content="Dokumentasi operasi penyelamatan dan tanggap bencana Tim Astacala. Setiap misi menunjukkan dedikasi kami untuk keselamatan dan kemanusiaan." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Header />
      <main className="bg-black min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 -left-4 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
            <div className="absolute top-40 -right-4 w-72 h-72 bg-red-600 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-40 w-72 h-72 bg-red-700 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-16 relative z-10">
          {/* Hero section - Responsive */}
          <div className="mb-8 sm:mb-10 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
              Rescue Operations History
            </h1>
            <p className="text-gray-300 text-base sm:text-lg max-w-3xl mx-auto px-4">
              Dokumentasi operasi penyelamatan dan tanggap bencana yang telah dilakukan oleh Tim Astacala. 
              Setiap misi menunjukkan dedikasi kami untuk keselamatan dan kemanusiaan.
            </p>
          </div>
          
          {/* Filter buttons - Scrollable on mobile */}
          <div className="relative mb-8 sm:mb-10">
            {/* Left Arrow */}
            {showLeftArrow && (
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-gradient-to-r from-black to-transparent pl-2 pr-4 h-full flex items-center lg:hidden"
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
              className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide scroll-smooth lg:justify-center"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex gap-2 sm:gap-3 px-8 lg:px-0">
                {FILTERS.map(f => (
                  <button
                    key={f.value}
                    className={`px-3 sm:px-4 py-2 rounded-full font-semibold text-xs sm:text-sm border transition-all duration-300 whitespace-nowrap transform hover:scale-105 ${
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
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-gradient-to-l from-black to-transparent pr-2 pl-4 h-full flex items-center lg:hidden"
                aria-label="Scroll right"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Timeline section - Mobile optimized */}
          <div className="relative">
            {/* Vertical timeline line - Hidden on mobile */}
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-red-700 z-0"></div>
            
            {/* Mobile timeline line - Left aligned */}
            <div className="lg:hidden absolute left-4 top-0 bottom-0 w-0.5 bg-red-700 z-0"></div>
            
            {/* Rescue events */}
            <div className="relative z-10">
              {filteredOperations.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <div className="text-6xl mb-4 opacity-20">🔍</div>
                  <p className="text-lg">No rescue operations found for this filter.</p>
                  <button 
                    onClick={() => setSelected('all')}
                    className="mt-4 text-red-500 hover:text-red-400 underline"
                  >
                    Show all operations
                  </button>
                </div>
              ) : (
                filteredOperations.map((rescue, index) => (
                  <div 
                    key={rescue.id}
                    className={`flex items-start mb-8 sm:mb-12 relative ${
                      index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                    } flex-row`}
                  >
                    {/* Timeline node - Responsive positioning */}
                    <div className="absolute left-4 lg:left-1/2 lg:transform lg:-translate-x-1/2 w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-red-600 border-2 sm:border-4 border-gray-900 z-20 top-6 lg:top-0"></div>
                    
                    {/* Event date tag - Mobile optimized */}
                    <div className={`absolute top-0 left-10 lg:left-1/2 lg:transform ${
                      index % 2 === 0 ? 'lg:-translate-x-[calc(100%+20px)]' : 'lg:translate-x-[20px]'
                    }`}>
                      <div className="bg-gray-900/90 backdrop-blur-sm text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full border border-red-700 whitespace-nowrap">
                        {rescue.date}
                      </div>
                    </div>
                    
                    {/* Content card - Full width on mobile */}
                    <div className={`w-full lg:w-5/12 ${
                      index % 2 === 0 ? 'lg:mr-auto lg:pr-8' : 'lg:ml-auto lg:pl-8'
                    } pl-10 lg:pl-0`}>
                      <div 
                        className={`bg-gray-900/80 backdrop-blur-sm rounded-lg sm:rounded-xl border border-gray-800 overflow-hidden cursor-pointer
                          transition-all duration-300 hover:shadow-lg hover:shadow-red-900/20 transform hover:-translate-y-1
                          ${activeRescue === rescue.id ? 'ring-2 ring-red-500' : ''}
                        `}
                        onClick={() => setActiveRescue(activeRescue === rescue.id ? null : rescue.id)}
                      >
                        {/* Card image */}
                        <div className="h-40 sm:h-48 bg-gray-800 relative overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-3xl sm:text-4xl text-red-500">
                              <i className={`fas fa-${
                                rescue.type === 'sar' ? (rescue.location.includes('Sungai') ? 'water' : 'mountain') :
                                rescue.type === 'tsunami' ? 'water' :
                                rescue.type === 'earthquake' ? 'house-damage' :
                                rescue.type === 'volcano' ? 'fire' :
                                rescue.type === 'floodslide' ? (rescue.title.includes('Banjir') ? 'water' : 'mountain-city') :
                                'exclamation-triangle'
                              }`}></i>
                            </div>
                          </div>
                          
                          {/* Operation type badge */}
                          <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-md uppercase font-semibold">
                              {rescue.type === 'sar' ? 'SAR' :
                               rescue.type === 'tsunami' ? 'Tsunami' :
                               rescue.type === 'earthquake' ? 'Earthquake' :
                               rescue.type === 'volcano' ? 'Volcanic' :
                               rescue.type === 'floodslide' ? 'Flood/Slide' :
                               rescue.type}
                            </span>
                          </div>
                        </div>
                        
                        {/* Card content - Responsive padding */}
                        <div className="p-4 sm:p-5">
                          <h3 className="text-lg sm:text-xl font-bold text-red-500 mb-2">{rescue.title}</h3>
                          <p className="text-gray-300 text-xs sm:text-sm mb-2">{rescue.location}</p>
                          <p className="text-gray-400 text-xs sm:text-sm mb-3 line-clamp-3">{rescue.description}</p>
                          
                          {/* Expandable content */}
                          {activeRescue === rescue.id && (
                            <div className="mt-4 pt-4 border-t border-gray-700 animate-fadeIn">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3">
                                <div>
                                  <h4 className="text-red-400 font-semibold text-xs sm:text-sm">Team</h4>
                                  <p className="text-gray-300 text-xs sm:text-sm">{rescue.team}</p>
                                </div>
                                <div>
                                  <h4 className="text-red-400 font-semibold text-xs sm:text-sm">Casualties</h4>
                                  <p className="text-gray-300 text-xs sm:text-sm">{rescue.casualties}</p>
                                </div>
                              </div>
                              <h4 className="text-red-400 font-semibold text-xs sm:text-sm mb-1">Details</h4>
                              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{rescue.details}</p>
                            </div>
                          )}
                          
                          {/* Expand/collapse button */}
                          <button 
                            className="mt-3 flex items-center text-red-500 hover:text-red-400 text-xs sm:text-sm font-semibold transition-colors group"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveRescue(activeRescue === rescue.id ? null : rescue.id);
                            }}
                          >
                            <span>{activeRescue === rescue.id ? 'Hide Details' : 'View Details'}</span>
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className={`h-3 w-3 sm:h-4 sm:w-4 ml-1 transition-transform group-hover:translate-y-0.5 ${
                                activeRescue === rescue.id ? 'rotate-180' : ''
                              }`}
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* CTA Section - Responsive */}
          <div className="mt-12 sm:mt-16 text-center">
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-6 sm:p-8 max-w-3xl mx-auto border border-gray-800">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                Interested in Joining Our Rescue Team?
              </h2>
              <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">
                Astacala selalu mencari relawan yang berkomitmen untuk operasi penyelamatan dan tanggap bencana. 
                Bergabunglah dengan kami untuk mengembangkan keterampilan dan membantu mereka yang membutuhkan.
              </p>
              <Link 
                href="/join-us" 
                className="inline-flex items-center bg-red-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 transform hover:scale-105 group"
              >
                <span>Gabung dengan Tim Rescue Kami</span>
                <svg 
                  className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
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
          
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-blob {
            animation: blob 7s infinite;
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
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
          
          .line-clamp-3 {
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
          }
        `}</style>
      </main>
      <Footer />
    </>
  );
}