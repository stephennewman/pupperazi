'use client';

import { useState } from 'react';
import AppointmentPopup from '@/components/AppointmentPopup';

export default function GoldenRetrieverGroomingPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Golden Retriever Grooming - Palm Harbor FL",
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
    "description": "Professional Golden Retriever grooming and deshedding in Palm Harbor, FL. Expert double-coat care at Pupperazi Pet Spa."
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
        <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-yellow-50 to-amber-50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">🦮</div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-900 mb-4">
              Golden Retriever Grooming in Palm Harbor, FL
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-6">
              Expert Double-Coat Care, Deshedding & Bath Services for Your Golden
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <button
                onClick={() => setIsPopupOpen(true)}
                className="px-8 py-4 rounded-full text-lg font-semibold shadow-lg cursor-pointer"
                style={{backgroundColor: '#C8E5F0', color: '#2D5A87'}}
              >
                Book Golden Retriever Grooming
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

        {/* Golden Retriever Coat Care */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-6 text-center">
              Understanding Your Golden Retriever's Coat
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 mb-8">
              <p className="mb-4">
                Golden Retrievers have a beautiful double coat designed to protect them from water and weather. The outer coat is water-resistant and wavy, while the dense undercoat provides insulation. This gorgeous coat requires regular maintenance to keep your Golden healthy, comfortable, and looking their best.
              </p>
              <p className="mb-4">
                At Pupperazi Pet Spa, we specialize in Golden Retriever grooming with techniques specifically designed for double-coated breeds. Our experienced groomers understand how to properly care for your Golden's coat without damaging it.
              </p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-xl mb-8">
              <h3 className="text-xl font-bold text-red-900 mb-2">⚠️ Important: Never Shave a Golden Retriever</h3>
              <p className="text-red-800">
                Unlike single-coated breeds, shaving a Golden Retriever damages their coat permanently and removes their natural temperature regulation. Their double coat actually keeps them cool in summer and warm in winter. We use proper deshedding techniques instead.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-3">🌊 Water-Loving Dogs Need Extra Care</h3>
                <p className="text-gray-700">
                  Goldens love water! If your Golden swims frequently, regular grooming is essential to prevent matting, hot spots, and skin issues. We thoroughly dry and brush after every bath.
                </p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-3">🍂 Seasonal Shedding</h3>
                <p className="text-gray-700">
                  Golden Retrievers shed year-round but "blow" their undercoat twice yearly (spring and fall). Professional deshedding during these times removes loose fur and keeps your home cleaner.
                </p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-3">👂 Ear Health Matters</h3>
                <p className="text-gray-700">
                  Golden Retrievers are prone to ear infections due to their floppy ears that trap moisture. Every grooming includes thorough ear cleaning and inspection.
                </p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-3">✂️ Feathering Maintenance</h3>
                <p className="text-gray-700">
                  The beautiful feathering on legs, chest, and tail needs regular trimming to stay neat and prevent matting. We shape feathers while maintaining the natural Golden look.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Golden Retriever Grooming Services
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-purple-800 mb-2">Full Golden Groom</h3>
                <p className="text-2xl font-bold text-purple-600 mb-4">$65-85</p>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Deep cleansing bath</li>
                  <li>✓ Professional deshedding treatment</li>
                  <li>✓ High-velocity blow dry</li>
                  <li>✓ Thorough brushout</li>
                  <li>✓ Feather trimming (legs, chest, tail)</li>
                  <li>✓ Sanitary trim</li>
                  <li>✓ Nail trim & paw pad cleanup</li>
                  <li>✓ Ear cleaning</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-purple-800 mb-2">Golden Bath & Brush</h3>
                <p className="text-2xl font-bold text-purple-600 mb-4">$55-70</p>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Premium shampoo & conditioning</li>
                  <li>✓ High-velocity blow dry</li>
                  <li>✓ Full deshedding brushout</li>
                  <li>✓ Nail trim</li>
                  <li>✓ Ear cleaning</li>
                  <li>✓ Sanitary trim</li>
                  <li>✓ Perfect for maintaining coat between full grooms</li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-amber-400">
              <div className="text-center">
                <div className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-2">
                  POPULAR ADD-ON
                </div>
                <h3 className="text-2xl font-bold text-purple-800 mb-2">Premium Deshedding Treatment</h3>
                <p className="text-xl font-bold text-purple-600 mb-4">+$15-25</p>
                <p className="text-gray-700">
                  Extra deshedding with specialized tools and treatments to remove maximum loose undercoat. Recommended during seasonal coat changes (spring & fall) or for Goldens that shed heavily. Significantly reduces shedding at home for 4-6 weeks!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Florida-Specific Tips */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Golden Retriever Care Tips for Florida
            </h2>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl">
                <div className="text-3xl mb-3">☀️</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Managing Florida Heat</h3>
                <p className="text-gray-700 text-sm">
                  Keep your Golden's coat well-brushed to allow air circulation. A clean, mat-free coat actually helps regulate temperature better than a shaved one. Schedule outdoor time for early morning or evening.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl">
                <div className="text-3xl mb-3">🏖️</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Beach & Pool Days</h3>
                <p className="text-gray-700 text-sm">
                  Rinse your Golden with fresh water after swimming in salt water or chlorine. Sand and salt can irritate skin if left in the coat. Schedule grooming more frequently during swimming season.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl">
                <div className="text-3xl mb-3">🦟</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Flea Prevention</h3>
                <p className="text-gray-700 text-sm">
                  Florida's warm climate means fleas are year-round. Keep your Golden on flea prevention and watch for signs of skin irritation. Regular grooming helps us spot any issues early.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl">
                <div className="text-3xl mb-3">💧</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Hot Spots & Humidity</h3>
                <p className="text-gray-700 text-sm">
                  Florida's humidity can cause hot spots, especially under that dense undercoat. Regular deshedding and keeping the coat dry prevents moisture from getting trapped against skin.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Golden Retriever Grooming FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  How often should I groom my Golden Retriever?
                </summary>
                <p className="mt-4 text-gray-700">
                  We recommend professional grooming every 8-10 weeks for Golden Retrievers. During shedding season (spring and fall), you may want to come in more frequently for deshedding treatments. At home, brush your Golden 2-3 times per week to prevent matting and manage shedding.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  Can you help with my Golden's shedding problem?
                </summary>
                <p className="mt-4 text-gray-700">
                  Absolutely! Our deshedding treatment removes a significant amount of loose undercoat, reducing shedding at home for 4-6 weeks. We use high-velocity dryers and specialized deshedding tools to remove loose fur that regular brushing misses. Many Golden owners schedule deshedding appointments monthly during peak shedding season.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  Why shouldn't I shave my Golden Retriever in summer?
                </summary>
                <p className="mt-4 text-gray-700">
                  Golden Retrievers have a double coat that provides natural insulation—keeping them cool in summer AND warm in winter. Shaving removes this natural temperature regulation and exposes skin to sunburn. The coat may also grow back differently (patchy, different texture). Instead, we use proper deshedding techniques to thin the undercoat while keeping the protective outer coat intact.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  How long does Golden Retriever grooming take?
                </summary>
                <p className="mt-4 text-gray-700">
                  A full Golden Retriever groom typically takes 2-3 hours. Goldens have thick coats that require thorough drying and brushing. We never rush—proper grooming takes time, and your Golden will be relaxed and comfortable throughout the process.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  My Golden loves to swim. How does this affect grooming?
                </summary>
                <p className="mt-4 text-gray-700">
                  Water-loving Goldens need more frequent grooming! Swimming (especially in salt water or chlorinated pools) can dry out the coat and skin. We recommend rinsing with fresh water after every swim and scheduling grooming appointments every 6-8 weeks during swimming season. We'll use conditioning treatments to keep the coat healthy and water-resistant.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Keep Your Golden Looking & Feeling Their Best
            </h2>
            <p className="text-xl mb-8">
              Expert Golden Retriever grooming in Palm Harbor since 2011. Book today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsPopupOpen(true)}
                className="px-8 py-4 rounded-full text-lg font-semibold shadow-lg cursor-pointer"
                style={{backgroundColor: '#C8E5F0', color: '#2D5A87'}}
              >
                Book Golden Retriever Grooming
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
            <a href="/dog-grooming-palm-harbor-fl" className="hover:text-white">Dog Grooming Palm Harbor</a>
            {' | '}
            <a href="/goldendoodle-grooming-palm-harbor" className="hover:text-white">Goldendoodle Grooming</a>
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

