'use client';

import { useState } from 'react';
import AppointmentPopup from '@/components/AppointmentPopup';

export default function DachshundGroomingPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Dachshund Grooming - Palm Harbor FL",
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
    "description": "Professional Dachshund grooming in Palm Harbor, FL. Expert care for smooth, longhaired, and wirehaired Dachshunds at Pupperazi Pet Spa."
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
        <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-orange-50 to-red-50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">🌭</div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-900 mb-4">
              Dachshund Grooming in Palm Harbor, FL
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-6">
              Gentle, Expert Care for Your Little Wiener Dog — Smooth, Longhaired & Wirehaired Varieties
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <button
                onClick={() => setIsPopupOpen(true)}
                className="px-8 py-4 rounded-full text-lg font-semibold shadow-lg cursor-pointer"
                style={{backgroundColor: '#C8E5F0', color: '#2D5A87'}}
              >
                Book Dachshund Grooming
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

        {/* Dachshund Coat Types */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-6 text-center">
              Three Coat Types, Three Grooming Approaches
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 mb-8 text-center">
              <p>
                Dachshunds come in three coat varieties, each with different grooming needs. At Pupperazi Pet Spa, we tailor our approach to your Doxie's specific coat type.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl">
                <div className="text-4xl mb-3 text-center">✨</div>
                <h3 className="text-xl font-bold text-purple-900 mb-3 text-center">Smooth Coat</h3>
                <p className="text-gray-700 text-sm mb-3">
                  The classic Dachshund! Short, shiny coat that's easy to maintain but still sheds.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Regular baths to reduce shedding</li>
                  <li>• Deshedding treatment recommended</li>
                  <li>• Nail trims essential (low activity = less wear)</li>
                  <li>• Skin fold cleaning if needed</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl">
                <div className="text-4xl mb-3 text-center">🌊</div>
                <h3 className="text-xl font-bold text-purple-900 mb-3 text-center">Longhaired</h3>
                <p className="text-gray-700 text-sm mb-3">
                  Beautiful flowing coat with feathering on ears, chest, and tail. Requires regular brushing.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Brushing to prevent tangles</li>
                  <li>• Sanitary trims for cleanliness</li>
                  <li>• Ear feathering trimmed on request</li>
                  <li>• Feet and belly tidying</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl">
                <div className="text-4xl mb-3 text-center">🧔</div>
                <h3 className="text-xl font-bold text-purple-900 mb-3 text-center">Wirehaired</h3>
                <p className="text-gray-700 text-sm mb-3">
                  Adorable beard and bushy eyebrows! Wiry outer coat with softer undercoat.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Hand stripping or clipper work</li>
                  <li>• Beard and eyebrow shaping</li>
                  <li>• Leg furnishing trimming</li>
                  <li>• Undercoat maintenance</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Services & Pricing */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Dachshund Grooming Services
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-purple-800 mb-2">Smooth Dachshund Bath</h3>
                <p className="text-2xl font-bold text-purple-600 mb-4">$35-45</p>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Deshedding shampoo & treatment</li>
                  <li>✓ Thorough blow dry</li>
                  <li>✓ Nail trim (includes dremel smoothing)</li>
                  <li>✓ Ear cleaning</li>
                  <li>✓ Sanitary trim</li>
                  <li>✓ Cologne spritz</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-purple-800 mb-2">Longhaired/Wirehaired Groom</h3>
                <p className="text-2xl font-bold text-purple-600 mb-4">$50-65</p>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Full bath & conditioning</li>
                  <li>✓ Blow dry with brushout</li>
                  <li>✓ Trimming & shaping as needed</li>
                  <li>✓ Nail trim with dremel</li>
                  <li>✓ Ear cleaning</li>
                  <li>✓ Sanitary trim</li>
                  <li>✓ Paw pad cleanup</li>
                </ul>
              </div>
            </div>

            <div className="bg-orange-100 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-orange-900 mb-2 text-center">🦴 Dachshund-Specific Care</h3>
              <p className="text-orange-800 text-center">
                We understand Dachshund backs! Our tables have non-slip surfaces, and we never let your Doxie jump on or off the grooming table. We support their long spines properly during every step of grooming.
              </p>
            </div>
          </div>
        </section>

        {/* Back Safety */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-6 text-center">
              We Protect Your Dachshund's Back
            </h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-gray-700 mb-4">
                  Dachshunds are prone to Intervertebral Disc Disease (IVDD) due to their long spines. At Pupperazi, we take extra precautions:
                </p>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>No jumping:</strong> We lift your Doxie onto and off the table—never let them jump</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>Proper support:</strong> Always support both front and back when lifting</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>Non-slip surfaces:</strong> Secure footing on our grooming tables</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>Calm environment:</strong> No sudden movements that could cause twisting</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-green-900 mb-3">💚 Back-Safe Guarantee</h3>
                <p className="text-green-800 text-sm">
                  As Dachshund lovers ourselves, we treat every wiener dog like our own. Your Doxie's comfort and safety is our top priority. If your dog has known back issues, please let us know so we can take extra care.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Dachshund Grooming FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  How often should I groom my Dachshund?
                </summary>
                <p className="mt-4 text-gray-700">
                  <strong>Smooth coats:</strong> Every 6-8 weeks for baths and nail trims. <strong>Longhaired:</strong> Every 6-8 weeks with brushing at home. <strong>Wirehaired:</strong> Every 8-12 weeks, depending on how you maintain the coat (stripped vs. clipped).
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  Do Dachshunds shed a lot?
                </summary>
                <p className="mt-4 text-gray-700">
                  Yes! Even smooth-coated Dachshunds shed, especially during season changes. Longhaired varieties shed moderately. Regular deshedding baths help significantly reduce the fur around your home.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  My Dachshund hates nail trims. Can you help?
                </summary>
                <p className="mt-4 text-gray-700">
                  Dachshunds are notorious for being dramatic about nail trims! We use a gentle approach with lots of treats and patience. We also use a dremel to smooth nails, which many dogs prefer over clippers. Regular trims (every 2-4 weeks) help them get used to it.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  Should I shave my longhaired Dachshund in summer?
                </summary>
                <p className="mt-4 text-gray-700">
                  We don't recommend shaving longhaired Dachshunds. Their coat actually helps regulate temperature and protects from sunburn. A good trim to neaten things up and remove excess undercoat is better than shaving.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  Do you groom Dachshund mixes?
                </summary>
                <p className="mt-4 text-gray-700">
                  Absolutely! We groom all Dachshund mixes including Doxiepoos, Chiweenies, and Dorgis. These mixes often have unique coat combinations that we're happy to work with.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-gradient-to-br from-orange-600 to-red-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Give Your Dachshund the Safe, Gentle Grooming They Deserve
            </h2>
            <p className="text-xl mb-8">
              Standard, miniature, smooth, long, or wire—we love all Dachshunds!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsPopupOpen(true)}
                className="px-8 py-4 rounded-full text-lg font-semibold shadow-lg cursor-pointer"
                style={{backgroundColor: '#C8E5F0', color: '#2D5A87'}}
              >
                Book Dachshund Grooming
              </button>
              <a
                href="tel:727-753-9302"
                className="px-8 py-4 rounded-full text-lg font-semibold shadow-lg bg-white text-orange-900 text-center"
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
            <a href="/yorkie-grooming-palm-harbor" className="hover:text-white">Yorkie Grooming</a>
            {' | '}
            <a href="/shih-tzu-grooming-palm-harbor" className="hover:text-white">Shih Tzu Grooming</a>
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
