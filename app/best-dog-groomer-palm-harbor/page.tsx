'use client';

import { useState } from 'react';
import AppointmentPopup from '@/components/AppointmentPopup';

export default function BestDogGroomerPalmHarborPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Pupperazi Pet Spa - Best Dog Groomer in Palm Harbor FL",
    "image": "https://pupperazi.krezzo.com/gallery/pet1.png",
    "description": "Voted best dog groomer in Palm Harbor, FL. Expert groomers with 20+ years experience. Boutique spa serving all breeds. Book your appointment today!",
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
    "telephone": "727-753-9302",
    "priceRange": "$15-$95",
    "openingHours": ["Tu-Fr 08:00-17:30", "Sa 08:00-17:00"]
  };

  const reviews = [
    {
      name: "Sarah M.",
      rating: 5,
      text: "Best groomer we've ever used! Tracy is amazing with our anxious golden retriever. The boutique atmosphere makes such a difference compared to big chains."
    },
    {
      name: "Michael R.",
      rating: 5,
      text: "Finally found a groomer who knows how to handle doodles! My goldendoodle looks amazing every time. Worth the drive from Clearwater."
    },
    {
      name: "Jennifer K.",
      rating: 5,
      text: "Pupperazi is the BEST! No more all-day waits. They call when she's ready (2-3 hours for small dogs & 2-4 hours for large dogs) and she actually seems happy when I pick her up."
    }
  ];

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
                <span className="text-xs">Call/Text</span> <span className="font-bold">727-753-9302</span>
              </a>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              ⭐⭐⭐⭐⭐ Palm Harbor's #1 Rated Groomer
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-900 mb-4">
              Best Dog Groomer in Palm Harbor, FL
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-6">
              Expert Groomers • 20+ Years Experience • All Breeds Welcome
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <button
                onClick={() => setIsPopupOpen(true)}
                className="px-8 py-4 rounded-full text-lg font-semibold shadow-lg cursor-pointer"
                style={{backgroundColor: '#C8E5F0', color: '#2D5A87'}}
              >
                Request Appointment Online
              </button>
              <a
                href="tel:727-753-9302"
                className="px-8 py-4 rounded-full text-lg font-semibold shadow-lg text-center"
                style={{backgroundColor: '#2D5A87', color: 'white'}}
              >
                <span className="text-sm">Call/Text</span> <span className="font-bold">727-753-9302</span>
              </a>
            </div>
            <p className="text-sm text-gray-600">
              📍 3454 Tampa Rd, Palm Harbor, FL 34684 | ⏰ Tue-Sat 8am-5:30pm
            </p>
          </div>
        </section>

        {/* What Makes Us The Best */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Why Palm Harbor Pet Owners Choose Pupperazi as the Best
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-xl">
                <div className="text-4xl mb-4">👩‍⚕️</div>
                <h3 className="text-2xl font-bold text-purple-900 mb-3">20+ Years of Experience</h3>
                <p className="text-gray-700">
                  Our lead groomer Tracy brings over 20 years of professional grooming expertise. She's worked with every breed, temperament, and coat type imaginable. From nervous rescues to high-energy puppies, she knows exactly how to make each dog comfortable.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-xl">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold text-purple-900 mb-3">Boutique, Not Corporate</h3>
                <p className="text-gray-700">
                  Unlike PetSmart or Petco, we're a small, locally-owned boutique spa. Your dog gets personalized one-on-one attention in a calm environment—no conveyor-belt grooming, no rushed appointments, no stressed-out dogs in crates all day.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-xl">
                <div className="text-4xl mb-4">❤️</div>
                <h3 className="text-2xl font-bold text-purple-900 mb-3">Anxiety-Friendly Approach</h3>
                <p className="text-gray-700">
                  Many dogs are nervous at groomers. We take our time, use positive reinforcement, and never force a scared dog. We space appointments to minimize noise and chaos. Your dog's emotional wellbeing is just as important as their physical appearance.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-xl">
                <div className="text-4xl mb-4">⏱️</div>
                <h3 className="text-2xl font-bold text-purple-900 mb-3">No All-Day Waits</h3>
                <p className="text-gray-700">
                  Most grooms take 2-3 hours for small dogs & 2-4 hours for large dogs, not 6-8 like the big chains. We call you when your pup is ready—same day pickup. Less stress for your dog, less waiting for you. It's that simple.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What Our Clients Say */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Don't Just Take Our Word For It
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {reviews.map((review, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="flex mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">⭐</span>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{review.text}"</p>
                  <p className="font-bold text-purple-900">— {review.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Expert Grooming Services
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-purple-200">
                <h3 className="text-2xl font-bold text-purple-800 mb-3">Full Glam Groom</h3>
                <p className="text-3xl font-bold text-purple-600 mb-4">$65-95</p>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Premium bath & conditioning</li>
                  <li>✓ Full-body haircut</li>
                  <li>✓ Nail trim & filing</li>
                  <li>✓ Ear cleaning</li>
                  <li>✓ Sanitary trim</li>
                  <li>✓ Breed-specific styling</li>
                  <li>✓ Blow dry & brushout</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-purple-200">
                <h3 className="text-2xl font-bold text-purple-800 mb-3">Bath Time Bliss</h3>
                <p className="text-3xl font-bold text-purple-600 mb-4">$45-65</p>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Premium shampoo & conditioning</li>
                  <li>✓ Ear cleaning</li>
                  <li>✓ Nail trim</li>
                  <li>✓ Pad & sanitary trim</li>
                  <li>✓ Brushout & blow dry</li>
                  <li>✓ Anal gland expression</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-purple-200">
                <h3 className="text-2xl font-bold text-purple-800 mb-3">Quick Wash</h3>
                <p className="text-3xl font-bold text-purple-600 mb-4">$15-20</p>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Sudsy bath</li>
                  <li>✓ Ear cleaning</li>
                  <li>✓ Towel dry</li>
                  <li>✓ Perfect between grooms</li>
                  <li>✓ Under 25 lbs: $15</li>
                  <li>✓ 26-100 lbs: $17-20</li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setIsPopupOpen(true)}
                className="px-8 py-4 rounded-full text-lg font-semibold shadow-lg cursor-pointer"
                style={{backgroundColor: '#2D5A87', color: 'white'}}
              >
                Book Your Appointment Today
              </button>
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Pupperazi vs. Big Box Stores
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-xl shadow-lg">
                <thead>
                  <tr className="bg-purple-600 text-white">
                    <th className="p-4 text-left">Feature</th>
                    <th className="p-4 text-center">Pupperazi Pet Spa</th>
                    <th className="p-4 text-center">PetSmart/Petco</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4">Appointment Duration</td>
                    <td className="p-4 text-center text-green-600 font-bold">2-3 hrs (small) / 2-4 hrs (large) ✓</td>
                    <td className="p-4 text-center text-red-600">6-8 hours ✗</td>
                  </tr>
                  <tr className="border-b bg-purple-50">
                    <td className="p-4">Experience Level</td>
                    <td className="p-4 text-center text-green-600 font-bold">20+ years ✓</td>
                    <td className="p-4 text-center text-red-600">Varies ✗</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">One-on-One Attention</td>
                    <td className="p-4 text-center text-green-600 font-bold">Yes ✓</td>
                    <td className="p-4 text-center text-red-600">No ✗</td>
                  </tr>
                  <tr className="border-b bg-purple-50">
                    <td className="p-4">Calm Environment</td>
                    <td className="p-4 text-center text-green-600 font-bold">Quiet, boutique ✓</td>
                    <td className="p-4 text-center text-red-600">Loud, chaotic ✗</td>
                  </tr>
                  <tr>
                    <td className="p-4">Locally Owned</td>
                    <td className="p-4 text-center text-green-600 font-bold">Yes ✓</td>
                    <td className="p-4 text-center text-red-600">Corporate ✗</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Experience the Best Dog Grooming in Palm Harbor?
            </h2>
            <p className="text-xl mb-8">
              Book your appointment today and see why we're rated #1 by local pet owners!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsPopupOpen(true)}
                className="px-8 py-4 rounded-full text-lg font-semibold shadow-lg cursor-pointer"
                style={{backgroundColor: '#C8E5F0', color: '#2D5A87'}}
              >
                Request Appointment Online
              </button>
              <a
                href="tel:727-753-9302"
                className="px-8 py-4 rounded-full text-lg font-semibold shadow-lg bg-white text-purple-900 text-center"
              >
                <span className="text-sm">Call/Text</span> <span className="font-bold">727-753-9302</span>
              </a>
            </div>
            <p className="mt-6 text-sm opacity-90">
              📍 3454 Tampa Rd, Palm Harbor, FL 34684<br />
              ⏰ Tuesday-Friday 8am-5:30pm, Saturday 8am-5pm
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 bg-gray-900 text-gray-300 text-center text-sm">
          <p>© 2026 Pupperazi Pet Spa LLC. All rights reserved.</p>
          <br />
          <p>
            Site built with ❤️ in <a href="https://www.stephennewman.me" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Palm Harbor</a>
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
