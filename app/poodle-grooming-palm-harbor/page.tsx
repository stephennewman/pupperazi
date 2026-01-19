'use client';

import { useState } from 'react';
import AppointmentPopup from '@/components/AppointmentPopup';

export default function PoodleGroomingPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Poodle Grooming - Palm Harbor FL",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Pupperazi Pet Spa",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "3454 Tampa Rd",
        "addressLocality": "Palm Harbor",
        "addressRegion": "FL",
        "postalCode": "34684"
      },
      "telephone": "727-753-9302"
    },
    "areaServed": "Palm Harbor, FL",
    "description": "Professional Poodle grooming in Palm Harbor, FL. Expert cuts for Standard, Miniature, and Toy Poodles at Pupperazi Pet Spa."
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-white">
        {/* Header */}
        <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <a href="/" className="flex items-center space-x-2">
                <span className="text-2xl">🐾</span>
                <h1 className="text-xl sm:text-2xl font-bold text-purple-900">Pupperazi Pet Spa</h1>
              </a>
              <a
                href="tel:727-753-9302"
                className="px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold text-sm sm:text-base"
                style={{backgroundColor: '#2D5A87', color: 'white'}}
              >
                <span className="hidden sm:inline text-xs">Call/Text</span> <span className="font-bold">727-753-9302</span>
              </a>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">🐩</div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-900 mb-4">
              Poodle Grooming in Palm Harbor, FL
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-6">
              Expert Poodle Styling for Standard, Miniature & Toy Poodles — Classic Cuts to Modern Styles
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <button
                onClick={() => setIsPopupOpen(true)}
                className="px-8 py-4 rounded-full text-lg font-semibold shadow-lg cursor-pointer"
                style={{backgroundColor: '#C8E5F0', color: '#2D5A87'}}
              >
                Book Poodle Grooming
              </button>
              <a
                href="tel:727-753-9302"
                className="px-8 py-4 rounded-full text-lg font-semibold shadow-lg text-center"
                style={{backgroundColor: '#2D5A87', color: 'white'}}
              >
                Call 727-753-9302
              </a>
            </div>
            <p className="text-sm text-gray-600">
              📍 3454 Tampa Rd, Palm Harbor, FL 34684
            </p>
          </div>
        </section>

        {/* Poodle Expertise */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-6 text-center">
              Why Poodles Require Expert Grooming
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 mb-8">
              <p className="mb-4">
                Poodles have one of the most unique coats in the dog world—a dense, curly, continuously-growing coat that doesn't shed but requires regular professional grooming. Without proper care, their gorgeous curls quickly become painful mats.
              </p>
              <p className="mb-4">
                At Pupperazi Pet Spa, we love grooming Poodles! Whether you want a traditional continental clip, a sporty lamb cut, or a low-maintenance puppy cut, we have the skills to make your Poodle look and feel their best.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl text-center">
                <div className="text-4xl mb-3">🏆</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Standard Poodles</h3>
                <p className="text-gray-700 text-sm">
                  The largest variety, requiring 3-4 hours for a full groom. We specialize in proper scissor work for that beautiful Poodle silhouette.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl text-center">
                <div className="text-4xl mb-3">⭐</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Miniature Poodles</h3>
                <p className="text-gray-700 text-sm">
                  The "just right" size—big enough to style, compact enough to manage. Perfect for Florida families wanting an elegant companion.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl text-center">
                <div className="text-4xl mb-3">💎</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Toy Poodles</h3>
                <p className="text-gray-700 text-sm">
                  Small but sassy! Even tiny Poodles need regular grooming. We handle these delicate dogs with extra care and patience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services & Pricing */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Poodle Grooming Services & Pricing
            </h2>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-purple-800 mb-2">Toy Poodle</h3>
                <p className="text-2xl font-bold text-purple-600 mb-4">$55-75</p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>✓ Full bath & blow dry</li>
                  <li>✓ Complete haircut</li>
                  <li>✓ Face & feet shaping</li>
                  <li>✓ Nail trim & ear cleaning</li>
                  <li>✓ Topknot styling (optional)</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-purple-300">
                <div className="text-xs font-bold text-purple-600 mb-1">MOST POPULAR</div>
                <h3 className="text-xl font-bold text-purple-800 mb-2">Miniature Poodle</h3>
                <p className="text-2xl font-bold text-purple-600 mb-4">$70-95</p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>✓ Full bath & blow dry</li>
                  <li>✓ Complete haircut</li>
                  <li>✓ Face & feet shaping</li>
                  <li>✓ Nail trim & ear cleaning</li>
                  <li>✓ Scissor finishing</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-purple-800 mb-2">Standard Poodle</h3>
                <p className="text-2xl font-bold text-purple-600 mb-4">$95-140</p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>✓ Full bath & blow dry</li>
                  <li>✓ Complete haircut</li>
                  <li>✓ Face & feet shaping</li>
                  <li>✓ Nail trim & ear cleaning</li>
                  <li>✓ Premium scissor work</li>
                </ul>
              </div>
            </div>

            <div className="bg-pink-100 p-6 rounded-xl text-center">
              <h3 className="text-xl font-bold text-pink-900 mb-2">🎀 Show Grooming Available</h3>
              <p className="text-pink-800">
                Competing in conformation? We offer show grooming with proper pattern clips. Contact us to discuss your show schedule and grooming needs.
              </p>
            </div>
          </div>
        </section>

        {/* Popular Poodle Cuts */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Popular Poodle Haircut Styles
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-2">🐑 Lamb Cut</h3>
                <p className="text-gray-700 text-sm">
                  Same length all over the body with a clean face and feet. The most popular pet Poodle style—easy to maintain and adorable!
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-2">🧸 Teddy Bear Cut</h3>
                <p className="text-gray-700 text-sm">
                  Shorter body with a fluffy, rounded face. Gives your Poodle that irresistible puppy look regardless of age.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-2">👑 Continental Clip</h3>
                <p className="text-gray-700 text-sm">
                  The classic show Poodle look with pom poms and shaved areas. Elegant and distinctive—a true statement style.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-2">🏊 Sporting Clip</h3>
                <p className="text-gray-700 text-sm">
                  Short all over with a scissored topknot. Perfect for active Poodles who swim or love outdoor adventures.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-2">🌸 Miami/Bikini Clip</h3>
                <p className="text-gray-700 text-sm">
                  Shaved body with pom poms on legs and tail. A fun Florida-friendly style that shows off your Poodle's athletic build!
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-2">☀️ Summer Cut</h3>
                <p className="text-gray-700 text-sm">
                  Very short all over to beat Florida's heat. We can go as short as you like while keeping your Poodle stylish.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Poodle Grooming FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  How often should I groom my Poodle?
                </summary>
                <p className="mt-4 text-gray-700">
                  Every 4-6 weeks is ideal for Poodles. Their hair grows continuously and mats quickly without regular grooming. Toy Poodles can sometimes go 6 weeks, while Standards with longer styles may need grooming every 4 weeks.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  Why are Poodles more expensive to groom than other breeds?
                </summary>
                <p className="mt-4 text-gray-700">
                  Poodle grooming requires specialized skills, more time, and extensive scissor work. A proper Poodle groom involves hand-scissoring to create that beautiful rounded silhouette, which takes significantly longer than clipper work on other breeds.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  Do Poodles need their faces shaved?
                </summary>
                <p className="mt-4 text-gray-700">
                  Traditional Poodle cuts include a clean-shaved face, but it's not required! Many pet Poodle owners prefer a "teddy bear face" with fuller fur around the muzzle. We're happy to do either style based on your preference.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  My Poodle's ears get dirty. How can I prevent ear infections?
                </summary>
                <p className="mt-4 text-gray-700">
                  Poodles grow hair inside their ear canals, which traps moisture and debris. We remove excess ear hair and clean ears with every groom. Between appointments, check ears weekly for redness or odor and keep them dry after swimming.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  Can you groom my Poodle mix (Cockapoo, Maltipoo, etc.)?
                </summary>
                <p className="mt-4 text-gray-700">
                  Absolutely! We groom all Poodle mixes. These "doodle" and "poo" breeds often have coats similar to Poodles and benefit from our expertise. Check out our Goldendoodle and Labradoodle pages for more doodle info!
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Give Your Poodle the Styling They Deserve
            </h2>
            <p className="text-xl mb-8">
              From Toy to Standard, classic to modern styles—your Poodle is in expert hands at Pupperazi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsPopupOpen(true)}
                className="px-8 py-4 rounded-full text-lg font-semibold shadow-lg cursor-pointer"
                style={{backgroundColor: '#C8E5F0', color: '#2D5A87'}}
              >
                Book Poodle Grooming
              </button>
              <a
                href="tel:727-753-9302"
                className="px-8 py-4 rounded-full text-lg font-semibold shadow-lg bg-white text-purple-900 text-center"
              >
                Call 727-753-9302
              </a>
            </div>
            <p className="mt-6 text-sm opacity-90">
              📍 3454 Tampa Rd, Palm Harbor, FL 34684 | ⏰ Tue-Sat
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 bg-gray-900 text-gray-300 text-center text-sm">
          <p>© 2026 Pupperazi Pet Spa LLC. All rights reserved.</p>
          <p className="mt-2">
            <a href="/" className="hover:text-white">Home</a>
            {' | '}
            <a href="/goldendoodle-grooming-palm-harbor" className="hover:text-white">Goldendoodle Grooming</a>
            {' | '}
            <a href="/labradoodle-grooming-palm-harbor" className="hover:text-white">Labradoodle Grooming</a>
            {' | '}
            <a href="/dog-grooming-palm-harbor-fl" className="hover:text-white">Dog Grooming Palm Harbor</a>
          </p>
        </footer>

        <AppointmentPopup 
          isOpen={isPopupOpen} 
          onClose={() => setIsPopupOpen(false)} 
        />
      </div>
    </>
  );
}
