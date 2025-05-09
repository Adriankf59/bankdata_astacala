import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState } from 'react';
import Link from 'next/link';

export default function About() {
  const [activeTab, setActiveTab] = useState('sejarah');

  // Tabs data
  const tabs = [
    { id: 'sejarah', label: 'Sejarah & Latar Belakang' },
    { id: 'visi', label: 'Visi & Misi' },
    { id: 'anggota', label: 'Keanggotaan' },
    { id: 'pendidikan', label: 'Pendidikan' },
    { id: 'kegiatan', label: 'Kegiatan' },
    { id: 'ekspedisi', label: 'Ekspedisi' },
    { id: 'pengabdian', label: 'Pengabdian' },
    { id: 'tanggap', label: 'Tanggap Bencana' },
  ];

  return (
    <>
      <Header />
      <main className="bg-black min-h-screen">
        {/* Hero Section with Background Image */}
        <section className="relative h-80">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url("/ast logo.jpg")' }}
          />
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/90"></div>
          
          {/* Content */}
          <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Tentang Astacala</h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl">
              Perhimpunan Mahasiswa Pecinta Alam Universitas Telkom, tempat para mahasiswa petualang, 
              pecinta dan penggiat alam bebas berkumpul sejak 1992.
            </p>
          </div>
        </section>
        
        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Tabs Navigation */}
          <div className="mb-8 overflow-x-auto pb-2">
            <div className="flex space-x-2 min-w-max">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full font-semibold text-sm border transition-colors whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'bg-red-600 text-white border-red-600' 
                      : 'bg-gray-900 text-gray-300 border-gray-700 hover:bg-gray-800 hover:border-red-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Content Display based on Active Tab */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 md:p-8">
            {activeTab === 'sejarah' && (
              <div className="text-gray-300 space-y-6">
                <h2 className="text-2xl font-bold text-red-500 mb-4">Sejarah dan Latar Belakang</h2>
                <p>
                  Astacala adalah Perhimpunan Mahasiswa Pecinta Alam Universitas Telkom yang merupakan suatu 
                  unit kegiatan mahasiswa di kampus ini. Tempat para mahasiswa petualang, pecinta dan penggiat 
                  alam bebas berkumpul. Di sini digalang suatu persatuan, dipupuk semangat kebersamaan, dibina 
                  mental dan fisik, ditajamkan naluri, nalar, rekreasi, serta kepedulian terhadap lingkungan.
                </p>
                <p>
                  Astacala berdiri pada tanggal 17 Oktober 1992 di kampus lama STT Telkom, bertempat di Jalan Suci, 
                  Bandung yang merupakan tonggak awal lahirnya Universitas Telkom di kemudian hari. Pengambilan 
                  nomor anggota diadakan pertama kali pada tanggal 2 Januari 1993 di Gunung Tangkuban Perahu oleh 
                  10 orang yang menjadi cikal bakal terbentuknya angkatan Perintis, yang kemudian dilengkapi menjadi 
                  23 orang pada bulan Desember 1993 di Situ Lembang.
                </p>
                <p>
                  Nama Astacala berasal dari Bahasa Kawi yang berarti gunung di sebelah barat tempat matahari terbenam. 
                  Kalimat ini bermakna bahwa Astacala yang berkedudukan di Jawa Barat memiliki keanggotaan sampai akhir hayat.
                </p>
                <h3 className="text-xl font-bold text-white mt-8 mb-3">Ikrar Astacala</h3>
                <p>Ikrar Astacala adalah sebagai berikut.</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Percaya dan taqwa kepada Tuhan Yang Maha Esa</li>
                  <li>Mengabdi pada bangsa dan tanah air</li>
                  <li>Menjunjung tinggi nama baik Astacala dan institusi</li>
                  <li>Memelihara alam beserta isinya</li>
                </ul>
              </div>
            )}
            
            {activeTab === 'visi' && (
              <div className="text-gray-300 space-y-6">
                <h2 className="text-2xl font-bold text-red-500 mb-4">Visi dan Misi</h2>
                
                <div className="bg-gray-800 rounded-lg p-6 border-l-4 border-red-500 mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">Visi</h3>
                  <p>
                    Menjaga dan melestarikan lingkungan hidup dan meningkatkan keterampilan serta kemampuan 
                    kegiatan alam terbuka
                  </p>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-6 border-l-4 border-red-500">
                  <h3 className="text-xl font-bold text-white mb-4">Misi</h3>
                  <ul className="list-disc pl-6 space-y-4">
                    <li>
                      Meningkatkan kepedulian anggota akan arti penting kelestarian lingkungan hidup sebagai 
                      media kegiatan Astacala
                    </li>
                    <li>
                      Mensosialisasikan dan memberdayakan segenap unsur yang ada di luar Astacala baik di dalam 
                      maupun di luar kampus Universitas Telkom untuk mendukung kegiatan kelestarian lingkungan hidup
                    </li>
                  </ul>
                </div>
              </div>
            )}
            
            {activeTab === 'anggota' && (
              <div className="text-gray-300 space-y-6">
                <h2 className="text-2xl font-bold text-red-500 mb-4">Keanggotaan</h2>
                <p>
                  Sistem keanggotaan Astacala ada tiga. Yaitu anggota biasa, anggota muda, dan anggota kehormatan.
                </p>
                <p>
                  Syarat menjadi anggota Astacala adalah mahasiswa Universitas Telkom dan mengikuti Pendidikan Dasar 
                  Astacala untuk selanjutnya dilantik menjadi anggota muda. Setelah itu anggota muda akan mengikuti 
                  Pendidikan Lanjut atau sekolah-sekolah untuk nantinya dilantik menjadi anggota biasa. Sedangkan 
                  anggota kehormatan adalah seseorang yang diangkat menjadi anggota Astacala karena jasa-jasanya 
                  atau pun hal-hal lain yang telah dipertimbangkan.
                </p>
                
                <h3 className="text-xl font-bold text-white mt-8 mb-4">Angkatan Astacala</h3>
                <p className="mb-4">
                  Dalam perkembangannya hingga saat ini Astacala memiliki angkatan sebagai berikut. Setiap angkatan 
                  memiliki nama yang unik karena ini adalah sebuah representasi makna yang mengikat mereka sebagai kesatuan angkatan.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <span className="text-red-500 font-semibold">Perintis</span> (1992)
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <span className="text-red-500 font-semibold">Honje</span> (1993)
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <span className="text-red-500 font-semibold">Sondari</span> (1994)
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <span className="text-red-500 font-semibold">Tapak Semangat</span> (1995)
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <span className="text-red-500 font-semibold">Api</span> (1996)
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <span className="text-red-500 font-semibold">Elang Rimba</span> (1997)
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <span className="text-red-500 font-semibold">Telapak Bara</span> (1998)
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <span className="text-red-500 font-semibold">Pakis Senja</span> (1999)
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <span className="text-red-500 font-semibold">Badai Gunung</span> (2000)
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <span className="text-red-500 font-semibold">Air</span> (2002)
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <span className="text-red-500 font-semibold">Kabut Fajar</span> (2003)
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <span className="text-red-500 font-semibold">Angin Utara</span> (2004)
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <span className="text-red-500 font-semibold">Mentari Pagi</span> (2005)
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <span className="text-red-500 font-semibold">Kawah Asa</span> (2006)
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <span className="text-red-500 font-semibold">Jejak Rimba</span> (2007)
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <span className="text-red-500 font-semibold">Lembah Purnama</span> (2008)
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <span className="text-red-500 font-semibold">Kabut Belantara</span> (2009)
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <span className="text-red-500 font-semibold">Angin Puncak</span> (2010)
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <span className="text-red-500 font-semibold">Lembah Hujan</span> (2011)
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <span className="text-red-500 font-semibold">Mentari Gunung</span> (2012)
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <span className="text-red-500 font-semibold">Api Fajar</span> (2013)
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <span className="text-red-500 font-semibold">Cakar Alam</span> (2014)
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <span className="text-red-500 font-semibold">Duri Samsara</span> (2015)
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <span className="text-red-500 font-semibold">Lentera Cakrawala</span> (2016)
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <span className="text-red-500 font-semibold">Gemuruh Langit</span> (2017)
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <span className="text-red-500 font-semibold">Gema Bara</span> (2018)
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <span className="text-red-500 font-semibold">Rawa Embun</span> (2019)
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <span className="text-red-500 font-semibold">Jemari Bumantara</span> (2020)
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <span className="text-red-500 font-semibold">Kelana Halimun</span> (2022)
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <span className="text-red-500 font-semibold">Riuh Rembulan</span> (2023)
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <span className="text-red-500 font-semibold">Rintik Mentari</span> (2023)
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'pendidikan' && (
              <div className="text-gray-300 space-y-6">
                <h2 className="text-2xl font-bold text-red-500 mb-4">Pendidikan</h2>
                <p className="mb-4">
                  Sebagai organisasi pendidikan, Astacala selalu menyelenggarakan pendidikan alam terbuka untuk anggotanya.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Pendidikan Rutin</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        Pendidikan Dasar Astacala (setiap tahun)
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        Pendidikan Lanjut Fotografi & Jurnalistik (setiap tahun)
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        Pendidikan Lanjut Navigasi Darat (setiap tahun)
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        Pendidikan Lanjut Gunung Hutan (setiap tahun)
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        Pendidikan Lanjut Search & Rescue (setiap tahun)
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        Pendidikan Lanjut Arung Jeram (setiap tahun)
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        Pendidikan Lanjut Panjat Tebing (setiap tahun)
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        Pendidikan Lanjut Penelusuran Gua (setiap tahun)
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        Pendidikan Instruktur / Pelatih (setiap tahun)
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Pelatihan Khusus</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        Pelatihan Paralayang (2001, 2010, 2021-2024)
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        Pelatihan Selam (2009, 2010, 2011)
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        Pelatihan Kayak (2014)
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        Pendidikan Kader Konservasi MBSC (2005, 2015, 2017, 2018)
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        Pendidikan Kader Konservasi Sancang Conservation Service Camp (2018)
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        Pelatihan CISCO Fundamental (setiap tahun)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'kegiatan' && (
              <div className="text-gray-300 space-y-6">
                <h2 className="text-2xl font-bold text-red-500 mb-4">Penyelenggara Kegiatan</h2>
                <p className="mb-4">
                  Beberapa kegiatan alam terbuka yang diselenggarakan untuk civitas akademika kampus, kalangan profesional 
                  di bidang petualangan, dan untuk masyarakat umum.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Kegiatan Rutin</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        Astacala Fun Camping (setiap tahun)
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        Astacala Fun Climbing (setiap tahun)
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        Astacala Fun Rafting (setiap tahun)
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        Astacala Fun Caving (setiap tahun)
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        Astacala Fun Diving (setiap tahun)
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Kegiatan Khusus</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        Astacala Lintas Alam (1993, 1994, 1995, 2001, 2003, 2005, 2008, 2009, 2011, 2014)
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        Astacala National Open Wall Climbing Competition (1995)
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        Astacala Orientering dan Lintas Alam (1998)
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        Astacala Mountaineering Course (2013)
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        Astacala Telkom University Sport Climbing Competition (2017)
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-6 mt-6">
                  <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Jabatan dalam Komunitas</h3>
                  <p className="mb-4">
                    Astacala juga pernah menempati beberapa jabatan dalam komunitas kepecintaalaman tingkat daerah 
                    maupun nasional di Indonesia sebagai berikut.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      Pusat Informasi Nasional Mapala Se-Indonesia (1999-2001)
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      Pusat Koordinasi Daerah Mapala Se-Jawa Barat (2006-2007, 2009-2010, 2013-2014)
                    </li>
                  </ul>
                </div>
              </div>
            )}
            
            {activeTab === 'ekspedisi' && (
              <div className="text-gray-300 space-y-6">
                <h2 className="text-2xl font-bold text-red-500 mb-4">Kegiatan Ekspedisi</h2>
                <p className="mb-4">
                  Beberapa kegiatan ekspedisi yang dilakukan oleh Astacala adalah sebagai berikut.
                </p>
                
                <div className="space-y-4">
                  {[
                    {
                      year: "1994",
                      title: "Ekspedisi Pendataan Flora & Fauna di TN Ujung Kulon, Banten"
                    },
                    {
                      year: "1995",
                      title: "Ekspedisi Pendataan Gunung dan Flora & Fauna di  Jawa Timur"
                    },
                    {
                      year: "1997",
                      title: "Ekspedisi Penelitian Harimau Jawa bersama PL KAPAI di TN Meru Betiri, Jawa Timur"
                    },
                    {
                      year: "2011",
                      title: "Ekspedisi Penelusuran dan Pemetaan Gua di Nusa Kambangan, Jawa Tengah"
                    },
                    {
                      year: "2013",
                      title: 'Ekspedisi Panjat Tebing "ATEX 2013 – Facing Giant Rock" di Batu Lawi, Serawak, Malaysia'
                    },
                    {
                      year: "2018-2019",
                      title: "Ekspedisi Penelitian Harimau Jawa bersama Pecinta Alam Indonesia di TN Ujung Kulon, Banten"
                    },
                    {
                      year: "2018",
                      title: 'Ekspedisi Pendakian Gunung "ATEX 2018 – Reach The Roof of Afrika" di Kilimanjaro, Tanzania'
                    },
                    {
                      year: "2018",
                      title: 'Ekspedisi Panjat Tebing "ATEX 2018 – Facing Giant Rock" di Nam Pha Pa Yai, Saraburi, Thailand'
                    },
                    {
                      year: "2024",
                      title: 'Ekspedisi Pendakian Gunung "ATEX 2024 – Reach The Roof of Europe" di Elbrus, Rusia'
                    }
                  ].map((expedition, index) => (
                    <div key={index} className="flex items-start gap-4 bg-gray-800 p-4 rounded-lg">
                      <div className="min-w-[80px] bg-red-600 text-white text-center py-1 px-2 rounded font-semibold">
                        {expedition.year}
                      </div>
                      <div>{expedition.title}</div>
                    </div>
                  ))}
                </div>
                
                <p className="mt-4 italic">
                  Serta berbagai kegiatan penjelajahan lain di gunung, sungai, tebing, gua, laut, dan udara.
                </p>
              </div>
            )}
            
            {activeTab === 'pengabdian' && (
              <div className="text-gray-300 space-y-6">
                <h2 className="text-2xl font-bold text-red-500 mb-4">Kegiatan Pengabdian Lingkungan dan Masyarakat</h2>
                <p className="mb-4">
                  Kegiatan pengabdian lingkungan dan pengabdian masyarakat yang telah terwujud.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { year: "1992 - Sekarang", activity: "Pengadaan dan Penyediaan Bibit Pohon" },
                    { year: "1999 - 2002", activity: "Daur Ulang Kertas Bekas" },
                    { year: "2007", activity: 'Pembuatan Film "Airku Hidupku" bersama Cepot' },
                    { year: "2010", activity: "Pengajaran Komputer dan Olah Barang Bekas di SD N Mengger" },
                    { year: "2010", activity: "Seminar Lingkungan dan Pemutaran Film di Sukapura, Bandung" },
                    { year: "2011", activity: "Seminar Lingkungan dan Hari Bumi di IT Telkom, Bandung" },
                    { year: "2012", activity: "Seminar IT Day di SD N Tangsijaya, Ciwidey, Bandung" },
                    { year: "2012", activity: "Penanaman Pohon Bersama FAST" },
                    { year: "2012", activity: 'Pemutaran Film "Pelangi di Citarum" bersama Green Peace' },
                    { year: "2013", activity: "Pengabdian Masyarakat di Cimonyong, Naringgul, Cianjur" }
                  ].map((item, index) => (
                    <div key={index} className="bg-gray-800 p-3 rounded-lg flex flex-col">
                      <span className="text-red-500 font-semibold text-sm mb-1">{item.year}</span>
                      <span>{item.activity}</span>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {[
                    { year: "2015", activity: "Pengabdian Masyarakat di Pasirjambu, Ciwidey, Bandung" },
                    { year: "2017", activity: "Pengabdian Masyarakat di Tarumajaya, Kertasari, Bandung" },
                    { year: "2017", activity: "Sarasehan Pecinta Alam di  Universitas Telkom" },
                    { year: "2018", activity: 'Pengabdian Masyarakat "Kelas Inspirasi Citarum" di Tarumajaya, Kertasari, Bandung' },
                    { year: "2018-2019", activity: "Partisipasi dalam Program Citarum Harum" },
                    { year: "2020 - Sekarang", activity: 'Program Jumat Bermanfaat "Bersih Sampah, Tanam Pohon, dll"' }
                  ].map((item, index) => (
                    <div key={index} className="bg-gray-800 p-3 rounded-lg flex flex-col">
                      <span className="text-red-500 font-semibold text-sm mb-1">{item.year}</span>
                      <span>{item.activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'tanggap' && (
              <div className="text-gray-300 space-y-6">
                <h2 className="text-2xl font-bold text-red-500 mb-4">Misi Kemanusiaan dan Tanggap Bencana</h2>
                <p className="mb-4">
                  Misi pencarian orang hilang, kemanusiaan, dan tanggap bencana yang pernah dilakukan.
                </p>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Search and Rescue (SAR)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { year: "2000", location: "Gunung Argopuro" },
                        { year: "2000", location: "Gunung Cikuray" },
                        { year: "2001", location: "Gunung Slamet" },
                        { year: "2011", location: "Sungai Cikandang" },
                        { year: "2013", location: "Gunung Kendeng" }
                      ].map((mission, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <div>
                            <span className="text-red-400 font-medium">{mission.year}</span> - SAR {mission.location}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Tanggap Bencana</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { year: "2004-2005", event: "Tsunami Aceh" },
                        { year: "2006", event: "Gempa Jogja dan Jawa Tengah" },
                        { year: "2006", event: "Tsunami Pangandaran" },
                        { year: "2009", event: "Gempa Padang" },
                        { year: "2010", event: "Gempa Mentawai" },
                        { year: "2010", event: "Erupsi Gunung Merapi" },
                        { year: "2010", event: "Longsor Ciwidey" },
                        { year: "2014", event: "Erupsi Gunung Kelud" },
                        { year: "2014", event: "Longsor Banjarnegara" },
                        { year: "2016", event: "Banjir Garut" },
                        { year: "2017-2018", event: "Erupsi Gunung Agung" },
                        { year: "2018", event: "Tsunami Selat Sunda" },
                        { year: "2018", event: "Gempa Lombok" },
                        { year: "2020", event: "Banjir Jabodetabek" },
                        { year: "2020", event: "Tanah Longsor Garut" },
                        { year: "2021", event: "Banjir dan Tanah Longsor Sumedang" },
                        { year: "2021-2022", event: "Erupsi Gunung Semeru" },
                        { year: "2022", event: "Gempa Cianjur" },
                        { year: "2023", event: "Banjir Bandung Selatan" }
                      ].map((mission, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <div>
                            <span className="text-red-400 font-medium">{mission.year}</span> - {mission.event}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
        
        {/* Yayasan Section */}
        <section className="max-w-7xl mx-auto px-4 pb-16">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 relative overflow-hidden">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M0 20 L40 20 M20 0 L20 40" stroke="white" strokeWidth="1" fill="none" />
                </pattern>
                <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern)" />
              </svg>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Yayasan Astacala (Astacala Foundation)</h2>
              <p className="text-gray-300 mb-6 max-w-3xl">
                Yayasan Astacala (Astacala Foundation) atau yang sering disingkat Yasta adalah lembaga yang bergerak 
                di bidang sosial, lingkungan, dan kemanusiaan. Mewadahi seluruh anggota Astacala baik yang telah lulus 
                maupun yang masih aktif di kampus Universitas Telkom untuk tetap berpartisipasi dan mendukung segala 
                macam upaya konservasi lingkungan hidup dan misi kemanusiaan.
              </p>
              
              <a 
                href="https://www.astacalafoundation.or.id" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                Kunjungi Website Yayasan Astacala
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H3a1 1 0 110-2h9.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}