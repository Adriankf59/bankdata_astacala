import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import { useState } from 'react';

const activities = [
  {
    title: 'Rock Climbing',
    image: '/rock-climbing.jpg',
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
    image: '/conservation.jpg',
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
      <main className="bg-black min-h-screen flex flex-col justify-between">
        <div className="max-w-7xl mx-auto w-full px-4 pt-8 pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Kegiatan Alam Bebas Kami</h1>
            <div className="flex flex-wrap gap-2">
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-16">No activities found.</div>
            ) : (
              filtered.map((act, idx) => (
                <div key={idx} className="bg-gray-900 rounded-2xl shadow-md p-0 flex flex-col overflow-hidden hover:shadow-red-900/20 hover:shadow-lg transition-shadow duration-300 border border-gray-800">
                  <div className="h-44 w-full bg-gray-800 flex items-center justify-center overflow-hidden">
                    <img src={act.image} alt={act.title} className="object-cover w-full h-full" />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h2 className="text-lg font-bold text-white mb-1">{act.title}</h2>
                    <p className="text-sm text-gray-400 mb-4 flex-1">{act.desc}</p>
                    <Link 
                      href={act.link} 
                      className="text-red-500 text-sm font-semibold hover:text-red-400 hover:underline mt-auto flex items-center"
                    >
                      Learn More
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
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