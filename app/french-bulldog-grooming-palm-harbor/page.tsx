'use client';

import { useState } from 'react';
import AppointmentPopup from '@/components/AppointmentPopup';

export default function FrenchBulldogGroomingPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "French Bulldog Grooming - Palm Harbor FL",
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
    "description": "Professional French Bulldog grooming in Palm Harbor, FL. Expert Frenchie care with sensitive skin treatments at Pupperazi Pet Spa."
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
        <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-slate-50 to-gray-100">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">🐕</div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-900 mb-4">
              French Bulldog Grooming in Palm Harbor, FL
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-6">
              Gentle Care for Your Frenchie's Sensitive Skin & Unique Needs
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <button
                onClick={() => setIsPopupOpen(true)}
                className="px-8 py-4 rounded-full text-lg font-semibold shadow-lg cursor-pointer"
                style={{backgroundColor: '#C8E5F0', color: '#2D5A87'}}
              >
                Book Frenchie Grooming
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

        {/* Frenchie Care */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-6 text-center">
              Why French Bulldogs Need Special Grooming Care
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 mb-8">
              <p className="mb-4">
                French Bulldogs may have short coats, but they have unique grooming needs that require special attention. Their adorable wrinkles, sensitive skin, and compact bodies mean they benefit greatly from professional grooming tailored to their breed.
              </p>
              <p className="mb-4">
                At Pupperazi Pet Spa, we understand Frenchies inside and out. We use gentle, hypoallergenic products and take extra care with their facial folds, ears, and sensitive skin. Your Frenchie will leave clean, comfortable, and smelling amazing!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-slate-50 to-gray-100 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-3">🔄 Wrinkle Care is Critical</h3>
                <p className="text-gray-700">
                  Frenchie facial folds trap moisture, dirt, and bacteria—leading to skin infections and that "Frito feet" smell. We thoroughly clean and dry all wrinkles to keep your pup healthy and fresh.
                </p>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-gray-100 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-3">🌡️ Heat Sensitivity</h3>
                <p className="text-gray-700">
                  Frenchies overheat easily, especially in Florida. We keep our grooming environment cool, take breaks as needed, and never use hot dryers. Your Frenchie's safety is our priority.
                </p>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-gray-100 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-3">🧴 Sensitive Skin Care</h3>
                <p className="text-gray-700">
                  Many French Bulldogs have allergies and skin sensitivities. We offer hypoallergenic and medicated shampoo options to keep skin healthy without irritation.
                </p>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-gray-100 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-3">👂 Ear Health</h3>
                <p className="text-gray-700">
                  Those adorable bat ears can trap dirt and moisture. We clean ears thoroughly at every appointment and check for signs of infection—common in this breed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              French Bulldog Grooming Services
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-purple-800 mb-2">Frenchie Full Spa</h3>
                <p className="text-2xl font-bold text-purple-600 mb-4">$45-55</p>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Gentle bath with hypoallergenic shampoo</li>
                  <li>✓ Thorough wrinkle cleaning & drying</li>
                  <li>✓ Ear cleaning</li>
                  <li>✓ Nail trim & dremel smooth</li>
                  <li>✓ Paw pad conditioning</li>
                  <li>✓ Deshedding brushout</li>
                  <li>✓ Sanitary trim</li>
                  <li>✓ Nose butter application</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-purple-800 mb-2">Frenchie Quick Wash</h3>
                <p className="text-2xl font-bold text-purple-600 mb-4">$25-35</p>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Bath with gentle shampoo</li>
                  <li>✓ Wrinkle cleaning</li>
                  <li>✓ Towel dry (low-stress)</li>
                  <li>✓ Nail trim</li>
                  <li>✓ Ear wipe</li>
                  <li>✓ Great for regular maintenance</li>
                  <li>✓ Perfect for nervous Frenchies</li>
                </ul>
              </div>
            </div>

            <div className="bg-amber-100 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-amber-900 mb-3 text-center">🌿 Sensitive Skin Add-Ons</h3>
              <div className="grid sm:grid-cols-3 gap-4 text-center">
                <div className="bg-white p-4 rounded-lg">
                  <p className="font-semibold text-purple-900">Medicated Shampoo</p>
                  <p className="text-sm text-gray-600">For allergies & hot spots</p>
                  <p className="text-purple-600 font-bold">+$5-10</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="font-semibold text-purple-900">Oatmeal Treatment</p>
                  <p className="text-sm text-gray-600">Soothes itchy skin</p>
                  <p className="text-purple-600 font-bold">+$5</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="font-semibold text-purple-900">Moisturizing Conditioner</p>
                  <p className="text-sm text-gray-600">For dry, flaky skin</p>
                  <p className="text-purple-600 font-bold">+$5</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Frenchie-Specific Tips */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              French Bulldog Care Tips for Florida
            </h2>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-xl">
                <div className="text-3xl mb-3">☀️</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Beat the Heat</h3>
                <p className="text-gray-700 text-sm">
                  Frenchies are extremely heat-sensitive. Limit outdoor time to early morning and evening. Always have water available. Consider a cooling vest or mat for walks.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl">
                <div className="text-3xl mb-3">💧</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Daily Wrinkle Wipes</h3>
                <p className="text-gray-700 text-sm">
                  Wipe facial folds daily with a damp cloth or pet-safe wipe, then dry thoroughly. This prevents yeast infections and that sour smell between grooming appointments.
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
                <div className="text-3xl mb-3">🍖</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Diet Affects Skin</h3>
                <p className="text-gray-700 text-sm">
                  Many Frenchie skin issues are diet-related. Consider a limited-ingredient or grain-free diet if your pup has allergies. Healthy diet = healthy skin & coat.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
                <div className="text-3xl mb-3">🏊</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Water Safety</h3>
                <p className="text-gray-700 text-sm">
                  Frenchies can't swim due to their body structure! Never leave near pools unsupervised. If bathing at home, keep water shallow and support them at all times.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              French Bulldog Grooming FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  How often should I groom my French Bulldog?
                </summary>
                <p className="mt-4 text-gray-700">
                  We recommend professional grooming every 4-6 weeks for French Bulldogs. Even though they have short coats, their wrinkles need regular deep cleaning, and they shed more than many people expect. Between appointments, wipe wrinkles daily and brush weekly to manage shedding.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  My Frenchie has very sensitive skin. What products do you use?
                </summary>
                <p className="mt-4 text-gray-700">
                  We use gentle, hypoallergenic shampoos as our default for French Bulldogs. For pups with allergies or skin conditions, we offer medicated shampoos, oatmeal treatments, and moisturizing conditioners. Let us know about any skin issues when booking, and we'll customize the grooming for your Frenchie's needs.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  Do French Bulldogs shed a lot?
                </summary>
                <p className="mt-4 text-gray-700">
                  Yes! Despite their short coat, Frenchies are moderate to heavy shedders. They have a fine undercoat that releases hair year-round, with heavier shedding in spring and fall. Regular brushing at home and professional deshedding treatments can significantly reduce loose hair.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  How do you keep my Frenchie cool during grooming?
                </summary>
                <p className="mt-4 text-gray-700">
                  Safety is our top priority! Our grooming area is air-conditioned, and we take breaks as needed. We use low-heat or cool air for drying and never rush a Frenchie. If your pup shows any signs of overheating, we stop immediately. We also schedule Frenchies during cooler parts of the day when possible.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  Why does my Frenchie's face smell?
                </summary>
                <p className="mt-4 text-gray-700">
                  That distinctive "Frenchie smell" usually comes from yeast or bacteria growing in facial wrinkles. Moisture gets trapped in those adorable folds, creating a perfect environment for odor-causing microbes. Daily wrinkle cleaning at home and regular professional grooming keeps the smell at bay. If the smell persists or worsens, consult your vet—it could be an infection.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-600 to-slate-700 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Give Your Frenchie the Gentle Care They Deserve
            </h2>
            <p className="text-xl mb-8">
              Expert French Bulldog grooming in Palm Harbor. Book today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsPopupOpen(true)}
                className="px-8 py-4 rounded-full text-lg font-semibold shadow-lg cursor-pointer"
                style={{backgroundColor: '#C8E5F0', color: '#2D5A87'}}
              >
                Book Frenchie Grooming
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
            <a href="/husky-grooming-palm-harbor" className="hover:text-white">Husky Grooming</a>
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

