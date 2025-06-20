import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';
import Head from 'next/head';
import { useState, useMemo } from 'react';

const activitiesData = {
  'rock-climbing': {
    title: 'Rock Climbing',
    image: '/rc.jpg',
    description: "Explore the heights of Astacala's mountains with our Rock Climbing Division. Learn about safe climbing techniques, equipment, and join our thrilling expeditions.",
    features: [
      { icon: 'fas fa-book', label: 'Climbing Techniques' },
      { icon: 'fas fa-tools', label: 'Equipment Essentials' },
      { icon: 'fas fa-shield-alt', label: 'Safety Protocols' },
    ],
  },
  caving: {
    title: 'Caving Division',
    image: '/caving.jpg',
    description: "Explore the depths of Astacala's caves with our Caving Division. Learn about safe caving techniques, equipment, and join our thrilling expeditions.",
    features: [
      { icon: 'fas fa-book', label: 'Caving Techniques' },
      { icon: 'fas fa-tools', label: 'Equipment Essentials' },
      { icon: 'fas fa-shield-alt', label: 'Safety Protocols' },
    ],
  },
  rafting: {
    title: 'Rafting Division',
    image: '/rafting.jpg',
    description: "Explore the rapids of Astacala's rivers with our Rafting Division. Learn about safe rafting techniques, equipment, and join our thrilling expeditions.",
    features: [
      { icon: 'fas fa-book', label: 'Rafting Techniques' },
      { icon: 'fas fa-tools', label: 'Equipment Essentials' },
      { icon: 'fas fa-shield-alt', label: 'Safety Protocols' },
    ],
    table: {
      columns: [
        { key: 'name', label: 'Location Name' },
        { key: 'region', label: 'Region' },
        { key: 'accessibility', label: 'Accessibility' },
      ],
      rows: [
        { name: 'Sungai Elo', region: 'Southern Range', accessibility: 'Moderate' },
        { name: 'Sungai Progo', region: 'Western Highlands', accessibility: 'Challenging' },
      ],
    },
  },
  diving: {
    title: 'Diving Division',
    image: '/diving.jpg',
    description: "Explore the depths of Astacala's oceans with our Diving Division. Learn about safe diving techniques, equipment, and join our thrilling expeditions.",
    features: [
      { icon: 'fas fa-book', label: 'Diving Techniques' },
      { icon: 'fas fa-tools', label: 'Equipment Essentials' },
      { icon: 'fas fa-shield-alt', label: 'Safety Protocols' },
    ],
    table: {
      columns: [
        { key: 'name', label: 'Location Name' },
        { key: 'region', label: 'Region' },
        { key: 'accessibility', label: 'Accessibility' },
      ],
      rows: [
        { name: 'Bunaken', region: 'Northern Range', accessibility: 'Moderate' },
        { name: 'Raja Ampat', region: 'Western Highlands', accessibility: 'Challenging' },
      ],
    },
  },
  conservation: {
    title: 'Conservation Division',
    image: '/conservation.jpg',
    description: "Join our Conservation Division in preserving and protecting Astacala's environment and wildlife.",
    features: [
      { icon: 'fas fa-book', label: 'Conservation Techniques' },
      { icon: 'fas fa-tools', label: 'Equipment Essentials' },
      { icon: 'fas fa-shield-alt', label: 'Safety Protocols' },
    ],
    table: {
      columns: [
        { key: 'name', label: 'Location Name' },
        { key: 'region', label: 'Region' },
        { key: 'accessibility', label: 'Accessibility' },
      ],
      rows: [
        { name: 'Taman Nasional Ujung Kulon', region: 'Southern Range', accessibility: 'Moderate' },
        { name: 'Taman Nasional Gunung Leuser', region: 'Western Highlands', accessibility: 'Challenging' },
      ],
    },
  },
  paralayang: {
    title: 'Paralayang Division',
    image: '/paralayang.jpg',
    description: "Explore the skies of Astacala with our Paralayang Division. Learn about safe paragliding techniques, equipment, and join our thrilling expeditions.",
    features: [
      { icon: 'fas fa-book', label: 'Paragliding Techniques' },
      { icon: 'fas fa-tools', label: 'Equipment Essentials' },
      { icon: 'fas fa-shield-alt', label: 'Safety Protocols' },
    ],
    table: {
      columns: [
        { key: 'name', label: 'Location Name' },
        { key: 'region', label: 'Region' },
        { key: 'accessibility', label: 'Accessibility' },
      ],
      rows: [
        { name: 'Gunung Banyak', region: 'Southern Range', accessibility: 'Moderate' },
        { name: 'Puncak Lawang', region: 'Western Highlands', accessibility: 'Challenging' },
      ],
    },
  },
  diksar: {
    title: 'Diksar (Pendidikan Dasar)',
    image: '/diksar.jpg',
    description: "Pendidikan Dasar Astacala adalah tahapan awal yang harus dilalui oleh calon anggota Astacala untuk menjadi anggota. Di sini calon anggota akan dilatih keterampilan alam terbuka, dipupuk rasa nasionalisme, digalang suatu persatuan dan semangat kebersamaan, dibina mental dan fisik.",
    features: [
      { icon: 'fas fa-campground', label: 'Keterampilan Alam Terbuka' },
      { icon: 'fas fa-users', label: 'Pembinaan Mental & Fisik' },
      { icon: 'fas fa-flag', label: 'Semangat Nasionalisme' },
    ],
  },
};

// Komponen Tabel Modern
function ModernTable({ columns, data }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const itemsPerPage = 10;

  // Fungsionalitas pencarian
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(row => 
      columns.some(col => {
        const value = row[col.key];
        return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, columns]);

  // Fungsionalitas pengurutan
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginasi
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const toggleDescription = (rowIndex) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [rowIndex]: !prev[rowIndex]
    }));
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    setExpandedDescriptions({}); // Reset deskripsi yang diperluas saat berganti halaman
  };

  return (
    <div className="space-y-4">
      {/* Bilah Pencarian */}
      <div className="relative">
        <input
          type="text"
          placeholder="Cari kegiatan..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
            setExpandedDescriptions({}); // Reset deskripsi yang diperluas saat mencari
          }}
          className="w-full px-4 py-3 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
        />
        <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
      </div>

      {/* Kontainer Tabel */}
      <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-red-600 to-red-700">
                {columns.map((col) => (
                  <th 
                    key={col.key}
                    className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-red-800/50 transition-colors"
                    onClick={() => handleSort(col.key)}
                  >
                    <div className="flex items-center space-x-1">
                      <span className={col.key === 'tempat' ? 'max-w-[200px] truncate' : ''}>
                        {col.label}
                      </span>
                      {sortConfig.key === col.key && (
                        <i className={`fas fa-chevron-${sortConfig.direction === 'asc' ? 'up' : 'down'} text-xs`}></i>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {paginatedData.length > 0 ? (
                paginatedData.map((row, idx) => (
                  <tr 
                    key={idx} 
                    className="hover:bg-gray-700/50 transition-all duration-200 hover:transform hover:scale-[1.01]"
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-4 text-sm text-gray-300">
                        {col.key === 'peta_sungai' && row.jalur_orad && row.point_orad ? (
                          <Link 
                            href={`/activities/rafting/river-map?jalur=${row.jalur_orad}&point=${row.point_orad}&nama=${encodeURIComponent(row.nama_kegiatan)}&sungai=${encodeURIComponent(row.sungai || '')}`}
                            className="inline-flex items-center px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full hover:bg-blue-600/30 transition-colors"
                          >
                            <i className="fas fa-water mr-1 text-xs"></i>
                            <span className="text-xs font-medium">Lihat Peta Sungai</span>
                          </Link>
                        ) : col.key === 'peta_pda' && row.jalur_pda && row.point_pda ? (
                          <Link 
                            href={`/activities/diksar/pda-map?jalur=${row.jalur_pda}&point=${row.point_pda}&nama=${encodeURIComponent(row.nama_kegiatan)}`}
                            className="inline-flex items-center px-3 py-1 bg-red-600/20 text-red-400 rounded-full hover:bg-red-600/30 transition-colors"
                          >
                            <i className="fas fa-map-marked-alt mr-1 text-xs"></i>
                            <span className="text-xs font-medium">Lihat Peta PDA</span>
                          </Link>
                        ) : col.key === 'link_rop' && row[col.key] ? (
                          <a 
                            href={row[col.key]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1 bg-green-600/20 text-green-400 rounded-full hover:bg-green-600/30 transition-colors"
                          >
                            <i className="fas fa-external-link-alt mr-1 text-xs"></i>
                            <span className="text-xs font-medium">ROP</span>
                          </a>
                        ) : (col.key === 'tempat' || col.key === 'tanggal_kegiatan') && row[col.key] && row[col.key].length > 50 ? (
                          <div className="relative">
                            <div className={`${!expandedDescriptions[idx] ? 'max-w-[300px] truncate' : ''}`}>
                              {row[col.key]}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleDescription(idx);
                              }}
                              className="text-blue-400 hover:text-blue-300 text-xs mt-1 underline transition-colors"
                            >
                              {expandedDescriptions[idx] ? 'Lihat lebih sedikit' : 'Lihat selengkapnya'}
                            </button>
                          </div>
                        ) : col.key === 'sungai' ? (
                          <div className="flex items-center">
                            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-600/20 text-blue-400">
                              <i className="fas fa-water mr-1"></i>
                              {row[col.key] || 'Tidak diketahui'}
                            </div>
                          </div>
                        ) : (
                          <span className={!row[col.key] ? 'text-gray-500 italic' : ''}>
                            {row[col.key] || '-'}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-400">
                    <div className="flex flex-col items-center">
                      <i className="fas fa-search text-4xl mb-3 opacity-20"></i>
                      <p>Tidak ada hasil ditemukan</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginasi */}
        {totalPages > 1 && (
          <div className="bg-gray-900/50 px-6 py-4 border-t border-gray-700">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-400">
                Menampilkan {((currentPage - 1) * itemsPerPage) + 1} hingga {Math.min(currentPage * itemsPerPage, sortedData.length)} dari {sortedData.length} hasil
              </p>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <i className="fas fa-angle-double-left"></i>
                </button>
                
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <i className="fas fa-angle-left"></i>
                </button>
                
                <div className="flex items-center space-x-1">
                  {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = idx + 1;
                    } else if (currentPage <= 3) {
                      pageNum = idx + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + idx;
                    } else {
                      pageNum = currentPage - 2 + idx;
                    }
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => goToPage(pageNum)}
                        className={`min-w-[40px] px-3 py-2 rounded-lg font-medium transition-all ${
                          currentPage === pageNum 
                            ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' 
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <i className="fas fa-angle-right"></i>
                </button>
                
                <button
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <i className="fas fa-angle-double-right"></i>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ActivityDetail({ type, astacalaData, externalData, issData, pdaData, oradData }) {
  const router = useRouter();
  const [dataSource, setDataSource] = useState('astacala');
  
  // Handle fallback
  if (router.isFallback) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // If type is not valid, show error
  if (!type || !activitiesData[type]) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl text-red-600 mb-4">404</h1>
          <p className="text-white mb-4">Activity not found</p>
          <Link href="/activities" className="text-red-500 hover:text-red-400 underline">
            Back to activities
          </Link>
        </div>
      </div>
    );
  }

  const activity = { ...activitiesData[type] };

  // Create table data for rock climbing based on API data
  if (type === 'rock-climbing' && astacalaData && astacalaData.data && astacalaData.data.length > 0) {
    const firstItem = astacalaData.data[0];
    
    const columns = Object.keys(firstItem)
      .filter(key => key !== 'id' && key !== 'no')
      .map(key => {
        let label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        if (key === 'nama_lokasi') label = 'Nama Lokasi';
        if (key === 'titik_koordinat') label = 'Koordinat';
        if (key === 'link_rop') label = 'ROP Link';
        
        return { key, label };
      });
    
    activity.table = {
      columns,
      rows: astacalaData.data
    };
  }

  // Create table data for caving based on API data
  if (type === 'caving') {
    if (dataSource === 'astacala' && astacalaData) {
      activity.table = {
        columns: [
          { key: 'nama_gua', label: 'Nama Gua' },
          { key: 'titik_koordinat', label: 'Koordinat' },
          { key: 'deskripsi', label: 'Deskripsi' },
          { key: 'kegiatan', label: 'Kegiatan' },
          { key: 'kota', label: 'Kota' },
          { key: 'provinsi', label: 'Provinsi' },
          { key: 'kedalaman', label: 'Kedalaman (m)' },
          { key: 'karakter_lorong', label: 'Tipe Lorong' },
          { key: 'waktu_kegiatan', label: 'Waktu Kegiatan' },
          { key: 'link_rop', label: 'ROP' },
        ],
        rows: astacalaData.data || []
      };
    } else if (dataSource === 'external' && externalData) {
      activity.table = {
        columns: [
          { key: 'nama_gua', label: 'Nama Gua' },
          { key: 'sinonim', label: 'Sinonim' },
          { key: 'titik_koordinat', label: 'Koordinat' },
          { key: 'elevasi_mulut_gua', label: 'Elevasi Mulut Gua (m)' },
          { key: 'karakter_lorong', label: 'Tipe Lorong' },
          { key: 'total_kedalaman', label: 'Total Kedalaman (m)' },
          { key: 'total_panjang', label: 'Total Panjang (m)' },
          { key: 'status_explore', label: 'Status Eksplorasi' },
        ],
        rows: externalData.data || []
      };
    } else if (dataSource === 'iss' && issData) {
      activity.table = {
        columns: [
          { key: 'nama_potensi_karst', label: 'Nama Potensi Karst' },
          { key: 'deskripsi', label: 'Deskripsi' },
          { key: 'lat', label: 'Latitude' },
          { key: 'long', label: 'Longitude' },
          { key: 'sumber_data', label: 'Sumber Data' },
          { key: 'jenis_potensi_karst', label: 'Jenis Potensi Karst' },
          { key: 'type_gua', label: 'Tipe Gua' },
          { key: 'status_pemetaan_gua', label: 'Status Pemetaan' },
        ],
        rows: issData.data || []
      };
    }
  }

  // Create table data for rafting based on ORAD API data
  if (type === 'rafting' && oradData && oradData.data && oradData.data.length > 0) {
    activity.table = {
      columns: [
        { key: 'nama_kegiatan', label: 'Nama Kegiatan' },
        { key: 'tanggal_kegiatan', label: 'Tanggal Kegiatan' },
        { key: 'tempat', label: 'Tempat' },
        { key: 'sungai', label: 'Sungai' },
        { key: 'link_rop', label: 'ROP' },
        { key: 'peta_sungai', label: 'Peta Sungai' },
      ],
      rows: oradData.data
    };
  }

  // Create table data for diksar based on PDA API data
  if (type === 'diksar' && pdaData && pdaData.data && pdaData.data.length > 0) {
    activity.table = {
      columns: [
        { key: 'nama_kegiatan', label: 'Nama Kegiatan' },
        { key: 'nama_angkatan', label: 'Nama Angkatan' },
        { key: 'tanggal_kegiatan', label: 'Tanggal Kegiatan' },
        { key: 'lokasi', label: 'Lokasi' },
        { key: 'komandan_latihan', label: 'Komandan Latihan' },
        { key: 'komandan_operasional', label: 'Komandan Operasional' },
        { key: 'komandan_lapangan', label: 'Komandan Lapangan' },
        { key: 'jumlah_panitia', label: 'Jumlah Panitia' },
        { key: 'jumlah_siswa', label: 'Jumlah Siswa' },
        { key: 'peta_pda', label: 'Peta PDA' },
      ],
      rows: pdaData.data
    };
  }

  return (
    <>
      <Head>
        <title>{`${activity.title} - Astacala`}</title>
        <meta name="description" content={activity.description} />
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

        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 pb-8 relative z-10">
          {/* Back Button */}
          <Link 
            href="/activities" 
            className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition-colors group"
          >
            <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Activities
          </Link>

          {/* Main Card - Responsive */}
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg flex flex-col lg:flex-row p-4 sm:p-6 gap-4 sm:gap-6 items-center mb-6 border border-gray-800 transform hover:shadow-red-900/20 transition-all duration-300">
            <img 
              src={activity.image} 
              alt={activity.title} 
              className="w-full lg:w-48 h-48 lg:h-36 object-cover rounded-lg shadow-md"
              loading="lazy"
            />
            <div className="text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-500 mb-2">{activity.title}</h1>
              <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">{activity.description}</p>
            </div>
          </div>

          {/* Features - Responsive Grid */}
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6 mb-6 border border-gray-800">
            {activity.features.map((f, idx) => (
              <div key={idx} className="flex flex-col items-center group">
                <div className="bg-red-600 text-white rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-xl sm:text-2xl mb-2 transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <i className={f.icon}></i>
                </div>
                <Link 
                  href={`/activities/${type}/${f.label.toLowerCase().replace(/\s+/g, '-')}`}
                  className="font-semibold text-red-500 hover:text-red-400 text-center text-sm sm:text-base transition-colors"
                >
                  {f.label}
                </Link>
              </div>
            ))}
          </div>

          {/* Data Source Toggle for Caving - Balanced Buttons */}
          {type === 'caving' && (
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-800">
              <h2 className="text-lg sm:text-xl font-bold mb-4 text-red-500">Sumber Data</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <button 
                  onClick={() => setDataSource('astacala')}
                  className={`px-4 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                    dataSource === 'astacala' 
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                  }`}
                >
                  <i className="fas fa-mountain mr-2"></i>
                  Data Kegiatan Astacala
                </button>
                <button 
                  onClick={() => setDataSource('external')}
                  className={`px-4 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                    dataSource === 'external' 
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                  }`}
                >
                  <i className="fas fa-database mr-2"></i>
                  Data Klapanunggal
                </button>
                <button 
                  onClick={() => setDataSource('iss')}
                  className={`px-4 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                    dataSource === 'iss' 
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                  }`}
                >
                  <i className="fas fa-globe mr-2"></i>
                  Data Karst Umum (ISS)
                </button>
              </div>
            </div>
          )}

          {/* Modern Table Section */}
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 border border-gray-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-red-500">
                {type === 'caving' 
                  ? (dataSource === 'astacala' ? 'Data Kegiatan Astacala' : dataSource === 'external' ? 'Data Klapanunggal' : 'Data Karst Umum (ISS)')
                  : type === 'diksar' 
                  ? 'Data Kegiatan Pendidikan Dasar (PDA)'
                  : type === 'rafting'
                  ? 'Data Kegiatan Olahraga Arus Deras (ORAD)'
                  : 'Lokasi Kegiatan'
                }
              </h2>
              {activity.table && activity.table.rows && (
                <div className="flex items-center space-x-2">
                  <i className={`fas ${type === 'diksar' ? 'fa-graduation-cap' : type === 'rafting' ? 'fa-water' : 'fa-chart-bar'} text-red-500`}></i>
                  <span className="text-sm text-gray-400">
                    Total: {activity.table.rows.length} {type === 'diksar' ? 'kegiatan' : type === 'rafting' ? 'kegiatan ORAD' : 'lokasi'}
                  </span>
                </div>
              )}
            </div>
            
            {/* BAGIAN YANG DIPERBAIKI */}
            {activity.table && activity.table.rows ? (
              <ModernTable 
                columns={activity.table.columns}
                data={activity.table.rows}
              />
            ) : (
              <div className="text-center py-12">
                <div className="text-5xl mb-4 opacity-20">
                  <i className={`fas ${type === 'diksar' ? 'fa-graduation-cap' : type === 'rafting' ? 'fa-water' : 'fa-map-marked-alt'}`}></i>
                </div>
                <p className="text-gray-400 text-lg">
                  {type === 'diksar' ? 'Belum ada data kegiatan PDA' : type === 'rafting' ? 'Belum ada data kegiatan ORAD' : 'No location data available'}
                </p>
                <p className="text-gray-500 text-sm mt-2">Check back later for updates</p>
              </div>
            )}
            {/* AKHIR BAGIAN YANG DIPERBAIKI */}
            
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
          
          @media (prefers-reduced-motion: reduce) {
            .animate-blob {
              animation: none;
            }
          }
        `}</style>
      </main>
      <Footer />
    </>
  );
}


export async function getStaticPaths() {
  const paths = [
    { params: { type: 'rock-climbing' } },
    { params: { type: 'caving' } },
    { params: { type: 'rafting' } },
    { params: { type: 'diving' } },
    { params: { type: 'conservation' } },
    { params: { type: 'paralayang' } },
    { params: { type: 'diksar' } }
  ];
  
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { type } = params;
  
  let astacalaData = null;
  let externalData = null;
  let issData = null;
  let pdaData = null;
  let oradData = null;
  
  const baseURL = 'http://52.64.175.183';
  
  if (type === 'rock-climbing') {
    try {
      const res = await fetch(`${baseURL}/items/rc_astacala?limit=-1`);
      astacalaData = await res.json();
    } catch (error) {
      console.error('Failed to fetch rock climbing data:', error);
    }
  }
  
  if (type === 'caving') {
    try {
      const astRes = await fetch(`${baseURL}/items/caving_astacala?limit=-1`);
      astacalaData = await astRes.json();
      
      const extRes = await fetch(`${baseURL}/items/caving_klapanunggal?limit=-1`);
      externalData = await extRes.json();
      
      const issRes = await fetch(`${baseURL}/items/caving_data_iss?limit=-1`);
      issData = await issRes.json();
    } catch (error) {
      console.error('Failed to fetch caving data:', error);
    }
  }
  
  if (type === 'rafting') {
    try {
      const oradRes = await fetch(`${baseURL}/items/orad_astacala?limit=-1`);
      oradData = await oradRes.json();
    } catch (error) {
      console.error('Failed to fetch ORAD data:', error);
    }
  }
  
  if (type === 'diksar') {
    try {
      const pdaRes = await fetch(`${baseURL}/items/PendasAstacala?limit=-1`);
      pdaData = await pdaRes.json();
    } catch (error) {
      console.error('Failed to fetch PDA data:', error);
    }
  }
  
  const processData = (data) => {
    if (!data || !data.data) return null;
    return {
      ...data,
      data: data.data.map(item => {
        const { user_created, user_updated, date_created, date_updated, ...rest } = item;
        return rest;
      })
    };
  };
  
  return { 
    props: { 
      type,
      astacalaData: processData(astacalaData),
      externalData: processData(externalData),
      issData: processData(issData),
      pdaData: processData(pdaData),
      oradData: processData(oradData)
    },
    revalidate: 3600,
  };
}