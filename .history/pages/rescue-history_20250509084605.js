import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import { useState } from 'react';

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
  
  // Filter rescue operations based on selected type
  const filteredOperations = selected === 'all' 
    ? rescueOperations 
    : rescueOperations.filter(op => op.type === selected);

  return (
    <>
      <Header />
      <main className="bg-black min-h-screen">
        <div className="max-w-7xl mx-auto w-full px-4 pt-8 pb-16">
          {/* Hero section */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Rescue Operations History</h1>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Dokumentasi operasi penyelamatan dan tanggap bencana yang telah dilakukan oleh Tim Astacala. 
              Setiap misi menunjukkan dedikasi kami untuk keselamatan dan kemanusiaan.
            </p>
          </div>
          
          {/* Filter buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {FILTERS.map(f => (
              <button
                key={f.value}
                className={`px-4 py-2 rounded-full font-semibold text-sm border transition-colors ${
                  selected === f.value 
                    ? 'bg-red-600 text-white border-red-600' 
                    : 'bg-gray-900 text-gray-300 border-gray-700 hover:bg-gray-800 hover:border-red-700'
                }`}
                onClick={() => setSelected(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
          
          {/* Timeline section */}
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-red-700 z-0"></div>
            
            {/* Rescue events */}
            <div className="relative z-10">
              {filteredOperations.length === 0 ? (
                <div className="text-center py-16 text-gray-400">No rescue operations found for this filter.</div>
              ) : (
                filteredOperations.map((rescue, index) => (
                  <div 
                    key={rescue.id}
                    className={`flex items-center mb-12 relative ${
                      index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                    }`}
                  >
                    {/* Timeline node */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-red-600 border-4 border-gray-900 z-20"></div>
                    
                    {/* Event date tag */}
                    <div className={`absolute top-0 left-1/2 transform ${
                      index % 2 === 0 ? '-translate-x-[calc(100%+20px)]' : 'translate-x-[20px]'
                    }`}>
                      <div className="bg-gray-900 text-white text-sm px-3 py-1 rounded-full border border-red-700 whitespace-nowrap">
                        {rescue.date}
                      </div>
                    </div>
                    
                    {/* Content card */}
                    <div className={`w-5/12 ${index % 2 === 0 ? 'mr-auto pr-8' : 'ml-auto pl-8'}`}>
                      <div 
                        className={`bg-gray-900 rounded-xl border border-gray-800 overflow-hidden cursor-pointer
                          transition-all duration-300 hover:shadow-lg hover:shadow-red-900/20
                          ${activeRescue === rescue.id ? 'ring-2 ring-red-500' : ''}
                        `}
                        onClick={() => setActiveRescue(activeRescue === rescue.id ? null : rescue.id)}
                      >
                        {/* Card image */}
                        <div className="h-48 bg-gray-800 relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            {rescue.image ? (
                              <div className="text-4xl text-red-500">
                                <i className={`fas fa-${
                                  rescue.type === 'sar' ? (rescue.location.includes('Sungai') ? 'water' : 'mountain') :
                                  rescue.type === 'tsunami' ? 'water' :
                                  rescue.type === 'earthquake' ? 'house-damage' :
                                  rescue.type === 'volcano' ? 'fire' :
                                  rescue.type === 'floodslide' ? (rescue.title.includes('Banjir') ? 'water' : 'mountain-city') :
                                  'exclamation-triangle'
                                }`}></i>
                              </div>
                            ) : (
                              <div className="text-4xl text-red-500">
                                <i className="fas fa-exclamation-triangle"></i>
                              </div>
                            )}
                          </div>
                          
                          {/* Operation type badge */}
                          <div className="absolute top-3 right-3">
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
                        
                        {/* Card content */}
                        <div className="p-5">
                          <h3 className="text-xl font-bold text-red-500 mb-2">{rescue.title}</h3>
                          <p className="text-gray-300 text-sm mb-2">{rescue.location}</p>
                          <p className="text-gray-400 text-sm mb-3">{rescue.description}</p>
                          
                          {/* Expandable content */}
                          {activeRescue === rescue.id && (
                            <div className="mt-4 pt-4 border-t border-gray-700">
                              <div className="grid grid-cols-2 gap-4 mb-3">
                                <div>
                                  <h4 className="text-red-400 font-semibold text-sm">Team</h4>
                                  <p className="text-gray-300 text-sm">{rescue.team}</p>
                                </div>
                                <div>
                                  <h4 className="text-red-400 font-semibold text-sm">Casualties</h4>
                                  <p className="text-gray-300 text-sm">{rescue.casualties}</p>
                                </div>
                              </div>
                              <h4 className="text-red-400 font-semibold text-sm mb-1">Details</h4>
                              <p className="text-gray-300 text-sm">{rescue.details}</p>
                            </div>
                          )}
                          
                          {/* Expand/collapse button */}
                          <button 
                            className="mt-3 flex items-center text-red-500 hover:text-red-400 text-sm font-semibold transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveRescue(activeRescue === rescue.id ? null : rescue.id);
                            }}
                          >
                            {activeRescue === rescue.id ? 'Hide Details' : 'View Details'}
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className={`h-4 w-4 ml-1 transition-transform ${activeRescue === rescue.id ? 'rotate-180' : ''}`}
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
          
          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="bg-gray-900 rounded-xl p-8 max-w-3xl mx-auto border border-gray-800">
              <h2 className="text-2xl font-bold text-white mb-4">Interested in Joining Our Rescue Team?</h2>
              <p className="text-gray-300 mb-6">
                Astacala selalu mencari relawan yang berkomitmen untuk operasi penyelamatan dan tanggap bencana. 
                Bergabunglah dengan kami untuk mengembangkan keterampilan dan membantu mereka yang membutuhkan.
              </p>
              <Link href="/join-us" className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                Gabung dengan Tim Rescue Kami
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}