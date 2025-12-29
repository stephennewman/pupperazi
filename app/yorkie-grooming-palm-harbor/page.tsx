'use client';

import { useState } from 'react';
import AppointmentPopup from '@/components/AppointmentPopup';

export default function YorkieGroomingPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Yorkie Grooming - Palm Harbor FL",
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
    "description": "Professional Yorkshire Terrier grooming in Palm Harbor, FL. Expert small breed grooming for Yorkies at Pupperazi Pet Spa."
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
        <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-blue-50 to-slate-50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">🎀</div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-900 mb-4">
              Yorkie Grooming in Palm Harbor, FL
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-6">
              Expert Yorkshire Terrier Grooming by Groomers Who Understand Small Dogs
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <button
                onClick={() => setIsPopupOpen(true)}
                className="px-8 py-4 rounded-full text-lg font-semibold shadow-lg cursor-pointer"
                style={{backgroundColor: '#C8E5F0', color: '#2D5A87'}}
              >
                Book Yorkie Grooming
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

        {/* Yorkie Care */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-6 text-center">
              Why Yorkies Need Specialized Grooming
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 mb-8">
              <p className="mb-4">
                Yorkshire Terriers have a beautiful silky coat that's more similar to human hair than typical dog fur. This unique coat requires regular professional grooming to stay healthy, tangle-free, and looking their elegant best.
              </p>
              <p className="mb-4">
                At Pupperazi Pet Spa, we have extensive experience grooming Yorkies of all temperaments. We understand that these tiny dogs have big personalities—and sometimes big grooming anxieties. Our gentle, patient approach helps even the most nervous Yorkie feel comfortable.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-3">✨ Silky Single Coat</h3>
                <p className="text-gray-700">
                  Unlike double-coated breeds, Yorkies have a single coat of fine, silky hair. This means less shedding but requires regular brushing and professional grooming to prevent painful matting.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-3">🦷 Dental & Face Care</h3>
                <p className="text-gray-700">
                  Yorkies are prone to dental issues, and facial hair can trap food and bacteria. We carefully trim around the mouth and can add teeth brushing to keep your pup healthy.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-3">👀 Eye Area Attention</h3>
                <p className="text-gray-700">
                  Yorkie hair can irritate sensitive eyes. We carefully trim around the eyes and clean any tear staining, keeping your pup comfortable and looking bright-eyed.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-3">💪 Small But Mighty</h3>
                <p className="text-gray-700">
                  Yorkies may be small, but they have strong personalities! Our groomers are experienced with feisty terrier temperaments and know how to handle even the sassiest Yorkies with patience and care.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Yorkie Grooming Services & Pricing
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-purple-800 mb-2">Full Yorkie Groom</h3>
                <p className="text-2xl font-bold text-purple-600 mb-4">$50-70</p>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Bath with silk-enhancing shampoo</li>
                  <li>✓ Blow dry & brushout</li>
                  <li>✓ Full body haircut (your style choice)</li>
                  <li>✓ Face trim & topknot styling</li>
                  <li>✓ Ear cleaning & hair trimming</li>
                  <li>✓ Nail trim & paw cleanup</li>
                  <li>✓ Sanitary trim</li>
                  <li>✓ Bow or bandana included!</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-purple-800 mb-2">Yorkie Bath & Tidy</h3>
                <p className="text-2xl font-bold text-purple-600 mb-4">$35-50</p>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Full bath & conditioning</li>
                  <li>✓ Blow dry & silk brushout</li>
                  <li>✓ Face trim & eye cleanup</li>
                  <li>✓ Nail trim</li>
                  <li>✓ Ear cleaning</li>
                  <li>✓ Sanitary trim</li>
                  <li>✓ Paw pad trim</li>
                  <li>✓ Perfect between full grooms</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-100 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-blue-900 mb-3 text-center">Popular Add-Ons for Yorkies</h3>
              <div className="grid sm:grid-cols-3 gap-4 text-center">
                <div className="bg-white p-3 rounded-lg">
                  <p className="font-semibold text-purple-900">Teeth Brushing</p>
                  <p className="text-purple-600">$5</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="font-semibold text-purple-900">Nail Dremel</p>
                  <p className="text-purple-600">+$8</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="font-semibold text-purple-900">De-matting</p>
                  <p className="text-purple-600">$10-20</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Cuts */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Popular Yorkie Haircut Styles
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl text-center">
                <div className="text-4xl mb-3">🐶</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Puppy Cut</h3>
                <p className="text-gray-700 text-sm">
                  Most popular choice! Even length all over (1-2 inches), rounded face, and easy to maintain at home. Perfect for active Yorkies.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl text-center">
                <div className="text-4xl mb-3">🧸</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Teddy Bear Cut</h3>
                <p className="text-gray-700 text-sm">
                  Fluffy, rounded face with slightly longer body hair. Makes your Yorkie look like an adorable stuffed animal!
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl text-center">
                <div className="text-4xl mb-3">✨</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Schnauzer Cut</h3>
                <p className="text-gray-700 text-sm">
                  Short body with longer "skirt" on legs and a distinctive beard. A fun, unique look for your Yorkie!
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl text-center">
                <div className="text-4xl mb-3">👑</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Show Cut / Long Coat</h3>
                <p className="text-gray-700 text-sm">
                  Traditional floor-length silky coat with topknot. Requires daily brushing and frequent grooming. Elegant and classic!
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl text-center">
                <div className="text-4xl mb-3">☀️</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Summer/Short Cut</h3>
                <p className="text-gray-700 text-sm">
                  Extra short all over for Florida heat. Minimal brushing required. Keeps your Yorkie cool and comfortable!
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl text-center">
                <div className="text-4xl mb-3">🎀</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Westie Cut</h3>
                <p className="text-gray-700 text-sm">
                  Rounded head, short body, and fluffy legs. A cute variation that shows off your Yorkie's playful personality.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Yorkie Grooming FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  How often should I groom my Yorkie?
                </summary>
                <p className="mt-4 text-gray-700">
                  We recommend professional grooming every 4-6 weeks for Yorkies. Their silky hair mats easily and grows continuously. If you keep a longer coat, you may need grooming every 3-4 weeks. Short cuts can stretch to 6-8 weeks. At home, brush daily or every other day to prevent tangles.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  My Yorkie is very nervous. Can you help?
                </summary>
                <p className="mt-4 text-gray-700">
                  Absolutely! We specialize in anxious small dogs. Our groomers use a gentle, patient approach with lots of breaks and positive reinforcement. We never rush or force a scared dog. Many nervous Yorkies eventually come to enjoy their grooming appointments with us—it just takes time and trust.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  Do Yorkies shed?
                </summary>
                <p className="mt-4 text-gray-700">
                  Yorkies are considered a low-shedding breed because they have hair similar to humans rather than typical dog fur. They don't "blow" their coat like double-coated breeds. However, their hair does fall out gradually (like human hair), and regular brushing removes loose strands before they mat into the coat.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  Why is my Yorkie's coat changing color?
                </summary>
                <p className="mt-4 text-gray-700">
                  Yorkie coats naturally lighten as they age! Puppies are usually black and tan, but the black gradually turns to blue (steel gray) and the tan becomes golden. This color change typically happens between 6 months and 3 years. It's completely normal and part of what makes Yorkie coats so unique.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  How long does Yorkie grooming take?
                </summary>
                <p className="mt-4 text-gray-700">
                  A full Yorkie groom typically takes 1.5-2 hours. Small dogs need extra patience and careful handling, so we never rush. We'll call or text you when your pup is ready for pickup.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Give Your Yorkie the Boutique Treatment They Deserve
            </h2>
            <p className="text-xl mb-8">
              Expert Yorkie grooming in Palm Harbor since 2011. Book today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsPopupOpen(true)}
                className="px-8 py-4 rounded-full text-lg font-semibold shadow-lg cursor-pointer"
                style={{backgroundColor: '#C8E5F0', color: '#2D5A87'}}
              >
                Book Yorkie Grooming
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
            <a href="/shih-tzu-grooming-palm-harbor" className="hover:text-white">Shih Tzu Grooming</a>
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

