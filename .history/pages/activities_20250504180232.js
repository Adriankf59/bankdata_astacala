import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import { useState } from 'react';

const activities = [
  {
    title: 'Rock Climbing',
    image: '/images/rock-climbing.jpg',
    desc: 'Experience the thrill of climbing with breathtaking views from the top.',
    link: '/activities/rock-climbing',
    type: 'rock climbing',
  },
  {
    title: 'Caving',
    image: '/images/caving.jpg',
    desc: 'Discover the hidden world beneath with our thrilling caving adventures.',
    link: '/activities/caving',
    type: 'caving',
  },
  {
    title: 'Rafting',
    image: '/images/rafting.jpg',
    desc: 'Navigate wild rivers and enjoy the adrenaline rush with our rafting activities.',
    link: '/activities/rafting',
    type: 'rafting',
  },
  {
    title: 'Diving',
    image: '/images/diving.jpg',
    desc: 'Explore underwater worlds and marine life with our diving experiences.',
    link: '/activities/diving',
    type: 'diving',
  },
  {
    title: 'Conservation',
    image: '/images/conservation.jpg',
    desc: 'Join our conservation efforts to protect nature and wildlife.',
    link: '/activities/conservation',
    type: 'conservation',
  },
  {
    title: 'Paralayang',
    image: '/images/paralayang.jpg',
    desc: 'Soar high and enjoy breathtaking views with our paragliding (paralayang) activities.',
    link: '/activities/paralayang',
    type: 'paralayang',
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
  const filtered = selected === 'all' ? activities : activities.filter(a => a.type === selected);

  return (
    <>
      <Header />
      <main className="bg-[#f6f6f6] min-h-screen flex flex-col justify-between">
        <div className="max-w-7xl mx-auto w-full px-4 pt-8 pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Kegiatan Alam Bebas Kami</h1>
            <div className="flex flex-wrap gap-2">
              {FILTERS.map(f => (
                <button
                  key={f.value}
                  className={`px-4 py-2 rounded-full font-semibold text-sm border transition-colors ${selected === f.value ? 'bg-[#2dd4bf] text-white border-[#2dd4bf]' : 'bg-white text-gray-700 border-gray-300 hover:bg-[#e0fdfa]'}`}
                  onClick={() => setSelected(f.value)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.length === 0 ? (
              <div className="col-span-full text-center text-gray-400 py-16">No activities found.</div>
            ) : (
              filtered.map((act, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-md p-0 flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                  <div className="h-44 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img src={act.image} alt={act.title} className="object-cover w-full h-full" />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h2 className="text-lg font-bold text-gray-900 mb-1">{act.title}</h2>
                    <p className="text-sm text-gray-700 mb-4 flex-1">{act.desc}</p>
                    <Link href={act.link} className="text-[#2dd4bf] text-sm font-semibold hover:underline mt-auto">Learn More</Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
