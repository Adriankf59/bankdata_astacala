import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  // Social media data
  const socialMedia = [
    {
      name: 'Facebook',
      url: 'https://facebook.com/astacala',
      logo: '/logos/facebook-logo.png',
      color: '#1877F2',
      username: '@astacala'
    },
    {
      name: 'X (Twitter)',
      url: 'https://x.com/astacala',
      logo: '/x-logo.png',
      color: '#000000',
      username: '@astacala'
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/astacala',
      logo: '/instagram-logo.png',
      color: '#E1306C',
      username: '@astacala'
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com/c/PMPAAstacala',
      logo: '/youtube-logo.png',
      color: '#FF0000',
      username: 'Astacala Official'
    }
  ];

  return (
    <>
      <Head>
        <title>Contact Us - Astacala</title>
        <meta name="description" content="Contact Astacala through our social media channels or send us a message directly." />
      </Head>
      
      <Header />
      <main className="bg-black min-h-screen">
        {/* Hero Section with Background Image */}
        <section className="relative h-80">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url("/contact-hero.jpg")' }}
          />
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/90"></div>
          
          {/* Content */}
          <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Hubungi Kami</h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl">
              Terhubung dengan Astacala melalui berbagai platform media sosial kami atau kirim pesan langsung.
            </p>
          </div>
        </section>
        
        {/* Social Media Section */}
        <section className="py-16 max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Media Sosial Kami</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {socialMedia.map((platform) => (
              <a 
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 group"
              >
                <div className="p-8 flex flex-col items-center text-center">
                  {/* Logo with background */}
                  <div 
                    className="w-24 h-24 rounded-full flex items-center justify-center mb-4 group-hover:shadow-lg transition-all duration-300 p-4"
                    style={{ 
                      background: `linear-gradient(135deg, ${platform.color}33 0%, ${platform.color}22 100%)`,
                      borderLeft: `3px solid ${platform.color}`,
                      borderBottom: `3px solid ${platform.color}`
                    }}
                  >
                    <div className="relative w-16 h-16">
                      <Image 
                        src={platform.logo} 
                        alt={`${platform.name} Logo`} 
                        layout="fill" 
                        objectFit="contain"
                      />
                    </div>
                  </div>
                  
                  {/* Platform name */}
                  <h3 className="text-white text-xl font-bold mb-2">{platform.name}</h3>
                  
                  {/* Username */}
                  <p className="text-gray-400 mb-4">{platform.username}</p>
                  
                  {/* Follow button */}
                  <span className="bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-semibold group-hover:bg-red-600 transition-colors duration-300">
                    Follow Us
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>
        
        {/* Contact Form and Info Section */}
        <section className="py-16 bg-gray-950">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Contact Form */}
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Kirim Pesan</h2>
                
                {submitSuccess ? (
                  <div className="bg-green-900/30 border border-green-600 text-green-400 rounded-lg p-4 mb-6">
                    Pesan berhasil dikirim! Kami akan segera menghubungi Anda.
                  </div>
                ) : submitError ? (
                  <div className="bg-red-900/30 border border-red-600 text-red-400 rounded-lg p-4 mb-6">
                    Gagal mengirim pesan. Silakan coba lagi nanti.
                  </div>
                ) : null}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-400 mb-2">Nama</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-gray-400 mb-2">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-gray-400 mb-2">Subjek</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-gray-400 mb-2">Pesan</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-red-600 text-white rounded-lg px-6 py-3 font-semibold flex items-center justify-center ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-red-700'
                    }`}
                  >
                    {isSubmitting ? (
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
              <div className="flex flex-col gap-8">
                {/* Address */}
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-8">
                  <h3 className="text-xl font-bold text-white mb-4">Lokasi Kami</h3>
                  <div className="flex items-start gap-4">
                    <div className="bg-red-600/20 p-3 rounded-full">
                      <i className="fas fa-map-marker-alt text-red-500"></i>
                    </div>
                    <div>
                      <p className="text-gray-300">Gedung Astacala</p>
                      <p className="text-gray-400">Universitas Telkom</p>
                      <p className="text-gray-400">Jl. Telekomunikasi No. 1</p>
                      <p className="text-gray-400">Terusan Buah Batu, Bandung 40257</p>
                      <p className="text-gray-400">Jawa Barat, Indonesia</p>
                    </div>
                  </div>
                </div>
                
                {/* Email & Phone */}
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-8">
                  <h3 className="text-xl font-bold text-white mb-4">Hubungi Langsung</h3>
                  
                  <div className="flex items-start gap-4 mb-6">
                    <div className="bg-red-600/20 p-3 rounded-full">
                      <i className="fas fa-envelope text-red-500"></i>
                    </div>
                    <div>
                      <p className="text-gray-300">Email</p>
                      <a href="mailto:adriancuman@astacala.org" className="text-red-500 hover:underline">adriancuman@astacala.org</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-red-600/20 p-3 rounded-full">
                      <i className="fas fa-phone-alt text-red-500"></i>
                    </div>
                    <div>
                      <p className="text-gray-300">Telepon</p>
                      <a href="tel:+6282112345678" className="text-red-500 hover:underline">+62 821 1234 5678</a>
                    </div>
                  </div>
                </div>
                
                {/* Operation Hours */}
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-8">
                  <h3 className="text-xl font-bold text-white mb-4">Jam Operasional</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Senin - Jumat</span>
                      <span className="text-gray-300">09:00 - 17:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Sabtu</span>
                      <span className="text-gray-300">10:00 - 15:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Minggu</span>
                      <span className="text-gray-300">Tutup</span>
                    </div>
                    <p className="text-gray-500 text-sm mt-4">*Hubungi kami terlebih dahulu untuk janji temu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Map Section */}
        <section className="py-16 max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-8">Temukan Kami</h2>
          
          <div className="rounded-xl overflow-hidden border border-gray-800 h-96">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.3201239228736!2d107.62534481535224!3d-6.973006970190073!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e9adf177bf8d%3A0x437398556f9fa03!2sUniversitas%20Telkom!5e0!3m2!1sen!2sid!4v1652345678901!5m2!1sen!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Astacala Location Map"
            ></iframe>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}