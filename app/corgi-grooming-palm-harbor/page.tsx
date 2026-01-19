'use client';

import { useState } from 'react';
import AppointmentPopup from '@/components/AppointmentPopup';

export default function CorgiGroomingPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Corgi Grooming - Palm Harbor FL",
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
    "description": "Professional Corgi grooming in Palm Harbor, FL. Expert deshedding and coat care for Pembroke and Cardigan Welsh Corgis at Pupperazi Pet Spa."
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
        <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">🦊</div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-900 mb-4">
              Corgi Grooming in Palm Harbor, FL
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-6">
              Expert Deshedding & Coat Care for Your Fluffy-Bottomed Companion — Pembroke & Cardigan Corgis
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <button
                onClick={() => setIsPopupOpen(true)}
                className="px-8 py-4 rounded-full text-lg font-semibold shadow-lg cursor-pointer"
                style={{backgroundColor: '#C8E5F0', color: '#2D5A87'}}
              >
                Book Corgi Grooming
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

        {/* Why Corgis Need Regular Grooming */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-6 text-center">
              Why Corgis Are Grooming Champions (in Shedding!)
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 mb-8">
              <p className="mb-4">
                If you own a Corgi, you already know: these adorable fluff balls shed like it's their job! Corgis have a thick double coat designed for Welsh weather, which means they "blow" their undercoat twice a year—and shed moderately year-round.
              </p>
              <p className="mb-4">
                At Pupperazi Pet Spa in Palm Harbor, we specialize in managing that famous Corgi fluff. Our deshedding treatments can dramatically reduce the tumbleweeds of fur in your home while keeping your Corgi's coat healthy and beautiful.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-3">🌊 Double Coat = Double Shedding</h3>
                <p className="text-gray-700">
                  Corgis have a weather-resistant outer coat and a dense, fluffy undercoat. This means lots of loose fur! Professional deshedding removes undercoat that home brushing misses.
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-3">☀️ Florida Heat Factor</h3>
                <p className="text-gray-700">
                  Palm Harbor's warm climate can make Corgis uncomfortable if their undercoat is too thick. Regular deshedding helps them regulate temperature without shaving (which we don't recommend!).
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-3">🍑 That Famous Corgi Butt</h3>
                <p className="text-gray-700">
                  The fluffy "Corgi butt" (or "Corgi sploot") is adorable but collects dirt and debris. We keep the pants area clean and trimmed while maintaining that signature floof.
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-3">⚠️ Never Shave a Corgi</h3>
                <p className="text-gray-700">
                  Their double coat protects from sun AND heat. Shaving damages the coat and can cause permanent texture changes. We deshed properly instead of shaving.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Our Corgi Grooming Services
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-purple-300">
                <div className="text-xs font-bold text-purple-600 mb-1">MOST POPULAR</div>
                <h3 className="text-2xl font-bold text-purple-800 mb-2">Full Corgi Deshedding Spa</h3>
                <p className="text-2xl font-bold text-purple-600 mb-4">$65-85</p>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Deshedding shampoo treatment</li>
                  <li>✓ High-velocity blow out (removes tons of undercoat!)</li>
                  <li>✓ Thorough brushout with deshedding tools</li>
                  <li>✓ Nail trim with dremel smoothing</li>
                  <li>✓ Ear cleaning</li>
                  <li>✓ Sanitary trim</li>
                  <li>✓ Paw pad cleanup</li>
                  <li>✓ Light pants/feathering trim</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-purple-800 mb-2">Corgi Bath & Brush</h3>
                <p className="text-2xl font-bold text-purple-600 mb-4">$50-65</p>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Deep cleansing bath</li>
                  <li>✓ Blow dry & brushout</li>
                  <li>✓ Nail trim</li>
                  <li>✓ Ear cleaning</li>
                  <li>✓ Sanitary trim</li>
                  <li>✓ Good maintenance between deshedding</li>
                </ul>
                <p className="text-sm text-gray-500 mt-4">*For regular maintenance when shedding is minimal</p>
              </div>
            </div>

            <div className="bg-amber-100 p-6 rounded-xl text-center">
              <h3 className="text-xl font-bold text-amber-900 mb-2">🦊 Fluffy Corgi? We've Got You!</h3>
              <p className="text-amber-800">
                Some Corgis have the "fluffy" gene with longer, softer coats. These pups need extra attention and may have slight additional charges for the extra brushing time. Their coats are gorgeous but mat-prone!
              </p>
            </div>
          </div>
        </section>

        {/* Pembroke vs Cardigan */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Pembroke vs Cardigan Welsh Corgis
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-orange-900 mb-3">🧡 Pembroke Welsh Corgi</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• The more common variety (Queen Elizabeth's favorite!)</li>
                  <li>• Usually no tail (or very short)</li>
                  <li>• Red, sable, fawn, or tri-color</li>
                  <li>• Slightly shorter coat than Cardigans</li>
                  <li>• Same shedding situation!</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-blue-900 mb-3">💙 Cardigan Welsh Corgi</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• The "original" Corgi with a tail</li>
                  <li>• Long, fluffy tail to groom</li>
                  <li>• More color varieties including brindle and blue merle</li>
                  <li>• Slightly longer coat</li>
                  <li>• Yes, they shed just as much!</li>
                </ul>
              </div>
            </div>
            <p className="text-center text-gray-600 mt-6">
              We groom both varieties with the same expert care—adjusting for coat length and tail maintenance as needed!
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Corgi Grooming FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  How often should I groom my Corgi?
                </summary>
                <p className="mt-4 text-gray-700">
                  We recommend professional grooming every 6-8 weeks year-round, with extra deshedding sessions during spring and fall "coat blow" seasons. At home, brush 2-3 times per week to manage shedding between appointments.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  Can you shave my Corgi to reduce shedding?
                </summary>
                <p className="mt-4 text-gray-700">
                  We strongly advise against shaving Corgis. Their double coat protects them from both heat AND cold, and shaving can permanently damage the coat texture. It can also lead to sunburn and overheating. Professional deshedding is the proper solution!
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  How much fur will come off during deshedding?
                </summary>
                <p className="mt-4 text-gray-700">
                  A LOT! It's not unusual to remove enough undercoat to stuff a small pillow, especially during shedding season. Our high-velocity dryers blast out loose undercoat that regular brushing misses. Many clients are amazed (and relieved!) by how much fur we remove.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  My Corgi has a "fluffy" coat. Is grooming different?
                </summary>
                <p className="mt-4 text-gray-700">
                  Fluffy Corgis (those with the long-hair gene) need extra care! Their softer, longer coats mat more easily and require more brushing time. We love fluffy Corgis and are experienced in keeping their coats tangle-free and gorgeous.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  Do you trim Corgi butts?
                </summary>
                <p className="mt-4 text-gray-700">
                  Yes! Those fluffy "Corgi pants" are adorable but can get messy. We do sanitary trims and neaten up the rear feathering while maintaining that signature Corgi silhouette. Your pup will still have an Instagram-worthy fluffy butt!
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-gradient-to-br from-orange-600 to-amber-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Tame the Corgi Fluff?
            </h2>
            <p className="text-xl mb-8">
              Professional deshedding that your vacuum cleaner will thank you for!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsPopupOpen(true)}
                className="px-8 py-4 rounded-full text-lg font-semibold shadow-lg cursor-pointer"
                style={{backgroundColor: '#C8E5F0', color: '#2D5A87'}}
              >
                Book Corgi Grooming
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
            <a href="/husky-grooming-palm-harbor" className="hover:text-white">Husky Grooming</a>
            {' | '}
            <a href="/golden-retriever-grooming-palm-harbor" className="hover:text-white">Golden Retriever Grooming</a>
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
