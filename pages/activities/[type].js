import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';

const activitiesData = {
  'rock-climbing': {
    title: 'Rock Climbing',
    image: '/images/rock-climbing.jpg',
    description: "Explore the heights of Astacala's mountains with our Rock Climbing Division. Learn about safe climbing techniques, equipment, and join our thrilling expeditions.",
    features: [
      { icon: 'fas fa-book', label: 'Climbing Techniques' },
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
        { name: 'Gunung Parang', region: 'Southern Range', accessibility: 'Moderate' },
        { name: 'Citatah', region: 'Western Highlands', accessibility: 'Challenging' },
      ],
    },
  },
  caving: {
    title: 'Caving Division',
    image: '/images/caving.jpg',
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
    image: '/images/rafting.jpg',
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
    image: '/images/diving.jpg',
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
    image: '/images/conservation.jpg',
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
    image: '/images/paralayang.jpg',
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

export default function ActivityDetail() {
  const router = useRouter();
  let { type } = router.query;

  if (!type || !activitiesData[type]) {
    return <div className="text-center py-20">Activity not found.</div>;
  }

  const activity = activitiesData[type];

  return (
    <>
      <Header />
      <main className="bg-[#f6f6f6] min-h-screen">
        {/* Card utama */}
        <div className="max-w-5xl mx-auto w-full px-4 pt-6 pb-2">
          <div className="bg-white rounded-xl shadow flex flex-col md:flex-row p-6 gap-6 items-center mb-6">
            <img src={activity.image} alt={activity.title} className="w-48 h-36 object-cover rounded-lg" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#2dd4bf] mb-2">{activity.title}</h1>
              <p className="text-gray-800 text-base md:text-lg">{activity.description}</p>
            </div>
          </div>

          {/* Fitur-fitur */}
          <div className="bg-white rounded-xl shadow flex flex-col md:flex-row justify-between items-center p-6 mb-6 gap-6">
            {activity.features.map((f, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1">
                <div className="bg-[#2dd4bf] text-white rounded-full w-14 h-14 flex items-center justify-center text-2xl mb-2">
                  <i className={f.icon}></i>
                </div>
                <Link href={`/activities/${type}/${f.label.toLowerCase().replace(/\s+/g, '-')}`} legacyBehavior>
                  <a className="font-semibold text-[#2dd4bf] hover:underline text-center">{f.label}</a>
                </Link>
              </div>
            ))}
          </div>

          {/* Tabel Lokasi dinamis */}
          {activity.table && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg md:text-xl font-bold mb-4 text-[#2dd4bf]">Lokasi Kegiatan</h2>
              <div className="overflow-x-auto">
                <table className="table-auto w-full">
                  <thead>
                    <tr className="bg-[#2dd4bf] text-white">
                      {activity.table.columns.map((col) => (
                        <th key={col.key} className="py-2 px-4 text-left font-semibold">{col.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activity.table.rows.map((row, idx) => (
                      <tr key={idx} className="border-b last:border-b-0">
                        {activity.table.columns.map((col) => (
                          <td key={col.key} className="py-2 px-4 text-gray-900">
                            {col.key === 'rop' ? (
                              <a href={row[col.key]} target="_blank" rel="noopener noreferrer" className="text-[#2dd4bf] underline font-semibold">Link ROP</a>
                            ) : (
                              row[col.key]
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <style jsx>{`
        h1, h2, h3, h4, h5, h6 {
          color: #2dd4bf;
        }
      `}</style>
    </>
  );
}
