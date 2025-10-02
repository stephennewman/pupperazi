'use client';

import { useState } from 'react';
import Head from 'next/head';
import AppointmentPopup from '../../components/AppointmentPopup';

export default function Grooming() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Structured Data for Google
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "PetGrooming",
    "name": "Pupperazi Pet Spa - Grooming Services",
    "description": "Professional dog grooming and cat services in Palm Harbor, FL",
    "url": "https://pupperazi-pet-spa.vercel.app/grooming",
    "telephone": "727-753-9302",
    "email": "PupperaziPetSpa@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "3454 Tampa Rd",
      "addressLocality": "Palm Harbor",
      "addressRegion": "FL",
      "postalCode": "34684",
      "addressCountry": "US"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Grooming Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Bath Service",
            "description": "Includes ear cleaning, nail trim, pad trim, sanitary trim, brushout and blow dry and anal gland expression"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Mini Groom",
            "description": "Includes bath plus face, feet, & tail trim. Body not trimmed"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Full Groom",
            "description": "Includes bath plus full body trim of choice"
          }
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
                <a href="/#boarding" className="text-gray-700 transition-colors cursor-pointer" style={{color: '#2D5A87'}} onMouseEnter={(e) => e.currentTarget.style.color = '#3D6B9F'} onMouseLeave={(e) => e.currentTarget.style.color = '#2D5A87'}>Boarding</a>
                <a href="/about-us" className="text-gray-700 transition-colors cursor-pointer" style={{color: '#2D5A87'}} onMouseEnter={(e) => e.currentTarget.style.color = '#3D6B9F'} onMouseLeave={(e) => e.currentTarget.style.color = '#2D5A87'}>About</a>
                <a href="/map-hours" className="text-gray-700 transition-colors cursor-pointer" style={{color: '#2D5A87'}} onMouseEnter={(e) => e.currentTarget.style.color = '#3D6B9F'} onMouseLeave={(e) => e.currentTarget.style.color = '#2D5A87'}>Map & Hours</a>
                <a
                  href="tel:727-753-9302"
                  className="px-4 py-2 rounded-full font-semibold transition-colors cursor-pointer"
                  style={{backgroundColor: '#2D5A87', color: 'white'}}
                >
                  727-753-9302
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
                  <a href="/#boarding" className="px-2 py-1 cursor-pointer transition-colors" style={{color: '#2D5A87'}} onMouseEnter={(e) => e.currentTarget.style.color = '#3D6B9F'} onMouseLeave={(e) => e.currentTarget.style.color = '#2D5A87'}>Boarding</a>
                  <a href="/about-us" className="px-2 py-1 cursor-pointer transition-colors" style={{color: '#2D5A87'}} onMouseEnter={(e) => e.currentTarget.style.color = '#3D6B9F'} onMouseLeave={(e) => e.currentTarget.style.color = '#2D5A87'}>About</a>
                  <a href="/map-hours" className="px-2 py-1 cursor-pointer transition-colors" style={{color: '#2D5A87'}} onMouseEnter={(e) => e.currentTarget.style.color = '#3D6B9F'} onMouseLeave={(e) => e.currentTarget.style.color = '#2D5A87'}>Map & Hours</a>
                  <a
                    href="tel:727-753-9302"
                    className="px-4 py-2 rounded-full font-semibold transition-colors cursor-pointer mx-2 mt-2"
                    style={{backgroundColor: '#2D5A87', color: 'white'}}
                  >
                    727-753-9302
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
              GROOMING
            </h1>
            <p className="text-xl text-gray-700 mb-8 font-light">
              Professional pet grooming services
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Description */}
              <div className="text-center mb-12">
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  We offer full service dog grooming & cat bath/nails, a la carte services and our very popular Wash N Go bath service. We offer something for everyone no matter how little or how much you need. We are experienced with the very young as well as the very old and ones with special health issues or anxieties. We schedule our appointments throughout the day and get in touch as soon as they are ready, so they need not stay any longer than necessary. For pets who are staying longer, there are water bowls provided and potty breaks every few hours.
                </p>
              </div>

              {/* Grooming Menu */}
              <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-8 rounded-2xl shadow-lg mb-12">
                <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
                  ✂️ Grooming Menu
                </h2>
                
                <p className="text-lg text-gray-700 mb-8 text-center">
                  We offer 3 main services:
                </p>

                <div className="space-y-8">
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-2xl font-bold text-purple-900 mb-4">🛁 Bath</h3>
                    <p className="text-gray-700">
                      Includes ear cleaning, nail trim, pad trim, sanitary trim, brushout and blow dry and anal gland expression.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-2xl font-bold text-purple-900 mb-4">✂️ Mini Groom</h3>
                    <p className="text-gray-700">
                      Includes above bath plus face, feet, & tail trim. Body not trimmed.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-2xl font-bold text-purple-900 mb-4">✨ Full Groom</h3>
                    <p className="text-gray-700">
                      Includes the above bath plus full body trim of choice.
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Services */}
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-8 rounded-2xl shadow-lg mb-12">
                <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
                  🐾 Specialized Care
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold text-purple-900 mb-3">🐕 Dog Grooming</h3>
                    <p className="text-gray-700">
                      Full service grooming for dogs of all sizes, breeds, and ages. From puppies to seniors.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold text-purple-900 mb-3">🐱 Cat Services</h3>
                    <p className="text-gray-700">
                      Specialized cat baths and nail trims. We understand our feline friends' unique needs.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold text-purple-900 mb-3">👶 Young & Old</h3>
                    <p className="text-gray-700">
                      Experienced with very young pets and senior animals with special health considerations.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold text-purple-900 mb-3">😌 Anxious Pets</h3>
                    <p className="text-gray-700">
                      Gentle, patient care for pets with anxiety or special behavioral needs.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center">
                <p className="text-lg text-gray-700 mb-6">
                  Click on the button below to make an appointment!
                </p>
                <button 
                  onClick={() => window.open('/booking', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes')}
                  className="px-8 py-4 bg-purple-600 text-white rounded-full font-semibold text-lg hover:bg-purple-700 transition-colors cursor-pointer"
                >
                  Book Now &gt;&gt;
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="text-white p-12 rounded-2xl" style={{backgroundColor: '#3D6B9F'}}>
              <h2 className="text-3xl font-bold mb-6">Ready to Book Your Pet's Grooming?</h2>
              <p className="text-xl mb-8 text-blue-100">
                Schedule your appointment today and give your pet the professional care they deserve!
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
                  Call 727-753-9302
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
                    href="https://instagram.com/pupperazipetspa" 
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
                  <li><a href="/appointments" className="hover:text-white transition-colors">Book Appointment</a></li>
                </ul>
              </div>

              {/* About & Info */}
              <div className="text-center md:text-left">
                <h4 className="text-lg font-semibold mb-4">About & Info</h4>
                <ul className="space-y-2 text-sm text-blue-100">
                  <li><a href="/about-us" className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="/map-hours" className="hover:text-white transition-colors">Map & Hours</a></li>
                  <li><a href="/hotel-reservation-request" className="hover:text-white transition-colors">Hotel Reservations</a></li>
                  <li><a href="/booking" className="hover:text-white transition-colors">Online Booking</a></li>
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
                  © 2026 Pupperazi Pet Spa LLC. All rights reserved. We roll out the paw-parazzi experience! 🎬
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
