'use client';

import { useState } from 'react';
import AppointmentPopup from '@/components/AppointmentPopup';

export default function GoldendoodleGroomingPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Goldendoodle Grooming - Palm Harbor FL",
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
    "description": "Expert Goldendoodle grooming in Palm Harbor, FL. Specialized doodle coat care, dematting, and styling at Pupperazi Pet Spa."
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
            <div className="text-6xl mb-4">🐕‍🦺</div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-900 mb-4">
              Goldendoodle Grooming in Palm Harbor, FL
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-6">
              Expert Doodle Coat Care by Experienced Groomers Who Love Your Curly Pup
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <button
                onClick={() => setIsPopupOpen(true)}
                className="px-8 py-4 rounded-full text-lg font-semibold shadow-lg cursor-pointer"
                style={{backgroundColor: '#C8E5F0', color: '#2D5A87'}}
              >
                Book Goldendoodle Grooming
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

        {/* Why Doodles Need Special Care */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-6 text-center">
              Why Goldendoodles Need Specialized Grooming
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 mb-8">
              <p className="mb-4">
                Goldendoodles have a unique coat that combines the best (and most challenging) traits of Golden Retrievers and Poodles. Their wavy to curly fur looks adorable but requires regular, specialized grooming to prevent matting, skin issues, and discomfort.
              </p>
              <p className="mb-4">
                At Pupperazi Pet Spa in Palm Harbor, we've groomed hundreds of Goldendoodles and understand exactly what these lovable dogs need. Whether your doodle has a wavy fleece coat, tight curls, or a straighter coat, we tailor our grooming approach to their specific fur type.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-3">🔄 Regular Grooming is Essential</h3>
                <p className="text-gray-700">
                  Goldendoodles should be groomed every 6-8 weeks to prevent matting. Their undercoat traps loose fur that doesn't shed naturally, leading to tangles close to the skin that can cause pain and skin irritation.
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-3">✂️ Professional Dematting</h3>
                <p className="text-gray-700">
                  We use gentle dematting techniques to work through tangles without hurting your doodle. For severely matted coats, we'll discuss humane options that prioritize your dog's comfort over aesthetics.
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-3">🛁 Proper Bathing & Drying</h3>
                <p className="text-gray-700">
                  Doodle coats must be completely dried and brushed after bathing—air drying leads to matting. We use high-velocity dryers and thorough brushing to keep coats fluffy and tangle-free.
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-3">🎨 Custom Styling Options</h3>
                <p className="text-gray-700">
                  From the classic "teddy bear cut" to longer, flowing styles, we customize your Goldendoodle's look based on your preferences and lifestyle. Active outdoor dogs may benefit from shorter cuts for easier maintenance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Goldendoodle Grooming Services */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Our Goldendoodle Grooming Services
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-purple-800 mb-2">Full Doodle Groom</h3>
                <p className="text-2xl font-bold text-purple-600 mb-4">$85-125</p>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Full bath with doodle-appropriate shampoo</li>
                  <li>✓ Complete blow dry & brushout</li>
                  <li>✓ Full body haircut (your choice of style)</li>
                  <li>✓ Face, ears, and sanitary trim</li>
                  <li>✓ Nail trim & paw pad cleanup</li>
                  <li>✓ Ear cleaning</li>
                  <li>✓ Light dematting included</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-purple-800 mb-2">Doodle Bath & Brush</h3>
                <p className="text-2xl font-bold text-purple-600 mb-4">$55-75</p>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Deep cleansing bath</li>
                  <li>✓ Thorough blow dry</li>
                  <li>✓ Full body brushout & dematting</li>
                  <li>✓ Nail trim</li>
                  <li>✓ Ear cleaning</li>
                  <li>✓ Sanitary trim</li>
                  <li>✓ Perfect between full grooms</li>
                </ul>
              </div>
            </div>

            <div className="bg-amber-100 p-6 rounded-xl text-center">
              <h3 className="text-xl font-bold text-amber-900 mb-2">💡 Pro Tip for Doodle Parents</h3>
              <p className="text-amber-800">
                Brush your Goldendoodle at home 2-3 times per week between grooming appointments. Focus on areas prone to matting: behind ears, under legs, and around the collar area. This keeps their coat healthy and reduces grooming time (and cost!).
              </p>
            </div>
          </div>
        </section>

        {/* Popular Doodle Cuts */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Popular Goldendoodle Haircut Styles
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl text-center">
                <div className="text-4xl mb-3">🧸</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Teddy Bear Cut</h3>
                <p className="text-gray-700 text-sm">
                  The most popular doodle style! Uniform length all over (usually 1-2 inches) with a rounded face that looks like a stuffed animal.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl text-center">
                <div className="text-4xl mb-3">🦁</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Lion Cut</h3>
                <p className="text-gray-700 text-sm">
                  Shorter body with a fluffy "mane" around the head and chest. Great for active dogs who love to play outdoors.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl text-center">
                <div className="text-4xl mb-3">✨</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Puppy Cut</h3>
                <p className="text-gray-700 text-sm">
                  Even length all over (typically 1 inch), giving your doodle that adorable puppy look regardless of age. Low maintenance!
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl text-center">
                <div className="text-4xl mb-3">☀️</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Summer Cut</h3>
                <p className="text-gray-700 text-sm">
                  Short all over (1/2 inch or less) to keep cool in Florida's heat. Perfect for swimming doodles!
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl text-center">
                <div className="text-4xl mb-3">🌊</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Natural/Shaggy</h3>
                <p className="text-gray-700 text-sm">
                  Longer, flowing coat (2-3 inches) for that effortlessly fluffy look. Requires more at-home brushing.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl text-center">
                <div className="text-4xl mb-3">🎀</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Custom Style</h3>
                <p className="text-gray-700 text-sm">
                  Have something specific in mind? Bring a photo! We love creating custom looks for your unique doodle.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Goldendoodle Grooming FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  How often should I groom my Goldendoodle?
                </summary>
                <p className="mt-4 text-gray-700">
                  We recommend professional grooming every 6-8 weeks for Goldendoodles. Their coats grow continuously and mat easily, especially in Florida's humidity. Regular grooming prevents painful matting and keeps skin healthy. Between appointments, brush at home 2-3 times per week.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  My Goldendoodle is matted. Can you save the coat?
                </summary>
                <p className="mt-4 text-gray-700">
                  It depends on the severity. Light to moderate matting can often be worked out with patience. However, if mats are tight to the skin, attempting to brush them out causes pain and skin damage. In these cases, we recommend a "fresh start" with a shorter cut. Your dog's comfort always comes first—we'll discuss options before proceeding.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  How long does Goldendoodle grooming take?
                </summary>
                <p className="mt-4 text-gray-700">
                  A full Goldendoodle groom typically takes 2.5-4 hours depending on size, coat condition, and style requested. We don't rush! Proper drying and brushing takes time, and we want your doodle to have a stress-free experience. We'll call you when they're ready.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  Do Goldendoodles shed? Are they hypoallergenic?
                </summary>
                <p className="mt-4 text-gray-700">
                  Goldendoodles shed less than Golden Retrievers but are not truly hypoallergenic. Their loose fur gets trapped in their curly coat instead of falling out, which is why regular brushing and grooming is essential. Without it, trapped fur mats close to the skin.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  What's the best brush for Goldendoodles at home?
                </summary>
                <p className="mt-4 text-gray-700">
                  We recommend a slicker brush and a metal comb. Use the slicker brush first to work through the coat, then follow with the comb to check for any remaining tangles. Brush all the way down to the skin, not just the top layer. Pay special attention to behind ears, under legs, and where collar/harness sits.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Give Your Goldendoodle the Expert Care They Deserve
            </h2>
            <p className="text-xl mb-8">
              Palm Harbor's trusted doodle groomers since 2011. Book your appointment today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsPopupOpen(true)}
                className="px-8 py-4 rounded-full text-lg font-semibold shadow-lg cursor-pointer"
                style={{backgroundColor: '#C8E5F0', color: '#2D5A87'}}
              >
                Book Goldendoodle Grooming
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


