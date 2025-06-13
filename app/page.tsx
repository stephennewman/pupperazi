'use client';

import { useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
    "image": "https://pupperazi-pet-spa.vercel.app/gallery/pet1.png",
    "@id": "https://pupperazi-pet-spa.vercel.app",
    "url": "https://pupperazi-pet-spa.vercel.app",
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
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday", 
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "08:00",
      "closes": "17:00"
    },
    "servedCuisine": [],
    "priceRange": "$15-$60",
    "description": "Pupperazi Pet Spa offers top-quality dog grooming in Palm Harbor, FL. Pamper your pup with baths, haircuts, nail trims, boarding and more. Because every pet deserves the red carpet treatment!",
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
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Pet Boarding",
            "description": "The Pawsh Pet Hotel boarding services",
            "offers": {
              "@type": "Offer",
              "priceRange": "$35-$60 per night"
            }
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
        <nav className="fixed top-4 w-full bg-white/90 backdrop-blur-md z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🐾</span>
                <h1 className="text-2xl font-bold text-purple-900">Pupperazi Pet Spa</h1>
              </div>
              
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-8">
                <a href="#services" className="text-gray-700 hover:text-purple-600 transition-colors">Services</a>
                <a href="#gallery" className="text-gray-700 hover:text-purple-600 transition-colors">Gallery</a>
                <a href="#boarding" className="text-gray-700 hover:text-purple-600 transition-colors">Boarding</a>
                <a href="#about" className="text-gray-700 hover:text-purple-600 transition-colors">About</a>
                <a href="#contact" className="text-gray-700 hover:text-purple-600 transition-colors">Contact</a>
                <a 
                  href="tel:727-753-9302" 
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full font-semibold transition-colors flex items-center space-x-2"
                >
                  <span>📞</span>
                  <span>727-753-9302</span>
                </a>
              </div>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2"
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
                  <a href="#services" className="text-gray-700 hover:text-purple-600 px-2 py-1">Services</a>
                  <a href="#gallery" className="text-gray-700 hover:text-purple-600 px-2 py-1">Gallery</a>
                  <a href="#boarding" className="text-gray-700 hover:text-purple-600 px-2 py-1">Boarding</a>
                  <a href="#about" className="text-gray-700 hover:text-purple-600 px-2 py-1">About</a>
                  <a href="#contact" className="text-gray-700 hover:text-purple-600 px-2 py-1">Contact</a>
                  <a 
                    href="tel:727-753-9302" 
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full font-semibold transition-colors flex items-center space-x-2 mx-2 mt-2"
                  >
                    <span>📞</span>
                    <span>727-753-9302</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </nav>

              {/* Hero Section */}
      <section className="pt-40 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-purple-900 mb-6 mt-8">
            Dog Grooming in Palm Harbor, FL
          </h1>
          <p className="text-2xl text-gray-700 mb-8 font-light">
            Every Pet Deserves the Red Carpet Treatment
          </p>
          <div className="text-xl text-purple-800 mb-12 space-y-2">
            <p className="font-semibold">Top-Quality Baths, Haircuts, Nail Trims & More</p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              At Pupperazi Pet Spa, we pamper your pup with professional grooming services in Palm Harbor, FL. Complete with bubbles, belly rubs, and boutique boarding.
            </p>
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Schedule My Appointment
          </button>
        </div>
      </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-purple-900 mb-6">
                🎬 A Star Is Groomed
              </h2>
              <p className="text-xl text-gray-700 mb-4 font-semibold">
                Where Wellness Meets Wagging Tails
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg text-gray-700 mb-6">
                  At Pupperazi Pet Spa, your pet isn't just another appointment—they're our VIP (Very Important Pet). We're all about holistic health and tail-wagging happiness, blending expert grooming with natural wellness to keep your pet looking fetching and feeling fabulous.
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
        <section id="gallery" className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
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
                    {/* Fun decorative paw prints */}
                    <div className="absolute top-2 right-2 text-purple-300 opacity-50 group-hover:opacity-100 transition-opacity">
                      🐾
                    </div>
                    <div className="absolute bottom-2 left-2 text-blue-300 opacity-50 group-hover:opacity-100 transition-opacity">
                      🐾
                    </div>
                    
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
                    
                    {/* Fun caption */}
                    <div className="mt-3 text-center">
                      <p className="text-sm text-purple-700 font-medium">
                        Ready for the red carpet! ⭐
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Fun call to action */}
            <div className="text-center mt-12">
              <div className="bg-white p-6 rounded-2xl shadow-lg inline-block">
                <p className="text-lg text-gray-700 mb-4">
                  Want your pup to be our next star? 🌟
                </p>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-semibold transition-colors">
                  Book Your Pet's Photoshoot Session!
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Modal for enlarged image */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-full">
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white bg-purple-600 hover:bg-purple-700 rounded-full w-10 h-10 flex items-center justify-center z-10"
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
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-purple-900 mb-8 text-center">🧼 Signature Services</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <h4 className="text-xl font-bold text-purple-800 mb-4">Bath Time Bliss</h4>
                  <p className="text-gray-700">
                    Includes ear cleaning, nail trim, pad & sanitary trim, brushout, blow dry, and anal gland expression.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <h4 className="text-xl font-bold text-purple-800 mb-4">Mini Makeover</h4>
                  <p className="text-gray-700">
                    Everything in the bath, plus a face, feet & tail tidy-up. Think of it as a "paw-dicure" and "fur-facial."
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <h4 className="text-xl font-bold text-purple-800 mb-4">Full Glam Groom</h4>
                  <p className="text-gray-700">
                    All of the above, with a full-body haircut of your choosing. The red carpet look for your pup's next big paw-formance.
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
            <div className="bg-white p-8 rounded-2xl shadow-lg">
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
                  <span className="font-semibold text-purple-900">Brushout/Blow Dry</span>
                  <span className="text-purple-600 font-bold">$10/5min</span>
                </div>
              </div>
              <p className="text-center text-gray-600 mt-4 italic">
                All the extras for when you want your pet to feel extra.
              </p>
            </div>

            <div className="text-center mt-8">
              <p className="text-lg text-purple-800 font-semibold">
                🕒 Appointments are spaced to reduce stress and crate time. We call you when your pet is ready for pickup—usually within 2–3 hours.
              </p>
            </div>
          </div>
        </section>

        {/* Boarding Section */}
        <section id="boarding" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-purple-900 mb-6">
                🏨 The Pawsh Pet Hotel
              </h2>
              <p className="text-xl text-gray-700">
                Sleepovers That Feel Like Staycations
              </p>
              <p className="text-lg text-gray-600 mt-4">
                Going away? We'll treat your pup like royalty while you're out of town.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* What's Included */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-purple-900 mb-6">🛏️ Every overnight guest enjoys:</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    Comfy bedding in a private pen
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    Minimum of 4 potty breaks a day
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    15 minutes of solo walk or playtime
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    Filtered water, fresh blankets, and TLC from our staff
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    Medication administration if needed
                  </li>
                </ul>
                <p className="text-purple-800 font-semibold mt-6">
                  📸 Want a daily pup-date? Just say the word!
                </p>
              </div>

              {/* Pricing */}
              <div>
                <h3 className="text-2xl font-bold text-purple-900 mb-6">�� Overnight Rates</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                    <span className="font-semibold text-purple-900">1 Dog</span>
                    <span className="text-2xl font-bold text-purple-600">$35/night</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                    <span className="font-semibold text-purple-900">2 Dogs (same room)</span>
                    <span className="text-2xl font-bold text-purple-600">$50/night</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                    <span className="font-semibold text-purple-900">3 Dogs (same room)</span>
                    <span className="text-2xl font-bold text-purple-600">$60/night</span>
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-6">
                  <p className="text-yellow-800 font-semibold">
                    🎄 Book early for holidays! We fill up faster than a bowl of treats.
                  </p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                  <p className="text-red-800 text-sm">
                    ⚠️ We're a boutique facility—not a doggie Alcatraz. We can't accommodate escape artists, excessive barkers, or pups recently recovering from illness. We don't require vaccinations but expect healthy pets only.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
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
                <div className="w-20 h-20 bg-purple-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">👩‍💼</span>
                </div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Melissa Schiedenhelm</h3>
                <p className="text-purple-600 font-semibold">Co-Owner</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                <div className="w-20 h-20 bg-purple-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">✂️</span>
                </div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Rachael Patnode</h3>
                <p className="text-purple-600 font-semibold">Co-Owner & Grooming Manager</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                <div className="w-20 h-20 bg-purple-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">⭐</span>
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

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-purple-900 mb-6">
                📍 Get in Touch
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
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
                <div className="bg-purple-600 text-white p-8 rounded-2xl text-center">
                  <h3 className="text-2xl font-bold mb-4">🐾 Ready to Book?</h3>
                  <p className="text-lg mb-6">
                    Spots fill up fast—especially around the howl-idays!
                  </p>
                  <button className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg">
                    Schedule My Appointment
                  </button>
                  <p className="text-sm mt-4 opacity-90">
                    Click above to book online 24/7 or give us a call.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl">
                  <h3 className="text-xl font-bold text-purple-900 mb-4">💬 Still Sniffing Around?</h3>
                  <p className="text-gray-700">
                    Drop us a message. We're happy to answer questions, give you a tour, or talk you out of giving your dog a home haircut. (Trust us. We've seen some things.)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-purple-900 text-white py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="text-3xl">🐾</span>
              <h3 className="text-2xl font-bold">Pupperazi Pet Spa</h3>
            </div>
            <p className="text-purple-200 mb-6">
              Because Every Pet Deserves the Red Carpet Treatment
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-purple-200">
              <span>3454 Tampa Rd, Palm Harbor, FL 34684</span>
              <span>•</span>
              <span>727-753-9302</span>
              <span>•</span>
              <span>PupperaziPetSpa@gmail.com</span>
            </div>
            <div className="mt-8 pt-8 border-t border-purple-800">
              <p className="text-purple-300">
                © 2025 Pupperazi Pet Spa. All rights reserved. We roll out the paw-parazzi experience! 🎬
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
