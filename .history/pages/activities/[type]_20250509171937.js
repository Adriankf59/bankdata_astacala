import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';

const activitiesData = {
  'rock-climbing': {
    title: 'Rock Climbing',
    image: '/rock-climbing.jpg',
    description: "Explore the heights of Astacala's mountains with our Rock Climbing Division. Learn about safe climbing techniques, equipment, and join our thrilling expeditions.",
    features: [
      { icon: 'fas fa-book', label: 'Climbing Techniques' },
      { icon: 'fas fa-tools', label: 'Equipment Essentials' },
      { icon: 'fas fa-shield-alt', label: 'Safety Protocols' },
    ],
    // Table will be populated from API data
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
    table: {
      columns: [
        { key: 'name', label: 'Nama Lokasi' },
        { key: 'coordinate', label: 'Koordinat' },
        { key: 'description', label: 'Deskripsi' },
        { key: 'city', label: 'Kota' },
        { key: 'province', label: 'Provinsi' },
        { key: 'rop', label: 'ROP (Google Drive Link)' },
        { key: 'depth', label: 'Kedalaman' },
        { key: 'type', label: 'Vertikal/Horizontal' },
      ],
      rows: [
        {
          name: 'Mount Merapi',
          coordinate: '-7.5407, 110.4420',
          description: 'Tebing tinggi dengan pemandangan luar biasa.',
          city: 'Sleman',
          province: 'Yogyakarta',
          rop: 'https://drive.google.com/rop-merapi',
          depth: '500m',
          type: 'Vertikal',
        },
        {
          name: 'Goa Jatijajar',
          coordinate: '-7.7419, 109.8503',
          description: 'Gua dengan stalaktit dan stalagmit indah.',
          city: 'Kebumen',
          province: 'Jawa Tengah',
          rop: 'https://drive.google.com/rop-jatijajar',
          depth: '120m',
          type: 'Horizontal',
        },
      ],
    },
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
};

export default function ActivityDetail({ type, apiData }) {
  const router = useRouter();
  
  // Handle fallback
  if (router.isFallback) {
    return <div className="text-center py-20 bg-black text-white">Loading...</div>;
  }

  // If type is not valid, show error
  if (!type || !activitiesData[type]) {
    return <div className="text-center py-20 bg-black text-white">Activity not found.</div>;
  }

  const activity = { ...activitiesData[type] };

  // Create table data for rock climbing based on API data
  if (type === 'rock-climbing' && apiData) {
    const firstItem = apiData.data[0];
    
    // Create columns based on the first item keys
    const columns = Object.keys(firstItem)
      .filter(key => key !== 'id' && key !== 'no') // Exclude id and no
      .map(key => {
        // Map key to more user-friendly label
        let label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        // Special case for specific keys
        if (key === 'nama_lokasi') label = 'Nama Lokasi';
        if (key === 'titik_koordinat') label = 'Koordinat';
        if (key === 'link_rop') label = 'ROP Link';
        
        return { key, label };
      });
    
    activity.table = {
      columns,
      rows: apiData.data
    };
  }

  return (
    <>
      <Header />
      <main className="bg-black min-h-screen">
        {/* Main Card */}
        <div className="max-w-7xl mx-auto w-full px-4 pt-6 pb-2">
          <div className="bg-gray-900 rounded-xl shadow flex flex-col md:flex-row p-6 gap-6 items-center mb-6 border border-gray-800">
            <img src={activity.image} alt={activity.title} className="w-48 h-36 object-cover rounded-lg" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-red-500 mb-2">{activity.title}</h1>
              <p className="text-gray-300 text-base md:text-lg">{activity.description}</p>
            </div>
          </div>

          {/* Features */}
          <div className="bg-gray-900 rounded-xl shadow flex flex-col md:flex-row justify-between items-center p-6 mb-6 gap-6 border border-gray-800">
            {activity.features.map((f, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1">
                <div className="bg-red-600 text-white rounded-full w-14 h-14 flex items-center justify-center text-2xl mb-2">
                  <i className={f.icon}></i>
                </div>
                <Link href={`/activities/${type}/${f.label.toLowerCase().replace(/\s+/g, '-')}`} legacyBehavior>
                  <a className="font-semibold text-red-500 hover:text-red-400 hover:underline text-center">{f.label}</a>
                </Link>
              </div>
            ))}
          </div>

          {/* Location Table */}
          <div className="bg-gray-900 rounded-xl shadow p-6 border border-gray-800">
            <h2 className="text-lg md:text-xl font-bold mb-4 text-red-500">Lokasi Kegiatan</h2>
            
            {activity.table ? (
              <div className="overflow-x-auto">
                <table className="table-auto w-full">
                  <thead>
                    <tr className="bg-red-600 text-white">
                      {activity.table.columns.map((col) => (
                        <th key={col.key} className="py-2 px-4 text-left font-semibold">{col.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activity.table.rows.map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-700 last:border-b-0 hover:bg-gray-800">
                        {activity.table.columns.map((col) => (
                          <td key={col.key} className="py-2 px-4 text-gray-300">
                            {col.key === 'link_rop' ? (
                              <a 
                                href={row[col.key]} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-red-500 underline font-semibold hover:text-red-400"
                              >
                                Link ROP
                              </a>
                            ) : col.key === 'titik_koordinat' ? (
                              <a 
                                href={`https://www.google.com/maps/search/?api=1&query=${row[col.key]}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 hover:underline"
                              >
                                {row[col.key] || 'N/A'}
                              </a>
                            ) : (
                              row[col.key] || 'N/A'
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-4 text-gray-400">No location data available.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <style jsx>{`
        h1, h2, h3, h4, h5, h6 {
          color: #dc2626;
        }
      `}</style>
    </>
  );
}

// This function gets called at build time
export async function getStaticPaths() {
  // Define the paths we want to pre-render
  const paths = [
    { params: { type: 'rock-climbing' } },
    { params: { type: 'caving' } },
    { params: { type: 'rafting' } },
    { params: { type: 'diving' } },
    { params: { type: 'conservation' } },
    { params: { type: 'paralayang' } }
  ];
  
  // We'll pre-render only these paths at build time
  // { fallback: false } means other routes should 404
  // { fallback: true } would enable SSR for paths not returned by getStaticPaths
  return { paths, fallback: false };
}

// This function gets called at build time
export async function getStaticProps({ params }) {
  const { type } = params;
  
  // Fetch data based on type
  let apiData = null;
  
  if (type === 'rock-climbing') {
    try {
      const res = await fetch('http://ec2-13-239-62-109.ap-southeast-2.compute.amazonaws.com/items/rock_climbing');
      apiData = await res.json();
    } catch (error) {
      console.error('Failed to fetch rock climbing data:', error);
      // Continue with null data, the UI will handle it
    }
  }
  
  // Pass data to the page via props
  return { 
    props: { 
      type,
      apiData
    },
    // Re-generate the page at most once per 60 seconds
    // if a request comes in
    revalidate: 60, // In seconds
  };
}