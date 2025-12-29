'use client';

import { useState } from 'react';
import AppointmentPopup from '@/components/AppointmentPopup';

export default function TarponSpringsGroomingPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Pupperazi Pet Spa - Dog Grooming Near Tarpon Springs",
    "image": "https://pupperazipetspa.com/gallery/pet1.png",
    "description": "Professional dog grooming near Tarpon Springs, FL. Just 10 minutes away in Palm Harbor. Boutique grooming, baths, nail trims & more at Pupperazi Pet Spa.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "3454 Tampa Rd",
      "addressLocality": "Palm Harbor",
      "addressRegion": "FL",
      "postalCode": "34684"
    },
    "telephone": "727-753-9302",
    "priceRange": "$15-$125",
    "areaServed": ["Tarpon Springs FL", "Palm Harbor FL", "Holiday FL", "New Port Richey FL"]
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
        <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-blue-50 to-teal-50">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-900 mb-4">
              Dog Grooming Near Tarpon Springs, FL
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-6">
              Just 10 Minutes South on Tampa Rd • Boutique Pet Spa in Palm Harbor
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <button
                onClick={() => setIsPopupOpen(true)}
                className="px-8 py-4 rounded-full text-lg font-semibold shadow-lg cursor-pointer"
                style={{backgroundColor: '#C8E5F0', color: '#2D5A87'}}
              >
                Request Appointment
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
              📍 3454 Tampa Rd, Palm Harbor, FL 34684 • Easy drive from Tarpon Springs
            </p>
          </div>
        </section>

        {/* Why Drive from Tarpon Springs */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Why Tarpon Springs Pet Owners Choose Pupperazi
            </h2>

            <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-xl mb-8">
              <h3 className="text-xl font-bold text-purple-900 mb-3 text-center">🚗 Easy 10-Minute Drive</h3>
              <p className="text-gray-700 text-center">
                We're located at 3454 Tampa Rd in Palm Harbor—just head south on Alt 19 or Tampa Rd. Many Tarpon Springs families make the short drive for our boutique grooming experience!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-3">🏆 Boutique Experience</h3>
                <p className="text-gray-700">
                  Unlike chain stores, we're a locally-owned spa where your dog gets one-on-one attention. No assembly lines, no all-day crating—just personalized care in a calm environment.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-3">✂️ 20+ Years Experience</h3>
                <p className="text-gray-700">
                  Our lead groomer Tracy has over two decades of experience with all breeds. From Yorkies to Great Danes, doodles to Huskies—we've seen it all.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-3">💚 Gentle, Patient Care</h3>
                <p className="text-gray-700">
                  We specialize in nervous and anxious dogs. Our groomers take their time, use positive reinforcement, and never rush. Your pup's comfort is our priority.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-3">💰 Fair Pricing</h3>
                <p className="text-gray-700">
                  Premium grooming doesn't have to break the bank. Our prices are competitive, and we never surprise you with hidden fees. Full transparency, always.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Summary */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Our Services
            </h2>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                <h3 className="text-xl font-bold text-purple-800 mb-2">Bath Time Bliss</h3>
                <p className="text-2xl font-bold text-purple-600 mb-3">$45-65</p>
                <p className="text-gray-600 text-sm">
                  Full bath, ear cleaning, nail trim, brushout, blow dry & more
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                <h3 className="text-xl font-bold text-purple-800 mb-2">Mini Makeover</h3>
                <p className="text-2xl font-bold text-purple-600 mb-3">$50-95</p>
                <p className="text-gray-600 text-sm">
                  Bath package + face, feet & tail trim
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                <h3 className="text-xl font-bold text-purple-800 mb-2">Full Glam Groom</h3>
                <p className="text-2xl font-bold text-purple-600 mb-3">$65-125</p>
                <p className="text-gray-600 text-sm">
                  Complete grooming with full haircut & styling
                </p>
              </div>
            </div>

            <div className="text-center">
              <a
                href="/dog-grooming-palm-harbor-fl"
                className="text-purple-600 font-semibold hover:text-purple-800 underline"
              >
                View Full Service Menu & Pricing →
              </a>
            </div>
          </div>
        </section>

        {/* Directions */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-6 text-center">
              Getting Here from Tarpon Springs
            </h2>
            <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-xl">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-purple-900 mb-3">📍 From Downtown Tarpon Springs:</h3>
                  <ol className="text-gray-700 space-y-2 list-decimal list-inside">
                    <li>Head south on Pinellas Ave / Alt 19</li>
                    <li>Continue onto Tampa Rd</li>
                    <li>We're on the right at 3454 Tampa Rd</li>
                    <li>Look for us in the plaza near East Lake Rd</li>
                  </ol>
                  <p className="text-sm text-gray-500 mt-3">⏱️ About 10 minutes, 4 miles</p>
                </div>
                <div>
                  <h3 className="font-bold text-purple-900 mb-3">📍 From Tarpon Springs Sponge Docks:</h3>
                  <ol className="text-gray-700 space-y-2 list-decimal list-inside">
                    <li>Take Dodecanese Blvd to Alt 19</li>
                    <li>Head south on Alt 19</li>
                    <li>Turn left onto Tampa Rd</li>
                    <li>Continue 2 miles to 3454 Tampa Rd</li>
                  </ol>
                  <p className="text-sm text-gray-500 mt-3">⏱️ About 12 minutes, 5 miles</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-600 to-teal-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Give Your Pup the Boutique Treatment?
            </h2>
            <p className="text-xl mb-8">
              Tarpon Springs' favorite dog groomer is just 10 minutes away!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsPopupOpen(true)}
                className="px-8 py-4 rounded-full text-lg font-semibold shadow-lg cursor-pointer"
                style={{backgroundColor: '#C8E5F0', color: '#2D5A87'}}
              >
                Request Appointment
              </button>
              <a
                href="tel:727-753-9302"
                className="px-8 py-4 rounded-full text-lg font-semibold shadow-lg bg-white text-purple-900 text-center"
              >
                Call 727-753-9302
              </a>
            </div>
            <p className="mt-6 text-sm opacity-90">
              📍 3454 Tampa Rd, Palm Harbor, FL 34684<br />
              ⏰ Tue-Fri 8am-5:30pm, Sat 8am-5pm
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 bg-gray-900 text-gray-300 text-center text-sm">
          <p>© 2026 Pupperazi Pet Spa LLC. All rights reserved.</p>
          <p className="mt-2">
            <a href="/" className="hover:text-white">Home</a>
            {' | '}
            <a href="/dog-grooming-palm-harbor-fl" className="hover:text-white">Palm Harbor</a>
            {' | '}
            <a href="/dog-grooming-clearwater" className="hover:text-white">Clearwater</a>
            {' | '}
            <a href="/dog-grooming-dunedin" className="hover:text-white">Dunedin</a>
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

