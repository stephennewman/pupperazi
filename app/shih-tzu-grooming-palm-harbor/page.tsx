'use client';

import { useState } from 'react';
import AppointmentPopup from '@/components/AppointmentPopup';

export default function ShihTzuGroomingPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Shih Tzu Grooming - Palm Harbor FL",
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
    "description": "Professional Shih Tzu grooming in Palm Harbor, FL. Expert small breed grooming, puppy cuts, teddy bear cuts, and more at Pupperazi Pet Spa."
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
        <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-pink-50 to-purple-50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">🐕</div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-900 mb-4">
              Shih Tzu Grooming in Palm Harbor, FL
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-6">
              Gentle, Patient Care for Your Little Lion Dog
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <button
                onClick={() => setIsPopupOpen(true)}
                className="px-8 py-4 rounded-full text-lg font-semibold shadow-lg cursor-pointer"
                style={{backgroundColor: '#C8E5F0', color: '#2D5A87'}}
              >
                Book Shih Tzu Grooming
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

        {/* Shih Tzu Care */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-6 text-center">
              Why Shih Tzus Need Regular Professional Grooming
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 mb-8">
              <p className="mb-4">
                Shih Tzus are adorable companions with a luxurious double coat that requires dedicated care. Originally bred as companion dogs for Chinese royalty, these "little lion dogs" have coats that grow continuously and can become matted quickly without proper maintenance.
              </p>
              <p className="mb-4">
                At Pupperazi Pet Spa, we understand that Shih Tzus can be sensitive to grooming. Our patient, gentle approach makes even nervous pups feel comfortable. We take our time and never rush—your Shih Tzu's comfort is our priority.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-3">👀 Eye Care is Essential</h3>
                <p className="text-gray-700">
                  Shih Tzus' prominent eyes are prone to irritation from hair and tear staining. We carefully trim around eyes and clean tear stains to keep your pup comfortable and looking their best.
                </p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-3">🎀 Coat That Keeps Growing</h3>
                <p className="text-gray-700">
                  Unlike shedding breeds, Shih Tzu hair grows continuously like human hair. Without regular grooming, it becomes long, tangled, and matted. Most owners prefer a practical "puppy cut" for easier maintenance.
                </p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-3">👂 Ear Health</h3>
                <p className="text-gray-700">
                  Shih Tzus have hair that grows inside their ear canals, trapping moisture and debris. We clean ears and remove excess hair to prevent infections—especially important in Florida's humid climate.
                </p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-3">🐾 Paw & Pad Care</h3>
                <p className="text-gray-700">
                  Hair grows between Shih Tzu paw pads and can cause slipping on smooth floors. We trim paw pads and shape feet for both safety and a neat appearance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Shih Tzu Grooming Services & Pricing
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-purple-800 mb-2">Full Shih Tzu Groom</h3>
                <p className="text-2xl font-bold text-purple-600 mb-4">$55-75</p>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Bath with gentle, hypoallergenic shampoo</li>
                  <li>✓ Blow dry & brushout</li>
                  <li>✓ Full body haircut (your choice of style)</li>
                  <li>✓ Face trim & eye area cleanup</li>
                  <li>✓ Ear cleaning & hair removal</li>
                  <li>✓ Nail trim & paw pad cleanup</li>
                  <li>✓ Sanitary trim</li>
                  <li>✓ Tear stain treatment</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-purple-800 mb-2">Shih Tzu Bath & Tidy</h3>
                <p className="text-2xl font-bold text-purple-600 mb-4">$40-55</p>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Full bath & conditioning</li>
                  <li>✓ Blow dry & brushout</li>
                  <li>✓ Face trim & eye cleanup</li>
                  <li>✓ Nail trim</li>
                  <li>✓ Ear cleaning</li>
                  <li>✓ Sanitary trim</li>
                  <li>✓ Paw pad trim</li>
                  <li>✓ Great between full grooms</li>
                </ul>
              </div>
            </div>

            <div className="bg-pink-100 p-6 rounded-xl text-center">
              <h3 className="text-xl font-bold text-pink-900 mb-2">💝 Puppy's First Groom Special</h3>
              <p className="text-pink-800">
                Is this your Shih Tzu puppy's first professional grooming experience? We offer gentle introduction grooming for puppies to help them build positive associations with being groomed. Ask about our puppy grooming package!
              </p>
            </div>
          </div>
        </section>

        {/* Popular Cuts */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Popular Shih Tzu Haircut Styles
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-xl text-center">
                <div className="text-4xl mb-3">🐶</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Puppy Cut</h3>
                <p className="text-gray-700 text-sm">
                  The most popular choice! Even length all over (1-2 inches), rounded face, and easy to maintain. Perfect for Florida's heat and active pups.
                </p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-xl text-center">
                <div className="text-4xl mb-3">🧸</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Teddy Bear Cut</h3>
                <p className="text-gray-700 text-sm">
                  Slightly longer and fluffier than puppy cut with a rounded face that looks like a stuffed teddy bear. Adorable and photogenic!
                </p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-xl text-center">
                <div className="text-4xl mb-3">👑</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Top Knot Style</h3>
                <p className="text-gray-700 text-sm">
                  Keeps long hair on top of the head tied up in a bow or ponytail. Traditional Shih Tzu look while keeping hair out of eyes.
                </p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-xl text-center">
                <div className="text-4xl mb-3">✂️</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Short Summer Cut</h3>
                <p className="text-gray-700 text-sm">
                  Extra short (1/2 inch) for maximum comfort in Florida heat. Less brushing required at home. Body stays cool!
                </p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-xl text-center">
                <div className="text-4xl mb-3">🦁</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Lion Cut</h3>
                <p className="text-gray-700 text-sm">
                  Short body with a fluffy "mane" around the head and pom-pom tail. A fun, unique look that honors the Shih Tzu's "little lion" heritage!
                </p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-xl text-center">
                <div className="text-4xl mb-3">🌺</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Show/Long Coat</h3>
                <p className="text-gray-700 text-sm">
                  Traditional floor-length coat for show dogs or dedicated owners. Requires daily brushing and frequent professional grooming.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Shih Tzu Grooming FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  How often should I groom my Shih Tzu?
                </summary>
                <p className="mt-4 text-gray-700">
                  We recommend professional grooming every 4-6 weeks for Shih Tzus. Their coat grows continuously and mats easily. If you keep your Shih Tzu in a longer style, you may need grooming every 3-4 weeks. Shorter cuts can stretch to 6-8 weeks between appointments.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  My Shih Tzu hates being groomed. Can you help?
                </summary>
                <p className="mt-4 text-gray-700">
                  Absolutely! Many Shih Tzus are sensitive to grooming, especially around their face. Our groomers are experienced with nervous small dogs and use a patient, gentle approach. We take frequent breaks, use positive reinforcement, and never force a scared dog. Your Shih Tzu's comfort always comes first.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  How do I reduce tear staining on my Shih Tzu?
                </summary>
                <p className="mt-4 text-gray-700">
                  Tear staining is common in Shih Tzus due to their prominent eyes and facial structure. We clean tear stains during every grooming session. At home, wipe around the eyes daily with a damp cloth. Some staining can also be diet-related—filtered water and quality food may help. Keeping facial hair trimmed short reduces moisture buildup.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  What's the best at-home brush for Shih Tzus?
                </summary>
                <p className="mt-4 text-gray-700">
                  For Shih Tzus, we recommend a pin brush for daily brushing and a fine-toothed comb to check for tangles. Brush all the way down to the skin, not just the top layer. Focus on areas that mat easily: behind ears, armpits, and under the chin. Brushing 3-4 times per week prevents matting between appointments.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  How long does Shih Tzu grooming take?
                </summary>
                <p className="mt-4 text-gray-700">
                  A full Shih Tzu groom typically takes 1.5-2.5 hours depending on coat condition and style. We don't rush small dogs—they need extra patience and gentleness. We'll call or text you when your pup is ready for pickup.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Give Your Little Lion the Royal Treatment
            </h2>
            <p className="text-xl mb-8">
              Gentle, patient Shih Tzu grooming in Palm Harbor. Book today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsPopupOpen(true)}
                className="px-8 py-4 rounded-full text-lg font-semibold shadow-lg cursor-pointer"
                style={{backgroundColor: '#C8E5F0', color: '#2D5A87'}}
              >
                Book Shih Tzu Grooming
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
            <a href="/yorkie-grooming-palm-harbor" className="hover:text-white">Yorkie Grooming</a>
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

