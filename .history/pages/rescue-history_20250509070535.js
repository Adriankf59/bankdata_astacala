import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import { useState } from 'react';

// Mock data for rescue operations
const rescueOperations = [
  {
    id: 1,
    title: "Evakuasi Pendaki di Gunung Merapi",
    date: "15 Juni 2024",
    location: "Gunung Merapi, Yogyakarta",
    type: "mountain",
    description: "Tim Astacala berhasil mengevakuasi 3 pendaki yang terjebak di lereng Gunung Merapi akibat cuaca buruk. Operasi evakuasi berlangsung selama 6 jam dan melibatkan 12 anggota tim.",
    team: "Tim Alpha",
    casualties: "0 korban jiwa, 1 cedera ringan",
    image: "/rescue-merapi.jpg",
    details: "Tim melakukan pendakian selama 3 jam untuk mencapai lokasi korban. Evakuasi dilakukan dengan teknik rappelling untuk menuruni tebing curam. Kondisi kabut tebal dan hujan lebat menjadi tantangan utama dalam operasi ini."
  },
  {
    id: 2,
    title: "Pencarian Pendaki Hilang di Merbabu",
    date: "22 Juli 2024",
    location: "Gunung Merbabu, Jawa Tengah",
    type: "mountain",
    description: "Operasi pencarian selama 2 hari untuk menemukan 2 pendaki yang tersesat di Gunung Merbabu. Keduanya ditemukan dalam kondisi dehidrasi di area hutan yang jarang dilalui.",
    team: "Tim Bravo & Charlie",
    casualties: "0 korban jiwa, 2 dehidrasi",
    image: "/rescue-merbabu.jpg",
    details: "Operasi pencarian melibatkan 20 anggota tim menggunakan sistem grid dan bantuan drone untuk pemetaan area. Pendaki ditemukan di lembah tersembunyi sekitar 5km dari jalur pendakian resmi."
  },
  {
    id: 3,
    title: "Evakuasi Korban Kecelakaan Caving",
    date: "5 Agustus 2024",
    location: "Goa Jomblang, Yogyakarta",
    type: "cave",
    description: "Evakuasi penyelam gua yang terjebak di sistem gua bawah tanah setelah peralatan selam mengalami kerusakan. Korban berhasil diselamatkan setelah operasi 8 jam.",
    team: "Tim Delta",
    casualties: "0 korban jiwa, 1 hipotermia",
    image: "/rescue-jomblang.jpg",
    details: "Tim spesialis caving Astacala berhasil menembus sistem gua yang sempit dan terendam air untuk mencapai korban. Seorang anggota tim membawa peralatan selam cadangan untuk membantu korban keluar."
  },
  {
    id: 4,
    title: "Penyelamatan Climber di Tebing Citatah",
    date: "17 September 2024",
    location: "Tebing Citatah, Jawa Barat",
    type: "climb",
    description: "Penyelamatan pemanjat tebing yang mengalami cedera saat melakukan free climbing. Korban terjebak di ketinggian 70 meter dan tidak dapat turun sendiri.",
    team: "Tim Echo",
    casualties: "0 korban jiwa, 1 patah kaki",
    image: "/rescue-citatah.jpg",
    details: "Tim menggunakan teknik high-angle rescue untuk mencapai korban dan menurunkannya dengan tandu khusus. Angin kencang dan kondisi tebing yang rapuh menjadi tantangan utama operasi."
  },
  {
    id: 5,
    title: "Evakuasi Korban Longsor",
    date: "3 Oktober 2024",
    location: "Banjarnegara, Jawa Tengah",
    type: "disaster",
    description: "Astacala bergabung dengan tim SAR nasional untuk evakuasi korban longsor yang menimpa pemukiman warga. Tim berhasil menyelamatkan 7 orang yang terjebak dalam reruntuhan.",
    team: "Tim Gabungan",
    casualties: "2 korban jiwa, 5 luka-luka",
    image: "/rescue-banjarnegara.jpg",
    details: "Operasi evakuasi berlangsung selama 3 hari dengan kondisi tanah masih labil. Tim Astacala fokus pada pencarian korban menggunakan peralatan deteksi dan anjing pelacak."
  }
];

// Filter options for the rescue types
const FILTERS = [
  { label: 'All Operations', value: 'all' },
  { label: 'Mountain Rescue', value: 'mountain' },
  { label: 'Cave Rescue', value: 'cave' },
  { label: 'Climbing Rescue', value: 'climb' },
  { label: 'Disaster Relief', value: 'disaster' },
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
              Dokumentasi operasi penyelamatan yang telah dilakukan oleh Tim Astacala. 
              Setiap misi menunjukkan dedikasi kami untuk keselamatan dan penyelamatan di alam bebas.
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
                              <img 
                                src={rescue.image} 
                                alt={rescue.title} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-4xl text-red-500">
                                <i className="fas fa-mountain"></i>
                              </div>
                            )}
                          </div>
                          
                          {/* Operation type badge */}
                          <div className="absolute top-3 right-3">
                            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-md uppercase font-semibold">
                              {rescue.type}
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
                Astacala selalu mencari relawan yang berkomitmen untuk operasi penyelamatan. 
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