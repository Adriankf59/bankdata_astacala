import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState, useCallback, memo } from 'react';
import Head from 'next/head';
import Image from 'next/image';

// Constants
const INITIAL_FORM_DATA = {
  name: '',
  email: '',
  subject: '',
  message: ''
};

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

const CONTACT_INFO = {
  address: {
    building: 'Gedung Astacala',
    university: 'Universitas Telkom',
    street: 'Jl. Telekomunikasi No. 1',
    area: 'Terusan Buah Batu, Bandung 40257',
    province: 'Jawa Barat, Indonesia'
  },
  email: 'adriancuman@astacala.org',
  phone: '+6282112345678',
  hours: [
    { day: 'Senin - Jumat', time: '09:00 - 17:00' },
    { day: 'Sabtu', time: '10:00 - 15:00' },
    { day: 'Minggu', time: 'Tutup' }
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

// Add display name for SocialMediaCard
SocialMediaCard.displayName = 'SocialMediaCard';

const ContactInfoCard = memo(({ icon, title, children }) => (
  <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 p-6 sm:p-8 hover:border-gray-700 transition-colors">
    <h3 className="text-lg sm:text-xl font-bold text-white mb-4">{title}</h3>
    <div className="flex items-start gap-4">
      <div className="bg-red-600/20 p-3 rounded-full flex-shrink-0">
        <i className={`${icon} text-red-500`}></i>
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  </div>
));

// Add display name for ContactInfoCard
ContactInfoCard.displayName = 'ContactInfoCard';

export default function Contact() {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    success: false,
    error: false,
    message: ''
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const resetFormStatus = useCallback(() => {
    setFormStatus({
      isSubmitting: false,
      success: false,
      error: false,
      message: ''
    });
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    setFormStatus({ isSubmitting: true, success: false, error: false, message: '' });
    
    try {
      // Simulate API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // On success
      setFormStatus({
        isSubmitting: false,
        success: true,
        error: false,
        message: 'Pesan berhasil dikirim! Kami akan segera menghubungi Anda.'
      });
      
      setFormData(INITIAL_FORM_DATA);
      
      // Auto-hide success message
      setTimeout(resetFormStatus, 5000);
      
    } catch (error) {
      setFormStatus({
        isSubmitting: false,
        success: false,
        error: true,
        message: 'Terjadi kesalahan. Silakan coba lagi nanti.'
      });
    }
  }, [resetFormStatus]); // Removed 'formData' from dependencies as it's not used

  return (
    <>
      <Head>
        <title>Contact Us - Astacala</title>
        <meta name="description" content="Contact Astacala through our social media channels or send us a message directly." />
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
              Terhubung dengan Astacala melalui berbagai platform media sosial kami atau kirim pesan langsung.
            </p>
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
        
        {/* Contact Form and Info Section */}
        <section className="py-12 sm:py-16 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              
              {/* Contact Form */}
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Kirim Pesan</h2>
                
                {/* Form Status Messages */}
                {(formStatus.success || formStatus.error) && (
                  <div className={`rounded-lg p-4 mb-6 ${
                    formStatus.success 
                      ? 'bg-green-900/30 border border-green-600 text-green-400' 
                      : 'bg-red-900/30 border border-red-600 text-red-400'
                  }`}>
                    {formStatus.message}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-gray-400 mb-2 text-sm">Nama</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      required
                      disabled={formStatus.isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-gray-400 mb-2 text-sm">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      required
                      disabled={formStatus.isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-gray-400 mb-2 text-sm">Subjek</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      required
                      disabled={formStatus.isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-gray-400 mb-2 text-sm">Pesan</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                      required
                      disabled={formStatus.isSubmitting}
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={formStatus.isSubmitting}
                    className={`w-full bg-red-600 text-white rounded-lg px-6 py-3 font-semibold flex items-center justify-center transition-all ${
                      formStatus.isSubmitting 
                        ? 'opacity-70 cursor-not-allowed' 
                        : 'hover:bg-red-700 transform hover:scale-[1.02]'
                    }`}
                  >
                    {formStatus.isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Mengirim...
                      </>
                    ) : "Kirim Pesan"}
                  </button>
                </form>
              </div>
              
              {/* Contact Info */}
              <div className="flex flex-col gap-6 sm:gap-8">
                {/* Address */}
                <ContactInfoCard icon="fas fa-map-marker-alt" title="Lokasi Kami">
                  <div className="space-y-1">
                    <p className="text-gray-300">{CONTACT_INFO.address.building}</p>
                    <p className="text-gray-400">{CONTACT_INFO.address.university}</p>
                    <p className="text-gray-400">{CONTACT_INFO.address.street}</p>
                    <p className="text-gray-400">{CONTACT_INFO.address.area}</p>
                    <p className="text-gray-400">{CONTACT_INFO.address.province}</p>
                  </div>
                </ContactInfoCard>
                
                {/* Email & Phone */}
                <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 p-6 sm:p-8 hover:border-gray-700 transition-colors">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Hubungi Langsung</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-red-600/20 p-3 rounded-full flex-shrink-0">
                        <i className="fas fa-envelope text-red-500"></i>
                      </div>
                      <div>
                        <p className="text-gray-300 mb-1">Email</p>
                        <a href={`mailto:${CONTACT_INFO.email}`} className="text-red-500 hover:underline break-all">
                          {CONTACT_INFO.email}
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="bg-red-600/20 p-3 rounded-full flex-shrink-0">
                        <i className="fas fa-phone-alt text-red-500"></i>
                      </div>
                      <div>
                        <p className="text-gray-300 mb-1">Telepon</p>
                        <a href={`tel:${CONTACT_INFO.phone}`} className="text-red-500 hover:underline">
                          {CONTACT_INFO.phone.replace('+62', '+62 ')}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Operation Hours */}
                <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 p-6 sm:p-8 hover:border-gray-700 transition-colors">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Jam Operasional</h3>
                  
                  <div className="space-y-2">
                    {CONTACT_INFO.hours.map((schedule, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-gray-400">{schedule.day}</span>
                        <span className="text-gray-300">{schedule.time}</span>
                      </div>
                    ))}
                    <p className="text-gray-500 text-sm mt-4">*Hubungi kami terlebih dahulu untuk janji temu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Map Section */}
        <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8">Temukan Kami</h2>
          
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