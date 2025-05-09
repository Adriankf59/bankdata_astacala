import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Component for animated section
const AnimatedSection = ({ children, className }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function BragaTechnologies() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    {
      icon: 'fas fa-laptop-code',
      title: 'Web Development',
      description: 'Custom websites, web applications, e-commerce solutions, and enterprise-grade platforms built with the latest technologies.'
    },
    {
      icon: 'fas fa-mobile-alt',
      title: 'Mobile Development',
      description: 'Native and cross-platform mobile applications for iOS and Android that deliver exceptional user experiences.'
    },
    {
      icon: 'fas fa-server',
      title: 'Cloud Solutions',
      description: 'Scalable cloud infrastructure, migration services, and DevOps automation to optimize your operations.'
    },
    {
      icon: 'fas fa-robot',
      title: 'AI & Machine Learning',
      description: 'Intelligent solutions that leverage artificial intelligence and machine learning to transform your business.'
    },
    {
      icon: 'fas fa-project-diagram',
      title: 'Internet of Things',
      description: 'Connected device solutions that bridge the physical and digital worlds for smarter operations.'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Cybersecurity',
      description: 'Comprehensive security services to protect your digital assets and ensure regulatory compliance.'
    }
  ];

  const clients = [
    { name: 'Telkom Indonesia', logo: '/clients/telkom.png' },
    { name: 'BCA', logo: '/clients/bca.png' },
    { name: 'Tokopedia', logo: '/clients/tokopedia.png' },
    { name: 'Gojek', logo: '/clients/gojek.png' },
    { name: 'Pertamina', logo: '/clients/pertamina.png' },
    { name: 'Garuda Indonesia', logo: '/clients/garuda.png' }
  ];

  return (
    <>
      <Head>
        <title>Braga Technologies | Transforming Ideas into Digital Solutions</title>
        <meta name="description" content="Braga Technologies is a leading software development company specializing in custom web & mobile applications, cloud solutions, AI, IoT, and cybersecurity." />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css" />
      </Head>

      {/* Navigation */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-6 lg:px-8 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <span className={`text-2xl font-bold ${isScrolled ? 'text-blue-700' : 'text-white'}`}>
              Braga<span className="text-blue-500">Tech</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {['Home', 'Services', 'About', 'Portfolio', 'Careers', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className={`font-medium transition-colors hover:text-blue-500 ${isScrolled ? 'text-gray-700' : 'text-white'}`}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg 
              className={`w-6 h-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-lg rounded-b-lg mx-6"
          >
            <div className="py-4 space-y-2 px-4">
              {['Home', 'Services', 'About', 'Portfolio', 'Careers', 'Contact'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  className="block py-2 px-4 text-gray-800 font-medium rounded hover:bg-blue-50 hover:text-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="relative bg-gradient-to-r from-blue-800 to-indigo-900 min-h-screen flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-blue-900 opacity-30"></div>
          <div className="h-full w-full bg-[url('/bg-tech-pattern.jpg')] bg-cover bg-center"></div>
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 py-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium inline-block mb-6">
                Leading Technology Solutions
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
                Transforming Ideas into Digital <span className="text-blue-400">Reality</span>
              </h1>
              <p className="text-gray-200 text-lg md:text-xl mb-8 max-w-xl">
                We help businesses leverage technology to solve complex problems, drive growth, and create exceptional digital experiences.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="#contact" 
                  className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                >
                  Get Started
                </a>
                <a 
                  href="#services" 
                  className="px-8 py-3 bg-transparent border-2 border-white hover:bg-white hover:text-blue-800 text-white font-medium rounded-lg transition-colors"
                >
                  Our Services
                </a>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block"
            >
              <img 
                src="/hero-tech-illustration.svg"
                alt="Digital Transformation" 
                className="w-full max-w-lg mx-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <span className="text-blue-600 font-semibold">WHAT WE OFFER</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Our Technology Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-4">
              We offer comprehensive technology solutions tailored to your business needs, helping you navigate the digital landscape with confidence.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <AnimatedSection 
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-6">
                  <i className={`${service.icon} text-2xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <img 
                src="/about-team.jpg" 
                alt="Our Team at Braga Technologies" 
                className="rounded-lg shadow-xl w-full h-auto object-cover max-h-[500px]"
              />
            </AnimatedSection>

            <AnimatedSection>
              <span className="text-blue-600 font-semibold">ABOUT US</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
                Innovation is in Our DNA
              </h2>
              <p className="text-gray-600 mb-6">
                Founded in 2015 in Bandung, Indonesia, Braga Technologies has grown from a small startup into a leading technology solutions provider serving clients across Southeast Asia.
              </p>
              <p className="text-gray-600 mb-6">
                Our team of over 120 experts combines technical expertise with industry knowledge to deliver solutions that drive real business impact. We believe in collaborative partnerships and are committed to your success.
              </p>
              
              <div className="flex flex-wrap gap-8 mt-8">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-blue-600">120+</span>
                  <span className="text-gray-600">Team Members</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-blue-600">200+</span>
                  <span className="text-gray-600">Projects Completed</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-blue-600">15+</span>
                  <span className="text-gray-600">Countries Served</span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <span className="text-blue-600 font-semibold">TRUSTED BY</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">Our Partners & Clients</h2>
          </AnimatedSection>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {clients.map((client, index) => (
              <AnimatedSection 
                key={index}
                className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center hover:shadow-lg transition-shadow"
              >
                <img 
                  src={client.logo} 
                  alt={client.name} 
                  className="h-16 object-contain" 
                />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8">
            <AnimatedSection className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Digital Transformation?</h2>
              <p className="text-blue-100 text-lg">
                Let's discuss how Braga Technologies can help you leverage technology to achieve your business goals.
              </p>
            </AnimatedSection>
            
            <AnimatedSection>
              <a 
                href="#contact" 
                className="inline-block px-8 py-4 bg-white text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
              >
                Contact Us Today
              </a>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <span className="text-blue-600 font-semibold">GET IN TOUCH</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Contact Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-4">
              Have a project in mind or want to learn more about our services? We'd love to hear from you.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <AnimatedSection className="rounded-xl shadow-lg p-8 bg-white border border-gray-100">
              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Your Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Project Inquiry"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
                  <textarea 
                    id="message" 
                    rows="5" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Tell us about your project or inquiry..."
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Send Message
                </button>
              </form>
            </AnimatedSection>

            <AnimatedSection>
              <div className="grid grid-cols-1 gap-8 h-full">
                <div className="bg-blue-50 rounded-xl p-8 border border-blue-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Our Office</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="text-blue-600 mt-1 mr-4">
                        <i className="fas fa-map-marker-alt"></i>
                      </div>
                      <div>
                        <p className="text-gray-700">
                          Jl. Braga No. 123, Bandung<br />
                          Jawa Barat, Indonesia 40111
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="text-blue-600 mt-1 mr-4">
                        <i className="fas fa-phone-alt"></i>
                      </div>
                      <div>
                        <p className="text-gray-700">+62 22 123 4567</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="text-blue-600 mt-1 mr-4">
                        <i className="fas fa-envelope"></i>
                      </div>
                      <div>
                        <p className="text-gray-700">info@bragatech.com</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-xl p-8 text-white">
                  <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
                  <p className="mb-6">Follow our social media channels for the latest updates.</p>
                  
                  <div className="flex space-x-4">
                    <a href="#" className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center hover:bg-blue-600 transition-colors">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center hover:bg-blue-600 transition-colors">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center hover:bg-blue-600 transition-colors">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center hover:bg-blue-600 transition-colors">
                      <i className="fab fa-instagram"></i>
                    </a>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">
                Braga<span className="text-blue-500">Tech</span>
              </h3>
              <p className="text-gray-400 mb-6">
                Transforming businesses through innovative technology solutions since 2015.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Services</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Web Development</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Mobile Development</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cloud Solutions</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">AI & Machine Learning</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">IoT Solutions</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cybersecurity</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">GDPR Compliance</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-gray-500">
              &copy; {new Date().getFullYear()} Braga Technologies. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}