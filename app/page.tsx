'use client';

import { useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import AppointmentPopup from '../components/AppointmentPopup';

// Google Analytics event tracking
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const trackEvent = (eventName: string, params?: Record<string, string>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Track appointment button clicks
  const handleAppointmentClick = () => {
    trackEvent('appointment_click', { location: 'cta_button' });
    setIsPopupOpen(true);
  };

  // Track phone link clicks
  const handlePhoneClick = () => {
    trackEvent('phone_click', { location: 'header' });
  };

  const galleryImages = [
    'pet1.png',
    'pet2.png',
    'pet3.png',
    'pet4.png',
    'pet5.png',
    'pet9.png',
    'pet7.png',
    'pet8.png',
  ];

  // Structured Data for Google
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "PetGrooming",
    "name": "Pupperazi Pet Spa",
    "image": "https://pupperazipetspa.com/gallery/pet1.png",
    "@id": "https://pupperazipetspa.com",
    "url": "https://pupperazipetspa.com",
    "telephone": "727-753-9302",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "3454 Tampa Rd",
      "addressLocality": "Palm Harbor",
      "addressRegion": "FL",
      "postalCode": "34684",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 28.0836,
      "longitude": -82.7673
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "17:30"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "08:00",
        "closes": "17:00"
      }
    ],
    "servedCuisine": [],
    "priceRange": "$15-$60",
    "description": "Pupperazi Pet Spa offers boutique-style dog grooming in Palm Harbor, FL. Pamper your pup with premium baths, haircuts, nail trims, and more. Where luxury meets comfort for your beloved companion.",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Pet Grooming Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Bath Time Bliss",
            "description": "Full service bath with premium shampoo and conditioning"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": "Mini Makeover",
            "description": "Quick grooming touch-up for your pet"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service", 
            "name": "Full Glam Groom",
            "description": "Complete grooming package with styling and nail trim"
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
                <a href="#services" className="text-gray-700 transition-colors cursor-pointer" style={{color: '#2D5A87'}} onMouseEnter={(e) => e.currentTarget.style.color = '#3D6B9F'} onMouseLeave={(e) => e.currentTarget.style.color = '#2D5A87'}>Services</a>
                <a href="#gallery" className="text-gray-700 transition-colors cursor-pointer" style={{color: '#2D5A87'}} onMouseEnter={(e) => e.currentTarget.style.color = '#3D6B9F'} onMouseLeave={(e) => e.currentTarget.style.color = '#2D5A87'}>Gallery</a>
                <a href="#about" className="text-gray-700 transition-colors cursor-pointer" style={{color: '#2D5A87'}} onMouseEnter={(e) => e.currentTarget.style.color = '#3D6B9F'} onMouseLeave={(e) => e.currentTarget.style.color = '#2D5A87'}>About</a>
                <a href="#contact" className="text-gray-700 transition-colors cursor-pointer" style={{color: '#2D5A87'}} onMouseEnter={(e) => e.currentTarget.style.color = '#3D6B9F'} onMouseLeave={(e) => e.currentTarget.style.color = '#2D5A87'}>Contact</a>
                <a
                  href="tel:727-753-9302"
                  onClick={handlePhoneClick}
                  className="px-4 py-2 rounded-full font-semibold transition-colors cursor-pointer"
                  style={{backgroundColor: '#2D5A87', color: 'white'}}
                >
                  <span className="text-xs">Call/Text</span> <span className="font-bold">727-753-9302</span>
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
                  <a href="#services" className="px-2 py-1 cursor-pointer transition-colors" style={{color: '#2D5A87'}} onMouseEnter={(e) => e.currentTarget.style.color = '#3D6B9F'} onMouseLeave={(e) => e.currentTarget.style.color = '#2D5A87'}>Services</a>
                  <a href="#gallery" className="px-2 py-1 cursor-pointer transition-colors" style={{color: '#2D5A87'}} onMouseEnter={(e) => e.currentTarget.style.color = '#3D6B9F'} onMouseLeave={(e) => e.currentTarget.style.color = '#2D5A87'}>Gallery</a>
                  <a href="#about" className="px-2 py-1 cursor-pointer transition-colors" style={{color: '#2D5A87'}} onMouseEnter={(e) => e.currentTarget.style.color = '#3D6B9F'} onMouseLeave={(e) => e.currentTarget.style.color = '#2D5A87'}>About</a>
                  <a href="#contact" className="px-2 py-1 cursor-pointer transition-colors" style={{color: '#2D5A87'}} onMouseEnter={(e) => e.currentTarget.style.color = '#3D6B9F'} onMouseLeave={(e) => e.currentTarget.style.color = '#2D5A87'}>Contact</a>
                  <a
                    href="tel:727-753-9302"
                    onClick={handlePhoneClick}
                    className="px-4 py-2 rounded-full font-semibold transition-colors cursor-pointer mx-2 mt-2"
                    style={{backgroundColor: '#2D5A87', color: 'white'}}
                  >
                    <span className="text-xs">Call/Text</span> <span className="font-bold">727-753-9302</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </nav>

              {/* Hero Section */}
      <section className="pt-40 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-purple-900 mb-6 mt-8">
            Where Every Pet Gets the VIP Treatment
          </h1>
          <p className="text-2xl text-gray-700 mb-8 font-light">
            Dog Grooming in Palm Harbor, FL
          </p>
          <div className="text-xl text-purple-800 mb-12 space-y-2">
            <p className="font-semibold">Top-Quality Baths, Haircuts, Nail Trims & More</p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              At Pupperazi Pet Spa, we pamper your pup with professional grooming services in Palm Harbor, FL. Complete with bubbles, belly rubs, and boutique care.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleAppointmentClick}
              className="px-8 py-4 rounded-full text-lg font-semibold transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer text-gray-800"
              style={{backgroundColor: '#C8E5F0', color: '#2D5A87'}}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#B5D9E8'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#C8E5F0'}
            >
              Request Appointment
            </button>
          </div>
        </div>
      </section>

        {/* Team Section */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-purple-900 mb-6">
                👯‍♀️ Meet the Dream Team
              </h2>
              <p className="text-xl text-gray-700">
                Passionate. Paw-sitive. Pet-obsessed.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden shadow-lg">
                  <Image
                    src="/gallery/mel_edited.avif"
                    alt="Melissa Schiedenhelm - Co-Owner"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Melissa Schiedenhelm</h3>
                <p className="text-purple-600 font-semibold">Co-Owner</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden shadow-lg">
                  <Image
                    src="/gallery/ray_edited.avif"
                    alt="Rachael Patnode - Co-Owner and Grooming Manager"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Rachael Patnode</h3>
                <p className="text-purple-600 font-semibold">Co-Owner & Grooming Manager</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden shadow-lg">
                  <Image
                    src="/gallery/tracy.avif"
                    alt="Tracy Arts - Pet Stylist with 20+ Years Experience"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Tracy Arts</h3>
                <p className="text-purple-600 font-semibold">Pet Stylist Extraordinaire</p>
                <p className="text-sm text-gray-600 mt-2">(20+ years experience!)</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg text-gray-700">
                We've been part of Pupperazi since 2011 and 2012. What started as a job became a journey—and now, we proudly carry the torch of love, care, and wagging tails.
              </p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-purple-900 mb-6">
                ✨ Boutique Grooming Experience
              </h2>
              <p className="text-xl text-gray-700 mb-4 font-semibold">
                Where Wellness Meets Wagging Tails
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg text-gray-700 mb-6">
                  At Pupperazi Pet Spa, your pet isn't just another appointment—they're our VIP (Very Important Pet). We're all about holistic health and tail-wagging happiness, blending expert grooming with natural wellness to keep your pet looking and feeling fabulous.
                </p>
                <p className="text-lg text-purple-800 font-semibold">
                  From shampoo to chew toys, we've got every paw covered.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-purple-900 mb-4">🧠 The Philosophy Behind the Fur</h3>
                <p className="text-gray-700 mb-4">We believe wellness should wag from the inside out. That's why we focus on:</p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Holistic grooming</li>
                  <li>• Natural care & nutrition</li>
                  <li>• Reducing anxiety & stress</li>
                  <li>• Empowering pet parents with real, practical advice</li>
                </ul>
                <p className="text-purple-800 font-semibold mt-4">
                  Your pet's health is our mission. Their happiness? Our passion.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-purple-900 mb-6">
                📸 Our Paw-some Work
              </h2>
              <p className="text-xl text-gray-700 mb-4">
                See the magic happen! Check out our furry clients living their best groomed life.
              </p>
              <p className="text-lg text-purple-800 font-semibold">
                Every photo tells a tail of transformation! 🐾✨
              </p>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {galleryImages.map((image, index) => (
                <div 
                  key={index}
                  className="group cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="relative overflow-hidden rounded-3xl bg-white p-3 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:rotate-1">
                    {/* Photo frame with gradient border */}
                    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200 p-1">
                      <div className="relative aspect-square overflow-hidden rounded-xl bg-white">
                        <Image
                          src={`/gallery/${image}`}
                          alt={`Pet grooming showcase ${index + 1}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                        
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-purple-600/0 group-hover:bg-purple-600/20 transition-colors duration-300 flex items-center justify-center">
                          <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-2xl">👀</span>
                            <p className="text-sm font-semibold mt-1">View</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                  </div>
                </div>
              ))}
            </div>

            {/* Fun call to action */}
            <div className="text-center mt-12">
              <div className="bg-white p-6 rounded-2xl shadow-lg inline-block">
                <p className="text-lg text-gray-700 mb-4">
                  Ready to give your pup the boutique treatment? ✨
                </p>
                <button 
                  onClick={handleAppointmentClick}
                  className="px-6 py-3 rounded-full font-semibold transition-colors cursor-pointer"
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

        {/* Modal for enlarged image */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-full">
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white bg-purple-600 hover:bg-purple-700 rounded-full w-10 h-10 flex items-center justify-center z-10 cursor-pointer"
              >
                ✕
              </button>
              <Image
                src={`/gallery/${selectedImage}`}
                alt="Pet grooming showcase enlarged"
                width={800}
                height={600}
                className="max-w-full max-h-full object-contain rounded-2xl"
              />
            </div>
          </div>
        )}

        {/* Services Section */}
        <section id="services" className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-purple-900 mb-6">
                ✂️ Grooming That Deserves a Standing Ovation
              </h2>
              <p className="text-xl text-gray-700">
                Whether it's a quick wash or a glam makeover, our services are designed for comfort, care, and style.
              </p>
            </div>

            {/* Signature Services */}
            <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
              <h3 className="text-2xl font-bold text-purple-900 mb-6">🧼 Signature Services</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-bold text-purple-800">Bath Time Bliss</h4>
                    <span className="text-2xl font-bold text-purple-600">$45-65</span>
                  </div>
                  <p className="text-gray-700 mb-3">
                    Full service bath with premium shampoo and conditioning
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Includes:</strong> ear cleaning, nail trim, pad & sanitary trim, brushout, blow dry, and anal gland expression
                  </p>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-bold text-purple-800">Mini Makeover</h4>
                    <span className="text-2xl font-bold text-purple-600">$50-95</span>
                  </div>
                  <p className="text-gray-700 mb-3">
                    Everything in the bath, plus a face, feet & tail tidy-up
                  </p>
                  <p className="text-sm text-gray-600">
                    Think of it as a "paw-dicure" and "fur-facial"
                  </p>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-bold text-purple-800">Full Glam Groom</h4>
                    <span className="text-2xl font-bold text-purple-600">$65-125</span>
                  </div>
                  <p className="text-gray-700 mb-3">
                    All of the above, with a full-body haircut of your choosing
                  </p>
                  <p className="text-sm text-gray-600">
                    The perfect boutique look for your pup's special moments
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Wash */}
            <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
              <h3 className="text-2xl font-bold text-purple-900 mb-6">🚿 Wash 'N Go Baths</h3>
              <p className="text-lg text-gray-700 mb-6">
                For when your pup needs a quick spritz, not the full spa treatment.
              </p>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="font-semibold text-purple-900">Under 25 lbs</p>
                  <p className="text-2xl font-bold text-purple-600">$15</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="font-semibold text-purple-900">26–50 lbs</p>
                  <p className="text-2xl font-bold text-purple-600">$17</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="font-semibold text-purple-900">51–100 lbs</p>
                  <p className="text-2xl font-bold text-purple-600">$20</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="font-semibold text-purple-900">Over 100 lbs</p>
                  <p className="text-2xl font-bold text-purple-600">Call</p>
                </div>
              </div>
              
              <p className="text-gray-600 text-center">
                Includes: sudsy bath, ear cleaning, and towel dry. They'll leave slightly damp but totally adorable.
              </p>
            </div>

            {/* Add-ons */}
            <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
              <h3 className="text-2xl font-bold text-purple-900 mb-6">🧼 Add-On Spa Specials</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="font-semibold text-purple-900">Nail Trim</span>
                  <span className="text-purple-600 font-bold">$10</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="font-semibold text-purple-900">Nail Trim + Dremel</span>
                  <span className="text-purple-600 font-bold">$18</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="font-semibold text-purple-900">Anal Glands</span>
                  <span className="text-purple-600 font-bold">$5</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="font-semibold text-purple-900">Teeth Brushing</span>
                  <span className="text-purple-600 font-bold">$5</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="font-semibold text-purple-900">3B (Bath, Blow Dry, Brush Out & Ear Cleaning)</span>
                  <span className="text-purple-600 font-bold">$20-$60</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="font-semibold text-purple-900">Special or Medicated Shampoos</span>
                  <span className="text-purple-600 font-bold">$5-$10</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="font-semibold text-purple-900">Walk-in Services/Trims</span>
                  <span className="text-purple-600 font-bold">$5-$15</span>
                </div>
              </div>
              <p className="text-center text-gray-600 mt-4 italic">
                All the extras for when you want your pet to feel extra.
              </p>
            </div>

            {/* Combined Pricing & Timing Info */}
            <div className="max-w-4xl mx-auto mt-8 space-y-2 text-center">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-purple-900">⏱️ Typical Wait:</span> 2-3 hours (small dogs) • 2-4 hours (large dogs). Morning appointments are fastest, and we'll text when ready!
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-purple-900">💰 Pricing Note:</span> Final price may vary based on breed, size, temperament, or add-ons—we'll communicate any changes upfront.
              </p>
            </div>
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-purple-900 mb-6">
                ⭐ What Our Customers Say
              </h2>
              <p className="text-xl text-gray-700">
                Real reviews from real pet parents who trust us with their furry family members
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Joy */}
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                    <Image
                      src="/gallery/joy.png"
                      alt="Joy's pet"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-purple-900">Joy</h3>
                    <div className="text-yellow-400 text-sm">★★★★★</div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-4 flex-grow">
                  Look how cute my baby looks! 🐶🥰 Very impressed with our first experience there. My Yorkie is not a big fan of groomers and he's not easy but Rachel and the other girls are so nice and good at what they do. The fees are very reasonable too. We're definitely going back and highly recommend Pupperazi 🤗
                </p>
                <a
                  href="https://maps.app.goo.gl/RdibjmykXeU7YCbU8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 font-semibold text-sm hover:text-purple-700 transition-colors"
                >
                  View on Google →
                </a>
              </div>

              {/* S. T. (no image) */}
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-purple-200 mr-4 flex-shrink-0 flex items-center justify-center">
                    <span className="text-2xl">🐶</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-purple-900">S. T.</h3>
                    <div className="text-yellow-400 text-sm">★★★★★</div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-4 flex-grow">
                  I love this place! After going to several other groomers and being very disappointed someone at the dog park recommended Pupperazi. The difference in my dogs appearance and the groomers skill set is amazing. They are 30 minutes from me and I will continue to make the drive. 🥰
                </p>
                <a
                  href="https://maps.app.goo.gl/LhT6AYDfkPpBFqQC6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 font-semibold text-sm hover:text-purple-700 transition-colors"
                >
                  View on Google →
                </a>
              </div>

              {/* Tom */}
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                    <Image
                      src="/gallery/tom.png"
                      alt="Tom's pet"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-purple-900">Tom</h3>
                    <div className="text-yellow-400 text-sm">★★★★★</div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-4 flex-grow">
                  We love this place. They walked us together so we would feel secure. We are Bostons so we don't have much of a tail, be we still give them five wiggles.
                </p>
                <a
                  href="https://maps.app.goo.gl/5MEcESxeRPhi2zuE6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 font-semibold text-sm hover:text-purple-700 transition-colors"
                >
                  View on Google →
                </a>
              </div>

              {/* Patricia (no image) */}
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-purple-200 mr-4 flex-shrink-0 flex items-center justify-center">
                    <span className="text-2xl">✨</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-purple-900">Patricia</h3>
                    <div className="text-yellow-400 text-sm">★★★★★</div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-4 flex-grow">
                  I am very happy with Pupperazi Pet Spa! The workers are friendly and professional, and the communication is excellent. My pet always looks fantastic after each visit. The facility is clean and well-maintained. I would highly recommend them!
                </p>
                <a
                  href="https://maps.app.goo.gl/rgevZU6TYkRbQo3n9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 font-semibold text-sm hover:text-purple-700 transition-colors"
                >
                  View on Google →
                </a>
              </div>

              {/* Lara */}
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                    <Image
                      src="/gallery/lara.png"
                      alt="Lara's pet"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-purple-900">Lara</h3>
                    <div className="text-yellow-400 text-sm">★★★★★</div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-4 flex-grow">
                  Mila was very knowledgeable and did a phenomenal job on our pup. She is so caring and took great care of Coconut, he looks awesome and seems very happy! We will definitely book another appointment soon.
                </p>
                <a
                  href="https://maps.app.goo.gl/SQUT4RpuPN3FFFFFA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 font-semibold text-sm hover:text-purple-700 transition-colors"
                >
                  View on Google →
                </a>
              </div>

              {/* Brianna (no image) */}
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-purple-200 mr-4 flex-shrink-0 flex items-center justify-center">
                    <span className="text-2xl">💙</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-purple-900">Brianna</h3>
                    <div className="text-yellow-400 text-sm">★★★★★</div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-4 flex-grow">
                  I cannot say enough amazing things about the team at Pupperazi! I've been bringing my pup here since 2018 and always have a positive experience. I now live over an hour away and still bring my dog here because I trust them so much. Their pricing is so reasonable and their staff is always so kind and wonderful.
                </p>
                <a
                  href="https://maps.app.goo.gl/D9HRc6Vu4ybpaEH99"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 font-semibold text-sm hover:text-purple-700 transition-colors"
                >
                  View on Google →
                </a>
              </div>

              {/* Kelly */}
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                    <Image
                      src="/gallery/kelly.png"
                      alt="Kelly's pet"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-purple-900">Kelly</h3>
                    <div className="text-yellow-400 text-sm">★★★★★</div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-4 flex-grow">
                  We called for a same day appointment and they happily worked us in. The team was super friendly and loving with the dogs. They followed our instructions perfectly and gave her a little banana to wear. Highly recommend this place.
                </p>
                <a
                  href="https://maps.app.goo.gl/Tv5QuWswLJM6H6ZF6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 font-semibold text-sm hover:text-purple-700 transition-colors"
                >
                  View on Google →
                </a>
              </div>

              {/* Louanna */}
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                    <Image
                      src="/gallery/louanna.png"
                      alt="Louanna's pet"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-purple-900">Louanna</h3>
                    <div className="text-yellow-400 text-sm">★★★★★</div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-4 flex-grow">
                  We've been taking our dog to Pupperazi every 8 weeks for 9 years. Friendly staff. Clean facility. Excellent grooming. Fair prices. Community advocates. Easy appointment scheduling via text or online.
                </p>
                <a
                  href="https://maps.app.goo.gl/7fT7Zsp1kCFPG7ot7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 font-semibold text-sm hover:text-purple-700 transition-colors"
                >
                  View on Google →
                </a>
              </div>

              {/* Marcy */}
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                    <Image
                      src="/gallery/marcy.png"
                      alt="Marcy's pet"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-purple-900">Marcy</h3>
                    <div className="text-yellow-400 text-sm">★★★★★</div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-4 flex-grow">
                  My puppy is very fussy, and she was very calm and happy after her visit. Melissa is superb with her and the best grooming experience I have ever seen. They listened and HEAR requests, concerns and she came home with the best haircut too.
                </p>
                <a
                  href="https://maps.app.goo.gl/i6WABFkS5qjSaAnL7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 font-semibold text-sm hover:text-purple-700 transition-colors"
                >
                  View on Google →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-purple-900 mb-6">
                🐾 Ready to Pamper Your Pup?
              </h2>
              <p className="text-xl text-gray-700">
                Let's book your pet's next spa day!
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div className="space-y-8">
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-purple-900 mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      <p className="flex items-center text-gray-700">
                        <span className="text-purple-600 mr-3">📍</span>
                        3454 Tampa Rd, Palm Harbor, FL 34684
                      </p>
                      <p className="flex items-center text-gray-700">
                        <span className="text-purple-600 mr-3">📞</span>
                        727-753-9302
                      </p>
                      <p className="flex items-center text-gray-700">
                        <span className="text-purple-600 mr-3">✉️</span>
                        PupperaziPetSpa@gmail.com
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-purple-900 mb-4">Spa Hours</h3>
                    <div className="space-y-2 text-gray-700">
                      <p><span className="font-semibold">Tuesday – Friday:</span> 8:00 AM – 5:30 PM</p>
                      <p><span className="font-semibold">Saturday:</span> 8:00 AM – 5:00 PM</p>
                      <p><span className="font-semibold">Sunday & Monday:</span> Closed (snuggle days 🐾)</p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="space-y-8">
                  <div className="text-white p-8 rounded-2xl text-center" style={{backgroundColor: '#3D6B9F'}}>
                    <h3 className="text-2xl font-bold mb-4">🐾 Ready to Book?</h3>
                    <p className="text-lg mb-6">
                      Spots fill up fast—especially around the howl-idays!
                    </p>
                    <button 
                      onClick={handleAppointmentClick}
                      className="px-8 py-4 rounded-full font-semibold text-lg transition-colors shadow-lg cursor-pointer"
                      style={{backgroundColor: '#C8E5F0', color: '#2D5A87'}}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#B5D9E8'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#C8E5F0'}
                    >
                      Request Appointment
                    </button>
                    <p className="text-sm mt-4 opacity-90">
                      Fill out the form or give us a call.
                    </p>
                  </div>
                </div>
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
                  <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                  <li><a href="#gallery" className="hover:text-white transition-colors">Gallery</a></li>
                  <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
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
