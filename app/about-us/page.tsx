'use client';

import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import AppointmentPopup from '../../components/AppointmentPopup';

export default function AboutUs() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Structured Data for Google
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Pupperazi Pet Spa",
    "description": "Learn about Pupperazi Pet Spa's story, our experienced team, and our commitment to providing the best pet grooming services in Palm Harbor, FL.",
    "url": "https://pupperazipetspa.com/about-us",
    "mainEntity": {
      "@type": "PetGrooming",
      "name": "Pupperazi Pet Spa",
      "founder": [
        {
          "@type": "Person",
          "name": "Melissa Schiedenhelm"
        },
        {
          "@type": "Person", 
          "name": "Rachael Patnode"
        }
      ]
    }
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Navigation */}
        <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <a href="/" className="flex items-center space-x-2 cursor-pointer">
                <span className="text-2xl">🐾</span>
                <h1 className="text-2xl font-bold text-purple-900">Pupperazi Pet Spa</h1>
              </a>
              
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-8">
                <a href="/#services" className="text-gray-700 transition-colors cursor-pointer" style={{color: '#2D5A87'}} onMouseEnter={(e) => e.currentTarget.style.color = '#3D6B9F'} onMouseLeave={(e) => e.currentTarget.style.color = '#2D5A87'}>Services</a>
                <a href="/#gallery" className="text-gray-700 transition-colors cursor-pointer" style={{color: '#2D5A87'}} onMouseEnter={(e) => e.currentTarget.style.color = '#3D6B9F'} onMouseLeave={(e) => e.currentTarget.style.color = '#2D5A87'}>Gallery</a>
                <a href="/about-us" className="text-gray-700 transition-colors cursor-pointer font-semibold" style={{color: '#2D5A87'}} onMouseEnter={(e) => e.currentTarget.style.color = '#3D6B9F'} onMouseLeave={(e) => e.currentTarget.style.color = '#2D5A87'}>About</a>
                <a href="/#contact" className="text-gray-700 transition-colors cursor-pointer" style={{color: '#2D5A87'}} onMouseEnter={(e) => e.currentTarget.style.color = '#3D6B9F'} onMouseLeave={(e) => e.currentTarget.style.color = '#2D5A87'}>Contact</a>
                <a
                  href="tel:727-753-9302"
                  className="px-4 py-2 rounded-full font-semibold transition-colors cursor-pointer"
                  style={{backgroundColor: '#2D5A87', color: 'white'}}
                >
                  Call/Text 727-753-9302
                </a>
              </div>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 cursor-pointer"
              >
                <span className="sr-only">Open menu</span>
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span className={`block w-6 h-0.5 bg-gray-600 transition-all ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
                  <span className={`block w-6 h-0.5 bg-gray-600 transition-all ${isMenuOpen ? 'opacity-0' : 'my-1'}`}></span>
                  <span className={`block w-6 h-0.5 bg-gray-600 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
                </div>
              </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="md:hidden pb-4">
                <div className="flex flex-col space-y-2">
                  <a href="/#services" className="px-2 py-1 cursor-pointer transition-colors" style={{color: '#2D5A87'}} onMouseEnter={(e) => e.currentTarget.style.color = '#3D6B9F'} onMouseLeave={(e) => e.currentTarget.style.color = '#2D5A87'}>Services</a>
                  <a href="/#gallery" className="px-2 py-1 cursor-pointer transition-colors" style={{color: '#2D5A87'}} onMouseEnter={(e) => e.currentTarget.style.color = '#3D6B9F'} onMouseLeave={(e) => e.currentTarget.style.color = '#2D5A87'}>Gallery</a>
                  <a href="/about-us" className="px-2 py-1 cursor-pointer transition-colors font-semibold" style={{color: '#2D5A87'}} onMouseEnter={(e) => e.currentTarget.style.color = '#3D6B9F'} onMouseLeave={(e) => e.currentTarget.style.color = '#2D5A87'}>About</a>
                  <a href="/#contact" className="px-2 py-1 cursor-pointer transition-colors" style={{color: '#2D5A87'}} onMouseEnter={(e) => e.currentTarget.style.color = '#3D6B9F'} onMouseLeave={(e) => e.currentTarget.style.color = '#2D5A87'}>Contact</a>
                  <a
                    href="tel:727-753-9302"
                    className="px-4 py-2 rounded-full font-semibold transition-colors cursor-pointer mx-2 mt-2"
                    style={{backgroundColor: '#2D5A87', color: 'white'}}
                  >
                    Call/Text 727-753-9302
                  </a>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Refer a Friend Banner */}
        <section className="pt-32 pb-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-4 rounded-2xl shadow-lg">
              <p className="text-lg font-semibold">
                🎉 Refer a Friend for 10% off your next full service & their first full service!
              </p>
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <section className="pt-8 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-purple-900 mb-6 mt-8">
              We are your Neighborhood Pet Place
            </h1>
            <p className="text-2xl text-gray-700 mb-8 font-light">
              Come get to know us!
            </p>
          </div>
        </section>

        {/* About Our Pet Spa Section */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-purple-900 mb-6">
                About Our Pet Spa
              </h2>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg mx-auto text-gray-700 leading-relaxed">
                <p className="text-xl mb-8">
                  Hello! We are Melissa and Rachael, new owners of Pupperazi Pet Spa! Most of you may know us already as we have been a part of the team here since ~2012 and 2011, respectively. We've had the pleasure of watching and helping Christina, the previous spa owner, build the legacy you see before you and we aspire to continue the greatness and build stronger in our community. We've grown in business as well as relationships. If you've been around awhile, we thank you for your loyalty. If you're new here, we welcome you to our family and hope to be a part of yours for years to come.
                </p>

                <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-8 rounded-2xl mb-8">
                  <h3 className="text-2xl font-bold text-purple-900 mb-4">🐾 Our Grooming Philosophy</h3>
                  <p className="text-lg text-gray-700 mb-4">
                    Pet grooming has always been our mainstay. Our groomers are extremely experienced and focused on making the experience as comfortable and relaxing as possible. Our four-legged guests are not cooped up in tiny cages all day waiting for their turn. We schedule our appointments on the hour and call as soon as we are done. Turnaround is usually around 2-2.5 hours for little dogs and 3-3.5 hours for large dogs. They do their waiting in spacious pens with a mat or blankets and a water bowl. If their stay is longer than a couple hours, we take them out for potty breaks.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold text-purple-900 mb-4">💚 Health & Wellness Focus</h3>
                  <p className="text-lg text-gray-700">
                    We focus on health and wellness in our spa as well as many alternative/holistic suggestions for any physical issues they may experience. We also carry a very wide variety of collars, leashes, harnesses, and much more.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Meet the Team Section */}
        <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-purple-900 mb-6">
                Meet the Team
              </h2>
              <p className="text-xl text-gray-700">
                This is the crew that makes it all happen!
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow">
                <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden shadow-lg">
                  <Image
                    src="/gallery/mel_edited.avif"
                    alt="Melissa Schiedenhelm - Co-Owner"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold text-purple-900 mb-2">Melissa Schiedenhelm</h3>
                <p className="text-purple-600 font-semibold text-lg">Co-Owner</p>
                <p className="text-gray-600 mt-4">
                  Leading the way with passion and dedication since 2012
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow">
                <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden shadow-lg">
                  <Image
                    src="/gallery/ray_edited.avif"
                    alt="Rachael Patnode - Co-Owner and Grooming Manager"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold text-purple-900 mb-2">Rachael Patnode</h3>
                <p className="text-purple-600 font-semibold text-lg">Co-Owner / Grooming Manager</p>
                <p className="text-gray-600 mt-4">
                  Expert grooming and management since 2011
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow">
                <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden shadow-lg">
                  <Image
                    src="/gallery/tracy.avif"
                    alt="Tracy Arts - Pet Stylist with 20+ Years Experience"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold text-purple-900 mb-2">Tracy Arts</h3>
                <p className="text-purple-600 font-semibold text-lg">Pet Stylist</p>
                <p className="text-gray-600 mt-4">
                  20+ Years Experience!
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <div className="bg-white p-8 rounded-2xl shadow-lg inline-block">
                <p className="text-lg text-gray-700 mb-6">
                  Together, we've built a legacy of love, care, and wagging tails. 
                  From our early days as team members to now proudly carrying the torch as owners, 
                  we're committed to providing the best experience for your beloved pets.
                </p>
                <button 
                  onClick={() => setIsPopupOpen(true)}
                  className="px-8 py-4 rounded-full font-semibold text-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer"
                  style={{backgroundColor: '#C8E5F0', color: '#2D5A87'}}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#B5D9E8'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#C8E5F0'}
                >
                  Request Appointment
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="text-white p-12 rounded-2xl" style={{backgroundColor: '#3D6B9F'}}>
              <h2 className="text-3xl font-bold mb-6">Ready to Experience the Pupperazi Difference?</h2>
              <p className="text-xl mb-8 text-blue-100">
                Join our family of happy pets and pet parents in Palm Harbor, FL
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button 
                    onClick={() => setIsPopupOpen(true)}
                    className="px-8 py-4 rounded-full font-semibold text-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer"
                    style={{backgroundColor: '#C8E5F0', color: '#2D5A87'}}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#B5D9E8'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#C8E5F0'}
                  >
                    Request Appointment
                  </button>
                <a
                  href="tel:727-753-9302"
                  className="px-8 py-4 rounded-full font-semibold text-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer border-2 border-white text-white hover:bg-white hover:text-blue-600"
                >
                  Call/Text 727-753-9302
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12" style={{backgroundColor: '#3D6B9F', color: 'white'}}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Main Footer Content */}
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              {/* Brand Section */}
              <div className="md:col-span-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
                  <span className="text-3xl">🐾</span>
                  <h3 className="text-2xl font-bold">Pupperazi Pet Spa</h3>
                </div>
                <p className="text-blue-100 mb-4">
                  Where Every Pet Gets the VIP Treatment
                </p>
                <div className="text-sm text-blue-100">
                  <p>3454 Tampa Rd</p>
                  <p>Palm Harbor, FL 34684</p>
                  <p className="mt-2">727-753-9302</p>
                  <p>PupperaziPetSpa@gmail.com</p>
                </div>
                {/* Social Media Links */}
                <div className="flex justify-center md:justify-start space-x-4 mt-4">
                  <a 
                    href="https://facebook.com/pupperazipetspa" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    aria-label="Facebook"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://instagram.com/pupperazipetspa_ph" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    aria-label="Instagram"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.281h-1.563c-.312 0-.563-.251-.563-.563V5.583c0-.312.251-.563.563-.563h1.563c.312 0 .563.251.563.563v1.561c0 .312-.251.563-.563.563zm-5.6 9.281c-2.4 0-4.35-1.95-4.35-4.35s1.95-4.35 4.35-4.35 4.35 1.95 4.35 4.35-1.95 4.35-4.35 4.35z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Services */}
              <div className="text-center md:text-left">
                <h4 className="text-lg font-semibold mb-4">Services</h4>
                <ul className="space-y-2 text-sm text-blue-100">
                  <li><a href="/our-services" className="hover:text-white transition-colors">Our Services</a></li>
                  <li><a href="/grooming" className="hover:text-white transition-colors">Grooming</a></li>
                  <li><a href="/wash-n-go-baths" className="hover:text-white transition-colors">Wash N Go Baths</a></li>
                  <li><a href="/appointments" className="hover:text-white transition-colors">Request Appointment</a></li>
                </ul>
              </div>

              {/* About & Info */}
              <div className="text-center md:text-left">
                <h4 className="text-lg font-semibold mb-4">About & Info</h4>
                <ul className="space-y-2 text-sm text-blue-100">
                  <li><a href="/about-us" className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="/map-hours" className="hover:text-white transition-colors">Map & Hours</a></li>
                </ul>
              </div>

              {/* Quick Links */}
              <div className="text-center md:text-left">
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm text-blue-100">
                  <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                  <li><a href="/#services" className="hover:text-white transition-colors">Services</a></li>
                  <li><a href="/#gallery" className="hover:text-white transition-colors">Gallery</a></li>
                  <li><a href="/#contact" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="pt-8" style={{borderTop: '1px solid #5A8BC4'}}>
              <div className="text-center">
                <p className="text-blue-200">
                  © 2026 Pupperazi Pet Spa LLC. All rights reserved.
                </p>
                <br />
                <p className="text-blue-200">
                  Site built with ❤️ in <a href="https://www.stephennewman.me" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Palm Harbor</a>
                </p>
              </div>
            </div>
          </div>
        </footer>

        {/* Appointment Popup */}
        <AppointmentPopup 
          isOpen={isPopupOpen} 
          onClose={() => setIsPopupOpen(false)} 
        />
      </div>
    </>
  );
}
