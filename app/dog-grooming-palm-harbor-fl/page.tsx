'use client';

import { useState } from 'react';
import Image from 'next/image';
import AppointmentPopup from '@/components/AppointmentPopup';

export default function DogGroomingPalmHarborPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Pupperazi Pet Spa - Dog Grooming Palm Harbor FL",
    "image": "https://pupperazi-pet-spa.vercel.app/gallery/pet1.png",
    "description": "Professional dog grooming in Palm Harbor, FL. Boutique pet spa offering full-service grooming, baths, nail trims, and more. Serving Palm Harbor, Dunedin, Clearwater & Tarpon Springs.",
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
    "openingHours": ["Tu-Fr 08:00-17:30", "Sa 08:00-17:00"],
    "areaServed": [
      "Palm Harbor FL",
      "Dunedin FL",
      "Clearwater FL",
      "Tarpon Springs FL",
      "Safety Harbor FL"
    ]
  };

  const faqs = [
    {
      question: "How much does dog grooming cost in Palm Harbor?",
      answer: "Our grooming prices range from $15 for a quick wash to $95 for a full glam groom. Bath Time Bliss packages start at $45-65, while our signature Full Glam Groom runs $65-95 depending on your dog's size and coat condition. We also offer quick Wash 'N Go baths starting at just $15 for dogs under 25 lbs."
    },
    {
      question: "How long does a grooming appointment take?",
      answer: "Most grooming appointments take 2-3 hours. Unlike chain stores where dogs wait in crates all day, we space our appointments to minimize stress and crate time. We'll call you when your pup is ready for pickup—typically the same day."
    },
    {
      question: "Do you groom all dog breeds?",
      answer: "Yes! We groom all breeds and sizes—from tiny Yorkies to giant Great Danes. Our experienced groomers have worked with every breed imaginable, including doodles, poodles, terriers, and double-coated breeds. Each dog gets personalized care based on their coat type and temperament."
    },
    {
      question: "What's included in your grooming services?",
      answer: "Our Bath Time Bliss includes: premium shampoo & conditioning, ear cleaning, nail trim, pad & sanitary trim, thorough brushout, blow dry, and anal gland expression. Our Full Glam Groom includes all of that plus a complete haircut styled to your preferences."
    },
    {
      question: "Are you better than big box pet stores like PetSmart or Petco?",
      answer: "We're a boutique grooming spa, not an assembly line. Your dog gets one-on-one attention from experienced groomers in a calm, quiet environment. We limit appointments to reduce stress, never rush, and treat every pet like family. Many of our clients switched from chains specifically for our personalized, anxiety-free approach."
    },
    {
      question: "Do you handle anxious or difficult dogs?",
      answer: "Absolutely. Many dogs are anxious at groomers, and we're experienced in handling nervous pups. Our calm environment, patient staff, and spaced appointments help reduce anxiety. We take breaks as needed and never force a scared dog. Your pet's comfort and safety always come first."
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-white">
        {/* Minimal Header */}
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

        {/* Hero Section - SEO Optimized */}
        <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-900 mb-4">
              Dog Grooming in Palm Harbor, FL
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-6">
              Boutique Pet Spa Serving Palm Harbor, Dunedin, Clearwater & Tarpon Springs
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

        {/* Why Choose Us Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Why Palm Harbor Pet Owners Choose Pupperazi Pet Spa
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl">
                <div className="text-3xl mb-3">🏆</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Boutique, Not a Chain</h3>
                <p className="text-gray-700">
                  Unlike PetSmart or Petco, we're a locally-owned boutique spa. Your dog gets one-on-one attention in a calm, quiet environment—not an assembly line.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl">
                <div className="text-3xl mb-3">⏱️</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">No All-Day Crating</h3>
                <p className="text-gray-700">
                  We space appointments so your dog isn't stuck in a crate for 6+ hours. Most grooms take 2-3 hours, and we call when ready for pickup.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl">
                <div className="text-3xl mb-3">✂️</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">20+ Years Experience</h3>
                <p className="text-gray-700">
                  Our lead groomer Tracy has over 20 years of experience with all breeds—from Yorkies to Great Danes, poodles to doodles.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl">
                <div className="text-3xl mb-3">💚</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Anxiety-Friendly Approach</h3>
                <p className="text-gray-700">
                  We specialize in nervous and anxious dogs. Patient handling, calm environment, and breaks as needed. Your pet's comfort comes first.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl">
                <div className="text-3xl mb-3">🌿</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Premium Products</h3>
                <p className="text-gray-700">
                  We use high-quality, gentle shampoos and conditioners—never harsh chemicals. Perfect for sensitive skin and allergies.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl">
                <div className="text-3xl mb-3">📍</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Convenient Location</h3>
                <p className="text-gray-700">
                  Right on Tampa Rd in Palm Harbor—easy access from Dunedin, Clearwater, Safety Harbor, and Tarpon Springs. Plenty of parking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services & Pricing */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Dog Grooming Services & Prices in Palm Harbor
            </h2>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-purple-800 mb-3">Bath Time Bliss</h3>
                <p className="text-3xl font-bold text-purple-600 mb-4">$45-65</p>
                <p className="text-gray-700 mb-4">Full-service bath with premium products</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Premium shampoo & conditioning</li>
                  <li>✓ Ear cleaning</li>
                  <li>✓ Nail trim</li>
                  <li>✓ Pad & sanitary trim</li>
                  <li>✓ Thorough brushout</li>
                  <li>✓ Blow dry</li>
                  <li>✓ Anal gland expression</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-purple-800 mb-3">Mini Makeover</h3>
                <p className="text-3xl font-bold text-purple-600 mb-4">$25-35</p>
                <p className="text-gray-700 mb-4">Bath + face, feet & tail trim</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Everything in Bath Time Bliss</li>
                  <li>✓ Face trim & tidy</li>
                  <li>✓ Feet trim</li>
                  <li>✓ Tail styling</li>
                  <li>✓ Perfect touch-up between full grooms</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-purple-400">
                <div className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-2">
                  MOST POPULAR
                </div>
                <h3 className="text-2xl font-bold text-purple-800 mb-3">Full Glam Groom</h3>
                <p className="text-3xl font-bold text-purple-600 mb-4">$65-95</p>
                <p className="text-gray-700 mb-4">Complete grooming package</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Everything above</li>
                  <li>✓ Full-body haircut</li>
                  <li>✓ Breed-specific styling</li>
                  <li>✓ Custom cuts to your preferences</li>
                  <li>✓ Perfect for special occasions</li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
              <h3 className="text-2xl font-bold text-purple-900 mb-4">Quick Wash 'N Go Baths</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="font-semibold text-purple-900">Under 25 lbs</p>
                  <p className="text-2xl font-bold text-purple-600">$15</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="font-semibold text-purple-900">26-50 lbs</p>
                  <p className="text-2xl font-bold text-purple-600">$17</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="font-semibold text-purple-900">51-100 lbs</p>
                  <p className="text-2xl font-bold text-purple-600">$20</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="font-semibold text-purple-900">Over 100 lbs</p>
                  <p className="text-2xl font-bold text-purple-600">Call</p>
                </div>
              </div>
              <p className="text-center text-gray-600 mt-4 text-sm">
                Includes sudsy bath, ear cleaning, and towel dry. Perfect for a quick refresh!
              </p>
            </div>

            <div className="text-center">
              <button
                onClick={() => setIsPopupOpen(true)}
                className="px-8 py-4 rounded-full text-lg font-semibold shadow-lg cursor-pointer"
                style={{backgroundColor: '#2D5A87', color: 'white'}}
              >
                Request Your Grooming Appointment
              </button>
            </div>
          </div>
        </section>

        {/* Serving Areas */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-6 text-center">
              Serving Palm Harbor & Surrounding Areas
            </h2>
            <p className="text-lg text-gray-700 text-center mb-8">
              Located in the heart of Palm Harbor, we're convenient for pet owners throughout North Pinellas County.
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg text-center">
                <p className="font-bold text-purple-900">Palm Harbor</p>
                <p className="text-sm text-gray-600">Our home base</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg text-center">
                <p className="font-bold text-purple-900">Dunedin</p>
                <p className="text-sm text-gray-600">5 miles north</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg text-center">
                <p className="font-bold text-purple-900">Clearwater</p>
                <p className="text-sm text-gray-600">7 miles south</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg text-center">
                <p className="font-bold text-purple-900">Safety Harbor</p>
                <p className="text-sm text-gray-600">3 miles south</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg text-center">
                <p className="font-bold text-purple-900">Tarpon Springs</p>
                <p className="text-sm text-gray-600">10 miles north</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg text-center">
                <p className="font-bold text-purple-900">Oldsmar</p>
                <p className="text-sm text-gray-600">8 miles southeast</p>
              </div>
            </div>
            <p className="text-center text-gray-700">
              Easy to find on Tampa Rd with plenty of parking. Many of our clients make the short drive from surrounding cities for our boutique grooming experience.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Frequently Asked Questions About Dog Grooming in Palm Harbor
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details key={index} className="bg-white p-6 rounded-xl shadow-lg">
                  <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                    {faq.question}
                  </summary>
                  <p className="mt-4 text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-6 text-center">
              About Pupperazi Pet Spa
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-4">
                Pupperazi Pet Spa has been Palm Harbor's trusted boutique dog grooming destination since 2011. What started as a passion for providing exceptional pet care has grown into a beloved local business known for our gentle approach, experienced staff, and commitment to every dog's wellbeing.
              </p>
              <p className="mb-4">
                Located at 3454 Tampa Rd in Palm Harbor, we're proud to serve pet families throughout North Pinellas County, including Dunedin, Clearwater, Safety Harbor, Tarpon Springs, and Oldsmar. Our convenient location and flexible hours make it easy to fit grooming into your busy schedule.
              </p>
              <p className="mb-4">
                Unlike big-box pet stores, we limit the number of appointments each day to ensure every dog receives personalized attention in a calm, low-stress environment. Our experienced groomers—including Tracy, who brings over 20 years of expertise—work with all breeds, sizes, and temperaments. Whether your pup is a regular or dealing with anxiety, we create a positive grooming experience from start to finish.
              </p>
              <p className="mb-4">
                We believe in holistic pet wellness that goes beyond just a haircut. From using premium, gentle products to educating pet parents about at-home care, we're here to help your dog look good and feel great. Your pet isn't just another appointment—they're a VIP (Very Important Pet) who deserves the best.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Give Your Dog the Boutique Grooming Experience?
            </h2>
            <p className="text-xl mb-8">
              Book your appointment today! Spots fill up fast, especially during peak seasons.
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
              ⏰ Tuesday-Friday 8am-5:30pm, Saturday 8am-5pm<br />
              ✉️ PupperaziPetSpa@gmail.com
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
          <p className="mt-2">
            <a href="/" className="hover:text-white">Home</a>
            {' | '}
            <a href="/booking" className="hover:text-white">Book Appointment</a>
            {' | '}
            <a href="/map-hours" className="hover:text-white">Location & Hours</a>
          </p>
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
