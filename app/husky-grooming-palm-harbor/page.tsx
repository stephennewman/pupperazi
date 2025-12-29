'use client';

import { useState } from 'react';
import AppointmentPopup from '@/components/AppointmentPopup';

export default function HuskyGroomingPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Husky Grooming & Deshedding - Palm Harbor FL",
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
    "description": "Professional Husky grooming and deshedding in Palm Harbor, FL. Expert double-coat care for Siberian Huskies at Pupperazi Pet Spa."
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
        <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-cyan-50 to-blue-100">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">🐺</div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-900 mb-4">
              Husky Grooming & Deshedding in Palm Harbor, FL
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-6">
              Expert Double-Coat Care for Your Siberian Husky
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <button
                onClick={() => setIsPopupOpen(true)}
                className="px-8 py-4 rounded-full text-lg font-semibold shadow-lg cursor-pointer"
                style={{backgroundColor: '#C8E5F0', color: '#2D5A87'}}
              >
                Book Husky Grooming
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

        {/* Husky Coat Care */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-6 text-center">
              Understanding Your Husky's Double Coat
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 mb-8">
              <p className="mb-4">
                Siberian Huskies have a thick double coat designed for extreme cold—which presents unique challenges in sunny Florida! Their dense undercoat and longer guard hairs require specialized grooming to keep them comfortable, healthy, and (relatively) fur-free around your home.
              </p>
              <p className="mb-4">
                At Pupperazi Pet Spa, we're experienced with Huskies and other double-coated breeds. We use proper techniques and tools to remove loose undercoat without damaging their coat—keeping your Husky cool and comfortable in Florida's heat.
              </p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-xl mb-8">
              <h3 className="text-xl font-bold text-red-900 mb-2">⚠️ NEVER Shave a Husky</h3>
              <p className="text-red-800">
                Shaving a Husky's double coat is dangerous and can cause permanent damage. Their coat actually insulates them from heat AND cold. Shaving exposes skin to sunburn, removes temperature regulation, and the coat may never grow back correctly. Proper deshedding is the safe solution!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-3">🌡️ Natural Temperature Control</h3>
                <p className="text-gray-700">
                  The double coat creates an air layer that insulates against both heat and cold. A well-maintained coat actually helps Huskies stay cooler in summer than a shaved one would!
                </p>
              </div>
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-3">💨 The "Blow" is Real</h3>
                <p className="text-gray-700">
                  Huskies "blow" their undercoat 1-2 times per year, shedding massive amounts of fur over several weeks. Professional deshedding during this time is essential to remove loose fur efficiently.
                </p>
              </div>
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-3">☀️ Florida Huskies Shed More</h3>
                <p className="text-gray-700">
                  Without cold winters, Florida Huskies often shed year-round instead of seasonally. Regular professional deshedding every 6-8 weeks keeps shedding manageable.
                </p>
              </div>
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-3">🧴 Skin Health Matters</h3>
                <p className="text-gray-700">
                  All that fur can hide skin issues. Professional grooming includes checking for hot spots, dry skin, and parasites that may be invisible under that thick coat.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Husky Grooming Services
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-purple-800 mb-2">Full Husky Groom</h3>
                <p className="text-2xl font-bold text-purple-600 mb-4">$75-95</p>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Deep cleansing bath</li>
                  <li>✓ Professional deshedding treatment</li>
                  <li>✓ High-velocity blow dry</li>
                  <li>✓ Thorough brushout (all layers)</li>
                  <li>✓ Sanitary trim</li>
                  <li>✓ Paw pad & hock trim</li>
                  <li>✓ Nail trim</li>
                  <li>✓ Ear cleaning</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-purple-800 mb-2">Husky Bath & Deshed</h3>
                <p className="text-2xl font-bold text-purple-600 mb-4">$60-80</p>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Full bath & conditioning</li>
                  <li>✓ High-velocity blow out</li>
                  <li>✓ Complete deshedding brushout</li>
                  <li>✓ Nail trim</li>
                  <li>✓ Ear cleaning</li>
                  <li>✓ Sanitary tidy</li>
                  <li>✓ Great for regular maintenance</li>
                </ul>
              </div>
            </div>

            <div className="bg-cyan-100 p-6 rounded-xl border-2 border-cyan-400">
              <div className="text-center">
                <div className="bg-cyan-600 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-2">
                  DURING COAT BLOW SEASON
                </div>
                <h3 className="text-2xl font-bold text-cyan-900 mb-2">Premium Deshedding Package</h3>
                <p className="text-xl font-bold text-cyan-700 mb-4">+$20-30</p>
                <p className="text-cyan-800">
                  Extra-thorough deshedding for when your Husky is blowing their coat. Includes additional brushing time, specialized deshedding tools, and conditioning treatment. Removes maximum loose undercoat—your vacuum will thank you!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Florida Husky Tips */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Keeping Your Husky Happy in Florida
            </h2>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl">
                <div className="text-3xl mb-3">☀️</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Heat Management</h3>
                <p className="text-gray-700 text-sm">
                  Exercise Huskies early morning or evening only. Provide constant access to cool water and shade. Consider a kiddie pool for cooling off. Air conditioning is a must during Florida summers.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl">
                <div className="text-3xl mb-3">🪥</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">At-Home Brushing</h3>
                <p className="text-gray-700 text-sm">
                  Brush your Husky 2-3 times per week with an undercoat rake and slicker brush. During coat blow, daily brushing helps. This maintains coat health between professional grooming.
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
                <div className="text-3xl mb-3">🏃</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Exercise Needs</h3>
                <p className="text-gray-700 text-sm">
                  Huskies need lots of exercise even in Florida! Indoor activities, swimming, and early/late outdoor time help burn energy. A tired Husky is a happy (and less destructive) Husky.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
                <div className="text-3xl mb-3">🏠</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Managing Indoor Fur</h3>
                <p className="text-gray-700 text-sm">
                  Regular professional deshedding dramatically reduces fur around your home. Between appointments, a robot vacuum and lint rollers are Husky parents' best friends!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Husky Grooming FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  How often should I groom my Husky?
                </summary>
                <p className="mt-4 text-gray-700">
                  We recommend professional grooming every 6-8 weeks for Huskies in Florida. During coat blow season (usually spring and fall, though Florida Huskies may shed year-round), you may want to come in every 4-6 weeks for extra deshedding. Regular grooming keeps the coat healthy and your home less furry!
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  Why can't I just shave my Husky for summer?
                </summary>
                <p className="mt-4 text-gray-700">
                  Shaving a Husky actually makes them HOTTER, not cooler! Their double coat creates an insulating air layer that protects from both heat and cold. Shaving removes this natural cooling system, exposes skin to sunburn, and the coat may grow back patchy or never regain its proper texture. Proper deshedding is the safe, effective solution.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  How long does Husky grooming take?
                </summary>
                <p className="mt-4 text-gray-700">
                  A full Husky groom typically takes 2.5-4 hours depending on coat condition. That thick double coat requires thorough drying and extensive brushing to remove all loose undercoat. We never rush—proper grooming takes time, and your Husky will be comfortable throughout the process.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  My Husky sheds constantly. Is this normal in Florida?
                </summary>
                <p className="mt-4 text-gray-700">
                  Yes! Huskies in Florida often shed year-round instead of just during seasonal coat blows. The consistent warm temperatures confuse their coat's natural cycle. Regular professional deshedding (every 6-8 weeks) and frequent at-home brushing help manage this constant shedding.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  Do you have experience with Husky temperaments?
                </summary>
                <p className="mt-4 text-gray-700">
                  Absolutely! We know Huskies can be dramatic, talkative, and opinionated about grooming. Our groomers are experienced with Husky personalities and know how to make the experience positive. We take breaks as needed, use positive reinforcement, and work with their energy rather than against it.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-gradient-to-br from-cyan-600 to-blue-700 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Keep Your Florida Husky Cool & Comfortable
            </h2>
            <p className="text-xl mb-8">
              Expert Husky grooming and deshedding in Palm Harbor. Book today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsPopupOpen(true)}
                className="px-8 py-4 rounded-full text-lg font-semibold shadow-lg cursor-pointer"
                style={{backgroundColor: '#C8E5F0', color: '#2D5A87'}}
              >
                Book Husky Grooming
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
            <a href="/golden-retriever-grooming-palm-harbor" className="hover:text-white">Golden Retriever Grooming</a>
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

