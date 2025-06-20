import Header from '../components/Header';
import Footer from '../components/Footer';
import { memo } from 'react';
import Head from 'next/head';

// Constants
const SOCIAL_MEDIA = [
  {
    name: 'Facebook',
    url: 'https://facebook.com/astacala',
    icon: 'fab fa-facebook-f',
    color: '#1877F2',
    username: '@astacala'
  },
  {
    name: 'X (Twitter)',
    url: 'https://x.com/astacala',
    icon: 'fab fa-x-twitter',
    color: '#000000',
    username: '@astacala'
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/astacala',
    icon: 'fab fa-instagram',
    color: '#E1306C',
    username: '@astacala'
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com/c/PMPAAstacala',
    icon: 'fab fa-youtube',
    color: '#FF0000',
    username: 'Astacala Official'
  }
];

const DIRECT_CONTACT = [
  {
    name: 'Instagram DM',
    url: 'https://instagram.com/astacala',
    icon: 'fab fa-instagram',
    color: '#E1306C',
    description: 'Kirim DM ke Instagram kami',
    buttonText: 'Kirim DM'
  },
  {
    name: 'WhatsApp',
    url: 'https://wa.me/6285383206355',
    icon: 'fab fa-whatsapp',
    color: '#25D366',
    description: 'Chat langsung via WhatsApp',
    buttonText: 'Chat WhatsApp'
  },
  {
    name: 'Email',
    url: 'mailto:adriancuman@astacala.org',
    icon: 'fas fa-envelope',
    color: '#DC2626',
    description: 'adriancuman@astacala.org',
    buttonText: 'Kirim Email'
  }
];

const CONTACT_INFO = {
  address: {
    building: 'Student Hall (Gate 4)',
    university: 'Universitas Telkom',
    street: 'Terusan Buah Batu, Bandung 40257',
    province: 'Jawa Barat, Indonesia'
  },
  googleMapsUrl: 'https://maps.app.goo.gl/MXwdDFCLWrziMQ2g6?g_st=com.google.maps.preview.copy',
  hours: [
    { day: 'Senin - Minggu', time: '07:00 - 24:00' },
    { day: 'Setiap Hari', time: 'Buka' }
  ]
};

// Memoized components
const SocialMediaCard = memo(({ platform }) => (
  <a 
    href={platform.url}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 group hover:border-gray-700"
  >
    <div className="p-6 sm:p-8 flex flex-col items-center text-center">
      <div 
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-4 group-hover:shadow-lg transition-all duration-300"
        style={{ 
          background: `linear-gradient(135deg, ${platform.color}33 0%, ${platform.color}22 100%)`,
          borderLeft: `3px solid ${platform.color}`,
          borderBottom: `3px solid ${platform.color}`
        }}
      >
        <i className={`${platform.icon} text-3xl sm:text-4xl text-white`} style={{ color: platform.color }}></i>
      </div>
      
      <h3 className="text-white text-lg sm:text-xl font-bold mb-2">{platform.name}</h3>
      <p className="text-gray-400 mb-4 text-sm sm:text-base">{platform.username}</p>
      
      <span className="bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-semibold group-hover:bg-red-600 transition-colors duration-300">
        Follow Us
      </span>
    </div>
  </a>
));

SocialMediaCard.displayName = 'SocialMediaCard';

const DirectContactCard = memo(({ contact }) => (
  <a 
    href={contact.url}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300 group hover:transform hover:scale-[1.02]"
  >
    <div className="flex items-center gap-4 mb-4">
      <div 
        className="w-14 h-14 rounded-full flex items-center justify-center group-hover:shadow-lg transition-all duration-300"
        style={{ 
          background: `linear-gradient(135deg, ${contact.color}33 0%, ${contact.color}22 100%)`,
          borderLeft: `2px solid ${contact.color}`,
          borderBottom: `2px solid ${contact.color}`
        }}
      >
        <i className={`${contact.icon} text-2xl`} style={{ color: contact.color }}></i>
      </div>
      <div className="flex-1">
        <h4 className="text-white font-bold text-lg">{contact.name}</h4>
        <p className="text-gray-400 text-sm">{contact.description}</p>
      </div>
    </div>
    
    <div 
      className="w-full py-3 px-4 rounded-lg text-center font-semibold text-white transition-all duration-300 group-hover:shadow-lg"
      style={{ backgroundColor: contact.color }}
    >
      {contact.buttonText}
      <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
    </div>
  </a>
));

DirectContactCard.displayName = 'DirectContactCard';

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact Us - Astacala</title>
        <meta name="description" content="Contact Astacala through our social media channels or reach us directly via Instagram DM, WhatsApp, or Email." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <Header />
      <main className="bg-black min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 -left-4 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
            <div className="absolute top-40 -right-4 w-72 h-72 bg-red-600 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-40 w-72 h-72 bg-red-700 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative h-60 sm:h-80 z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black"></div>
          
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4">Hubungi Kami</h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl">
              Terhubung dengan Astacala melalui berbagai platform komunikasi. Kami siap melayani Anda!
            </p>
          </div>
        </section>
        
        {/* Direct Contact Section */}
        <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-8 sm:mb-12">Hubungi Kami Langsung</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {DIRECT_CONTACT.map((contact) => (
              <DirectContactCard key={contact.name} contact={contact} />
            ))}
          </div>
        </section>

        {/* Social Media Section */}
        <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-8 sm:mb-12">Media Sosial Kami</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {SOCIAL_MEDIA.map((platform) => (
              <SocialMediaCard key={platform.name} platform={platform} />
            ))}
          </div>
        </section>
        
        {/* Info Section */}
        <section className="py-12 sm:py-16 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              
              {/* Location Info */}
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 p-6 sm:p-8 hover:border-gray-700 transition-colors">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-6">Lokasi Kami</h3>
                
                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="bg-red-600/20 p-3 rounded-full flex-shrink-0">
                      <i className="fas fa-map-marker-alt text-red-500"></i>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-300 font-semibold mb-2">Alamat:</p>
                      <p className="text-gray-400">{CONTACT_INFO.address.building}</p>
                      <p className="text-gray-400">{CONTACT_INFO.address.university}</p>
                      <p className="text-gray-400">{CONTACT_INFO.address.street}</p>
                      <p className="text-gray-400">{CONTACT_INFO.address.province}</p>
                    </div>
                  </div>
                  
                  {/* Google Maps Button */}
                  <a 
                    href={CONTACT_INFO.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg group"
                  >
                    <i className="fas fa-map"></i>
                    <span>Buka di Google Maps</span>
                    <i className="fas fa-external-link-alt text-sm group-hover:translate-x-1 transition-transform"></i>
                  </a>
                </div>
              </div>
              
              {/* Operation Hours */}
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 p-6 sm:p-8 hover:border-gray-700 transition-colors">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-6">Jam Operasional</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-red-600/20 p-3 rounded-full flex-shrink-0">
                      <i className="fas fa-clock text-red-500"></i>
                    </div>
                    <div className="flex-1">
                      <div className="space-y-3">
                        {CONTACT_INFO.hours.map((schedule, index) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0">
                            <span className="text-gray-300 font-medium">{schedule.day}</span>
                            <span className="text-white font-semibold">{schedule.time}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 bg-green-900/30 border border-green-600/50 rounded-lg p-3">
                        <p className="text-green-400 text-sm flex items-center gap-2">
                          <i className="fas fa-check-circle"></i>
                          Kami buka setiap hari!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Map Section */}
        <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8">Temukan Kami di Peta</h2>
          
          <div className="rounded-xl overflow-hidden border border-gray-800 h-80 sm:h-96 hover:border-gray-700 transition-colors">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.3201239228736!2d107.62534481535224!3d-6.973006970190073!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e9adf177bf8d%3A0x437398556f9fa03!2sUniversitas%20Telkom!5e0!3m2!1sen!2sid!4v1652345678901!5m2!1sen!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Astacala Location Map"
              className="grayscale hover:grayscale-0 transition-all duration-500"
            ></iframe>
          </div>
        </section>

        {/* Quick Links Footer */}
        <section className="py-8 border-t border-gray-800 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-6">
              <span className="text-gray-400">Connect with us:</span>
              {SOCIAL_MEDIA.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl hover:scale-110 transition-transform"
                  style={{ color: platform.color }}
                  title={platform.name}
                >
                  <i className={platform.icon}></i>
                </a>
              ))}
            </div>
          </div>
        </section>

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
        `}</style>
      </main>
      <Footer />
    </>
  );
}