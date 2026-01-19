'use client';

import { useState } from 'react';
import AppointmentPopup from '@/components/AppointmentPopup';

export default function LabradoodleGroomingPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Labradoodle Grooming - Palm Harbor FL",
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
    "description": "Professional Labradoodle grooming in Palm Harbor, FL. Expert doodle coat care, dematting, and styling at Pupperazi Pet Spa."
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
        <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-amber-50 to-yellow-50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">🐕</div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-900 mb-4">
              Labradoodle Grooming in Palm Harbor, FL
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-6">
              Expert Care for Your Labradoodle's Unique Coat — From Wavy to Curly, We've Got You Covered
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <button
                onClick={() => setIsPopupOpen(true)}
                className="px-8 py-4 rounded-full text-lg font-semibold shadow-lg cursor-pointer"
                style={{backgroundColor: '#C8E5F0', color: '#2D5A87'}}
              >
                Book Labradoodle Grooming
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

        {/* Why Labradoodles Need Special Care */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-6 text-center">
              Why Labradoodles Need Specialized Grooming
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 mb-8">
              <p className="mb-4">
                Labradoodles inherit a unique mix of coat types from their Labrador and Poodle parents. Whether your Labradoodle has a fleece coat, wool coat, or hair coat, each requires specific grooming techniques to keep them healthy and comfortable.
              </p>
              <p className="mb-4">
                At Pupperazi Pet Spa in Palm Harbor, we specialize in doodle grooming and understand the nuances of Labradoodle coats. Florida's humidity makes regular grooming even more important to prevent matting and skin issues.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-3">🧬 Three Coat Types</h3>
                <p className="text-gray-700">
                  <strong>Fleece:</strong> Soft, wavy texture (most common). <strong>Wool:</strong> Tight curls like a Poodle. <strong>Hair:</strong> Straighter, more Lab-like. We adjust our techniques for each type.
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-3">🔄 Every 6-8 Weeks</h3>
                <p className="text-gray-700">
                  Labradoodles need professional grooming every 6-8 weeks. Their non-shedding coats trap loose fur that mats without regular brushing and grooming.
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-3">☀️ Florida Humidity Factor</h3>
                <p className="text-gray-700">
                  Palm Harbor's humidity accelerates matting. We use conditioning treatments and proper drying techniques to combat Florida's climate effects on doodle coats.
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-3">✂️ Gentle Dematting</h3>
                <p className="text-gray-700">
                  We never force through severe mats. If matting is too tight, we'll discuss humane options that prioritize your Labradoodle's comfort and skin health.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Our Labradoodle Grooming Services
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-purple-800 mb-2">Full Labradoodle Groom</h3>
                <p className="text-2xl font-bold text-purple-600 mb-4">$85-130</p>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Bath with coat-appropriate shampoo</li>
                  <li>✓ Complete blow dry & brushout</li>
                  <li>✓ Full body haircut (style of choice)</li>
                  <li>✓ Face, ears, and sanitary trim</li>
                  <li>✓ Nail trim & paw pad cleanup</li>
                  <li>✓ Ear cleaning</li>
                  <li>✓ Light dematting included</li>
                </ul>
                <p className="text-sm text-gray-500 mt-4">*Price varies by size (mini, medium, standard)</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-purple-800 mb-2">Labradoodle Bath & Brush</h3>
                <p className="text-2xl font-bold text-purple-600 mb-4">$55-80</p>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Deep cleansing bath</li>
                  <li>✓ Thorough blow dry</li>
                  <li>✓ Full body brushout & dematting</li>
                  <li>✓ Nail trim</li>
                  <li>✓ Ear cleaning</li>
                  <li>✓ Sanitary trim</li>
                  <li>✓ Perfect between full grooms</li>
                </ul>
                <p className="text-sm text-gray-500 mt-4">*Maintains coat health between haircuts</p>
              </div>
            </div>

            <div className="bg-amber-100 p-6 rounded-xl text-center">
              <h3 className="text-xl font-bold text-amber-900 mb-2">🌟 Australian Labradoodles Welcome!</h3>
              <p className="text-amber-800">
                We groom all Labradoodle varieties including Australian Labradoodles, which often have fleecer, more consistent coats. Same great care, tailored to your doodle's specific coat type.
              </p>
            </div>
          </div>
        </section>

        {/* Labradoodle vs Goldendoodle */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Labradoodle vs Goldendoodle Grooming
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-4">
                While both breeds are "doodles," Labradoodles often have slightly different coat characteristics. Labradoodles tend to have denser undercoats and may be more prone to oily skin. Here's how we adjust our approach:
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-blue-900 mb-3">Labradoodle Considerations</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Denser undercoat in many dogs</li>
                  <li>• May have oilier skin (Lab influence)</li>
                  <li>• Often more athletic build</li>
                  <li>• Coat may be more water-resistant</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-amber-900 mb-3">Our Approach</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Degreasing shampoo when needed</li>
                  <li>• Extra attention to undercoat</li>
                  <li>• Thorough drying to prevent hot spots</li>
                  <li>• Ear cleaning (floppy ears trap moisture)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Labradoodle Grooming FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  How often should I groom my Labradoodle?
                </summary>
                <p className="mt-4 text-gray-700">
                  Every 6-8 weeks for professional grooming is ideal. Between appointments, brush your Labradoodle 2-3 times per week minimum. Dogs with wool coats may need more frequent brushing than those with fleece coats.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  Do Labradoodles shed?
                </summary>
                <p className="mt-4 text-gray-700">
                  Most Labradoodles are low-shedding, but not non-shedding. Wool-coated Labradoodles shed the least, while hair-coated varieties may shed more like a Labrador. Their loose fur gets trapped in the coat, requiring regular brushing to prevent matting.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  What's the best haircut for a Labradoodle in Florida?
                </summary>
                <p className="mt-4 text-gray-700">
                  For Florida's heat and humidity, we often recommend a shorter cut (1 inch or less) during summer months. The "teddy bear cut" at a shorter length stays cute while keeping your dog cool. We can go longer in winter months if preferred.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  My Labradoodle has ear problems. Can you help?
                </summary>
                <p className="mt-4 text-gray-700">
                  Labradoodles are prone to ear issues due to their floppy ears and hair growth in the ear canal. We include ear cleaning and hair removal with every groom. If you notice redness, odor, or excessive scratching, see your vet—we can help maintain clean ears, but infections need medical treatment.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  How long does Labradoodle grooming take?
                </summary>
                <p className="mt-4 text-gray-700">
                  Plan for 2.5-4 hours depending on size and coat condition. Standard Labradoodles take longer than minis. Severely matted dogs may take additional time. We never rush—proper drying and brushing is essential for doodle coats.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Your Labradoodle Deserves Expert Doodle Care
            </h2>
            <p className="text-xl mb-8">
              Palm Harbor's trusted doodle specialists. Serving mini, medium, and standard Labradoodles!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsPopupOpen(true)}
                className="px-8 py-4 rounded-full text-lg font-semibold shadow-lg cursor-pointer"
                style={{backgroundColor: '#C8E5F0', color: '#2D5A87'}}
              >
                Book Labradoodle Grooming
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
            <a href="/dog-grooming-palm-harbor-fl" className="hover:text-white">Dog Grooming Palm Harbor</a>
            {' | '}
            <a href="/map-hours" className="hover:text-white">Location</a>
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
