'use client';

import { useState } from 'react';
import AppointmentPopup from '@/components/AppointmentPopup';

export default function PuppyGroomingPalmHarborPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Pupperazi Pet Spa - Puppy Grooming in Palm Harbor FL",
    "image": "https://pupperazipetspa.com/gallery/pet1.png",
    "description": "Gentle puppy grooming in Palm Harbor, FL. First-time grooming experiences that build lifelong comfort. Patient, experienced groomers. All breeds welcome.",
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
    "priceRange": "$15-$65",
    "openingHours": ["Tu-Fr 08:00-17:30", "Sa 08:00-17:00"]
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
                <span className="text-xs">Call/Text</span> <span className="font-bold">727-753-9302</span>
              </a>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              🐶 Puppy's First Groom? We Make It Pawsitive!
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-900 mb-4">
              Gentle Puppy Grooming in Palm Harbor, FL
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-6">
              Building Lifelong Grooming Confidence • Patient, Experienced Care • All Breeds Welcome
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <button
                onClick={() => setIsPopupOpen(true)}
                className="px-8 py-4 rounded-full text-lg font-semibold shadow-lg cursor-pointer"
                style={{backgroundColor: '#C8E5F0', color: '#2D5A87'}}
              >
                Book Puppy's First Groom
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

        {/* Why Early Grooming Matters */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Why Your Puppy's First Grooming Experience Matters
            </h2>
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-xl mb-8">
              <p className="text-lg text-gray-700 mb-4">
                Your puppy's first grooming experience shapes how they'll feel about grooming for the rest of their life. A scary or rushed first visit can create anxiety that lasts for years. A positive, patient introduction builds confidence and makes future grooming stress-free for both of you.
              </p>
              <p className="text-lg text-gray-700">
                At Pupperazi Pet Spa, we specialize in gentle puppy introductions. We take our time, use positive reinforcement, and never force a scared puppy. Your pup's comfort and safety come first—always.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl mb-3">✅</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">When to Start Grooming</h3>
                <p className="text-gray-700">
                  Start between 8-16 weeks old, after vaccinations. Early exposure helps puppies get comfortable with handling, water, dryers, and grooming tools.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl mb-3">🎓</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">What We Teach Your Puppy</h3>
                <p className="text-gray-700">
                  Grooming is fun! We use treats, praise, and patience to teach your puppy that baths, nail trims, and brushing are positive experiences.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Puppy-Friendly Approach */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Our Puppy-Friendly Grooming Approach
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-4xl mb-4">🐕</div>
                <h3 className="text-xl font-bold text-purple-900 mb-3">Short Sessions</h3>
                <p className="text-gray-700">
                  Puppies have short attention spans. We keep first visits brief (30-60 minutes) to prevent overwhelm. As your puppy grows, we gradually extend grooming time.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-xl font-bold text-purple-900 mb-3">Positive Reinforcement</h3>
                <p className="text-gray-700">
                  Lots of treats, praise, and gentle handling. We make grooming feel like playtime, not punishment. Your puppy will actually look forward to visits!
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-4xl mb-4">🧘</div>
                <h3 className="text-xl font-bold text-purple-900 mb-3">Go at Their Pace</h3>
                <p className="text-gray-700">
                  If your puppy is scared, we take breaks. We never force anything. Building trust takes time, and we're patient professionals who understand puppy behavior.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-4xl mb-4">🛁</div>
                <h3 className="text-xl font-bold text-purple-900 mb-3">Gentle Introduction</h3>
                <p className="text-gray-700">
                  We introduce water, dryers, and clippers gradually. No sudden loud noises or scary tools. Everything is done at a calm, puppy-friendly pace.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-4xl mb-4">👩‍⚕️</div>
                <h3 className="text-xl font-bold text-purple-900 mb-3">20+ Years Experience</h3>
                <p className="text-gray-700">
                  Our lead groomer Tracy has over 20 years of experience with puppies of all breeds and temperaments. She knows exactly how to build confidence.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-bold text-purple-900 mb-3">Owner Education</h3>
                <p className="text-gray-700">
                  We teach you how to brush, clean ears, and handle paws at home. The more comfortable your puppy is with handling, the easier grooming becomes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Puppy Grooming Services */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Puppy Grooming Services
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-xl">
                <div className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
                  RECOMMENDED FOR FIRST VISIT
                </div>
                <h3 className="text-2xl font-bold text-purple-800 mb-3">Puppy Introduction Package</h3>
                <p className="text-3xl font-bold text-purple-600 mb-4">$45-55</p>
                <p className="text-gray-700 mb-4">Perfect for puppies 8-16 weeks old. Gentle introduction to grooming:</p>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Gentle bath with puppy-safe shampoo</li>
                  <li>✓ Introduction to blow dryer (low setting)</li>
                  <li>✓ Nail trim or filing</li>
                  <li>✓ Ear cleaning</li>
                  <li>✓ Light brushing</li>
                  <li>✓ Lots of treats & positive reinforcement</li>
                  <li>✓ Take-home grooming tips for parents</li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-purple-200">
                <h3 className="text-2xl font-bold text-purple-800 mb-3">Puppy's First Haircut</h3>
                <p className="text-3xl font-bold text-purple-600 mb-4">$55-75</p>
                <p className="text-gray-700 mb-4">For puppies 4-6 months old, ready for their first trim:</p>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Everything in Introduction Package</li>
                  <li>✓ Face, feet & tail trim</li>
                  <li>✓ Sanitary trim</li>
                  <li>✓ Full brushout</li>
                  <li>✓ Perfect for doodles, poodles, terriers</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl mb-8">
              <h3 className="text-2xl font-bold text-purple-900 mb-4">🐾 Grooming Schedule for Puppies</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-gray-700">
                <div>
                  <p className="font-bold mb-2">8-16 weeks:</p>
                  <p>Introduction visit every 2-3 weeks to build comfort</p>
                </div>
                <div>
                  <p className="font-bold mb-2">4-6 months:</p>
                  <p>First haircut, then every 6-8 weeks</p>
                </div>
                <div>
                  <p className="font-bold mb-2">6-12 months:</p>
                  <p>Regular grooming every 4-8 weeks depending on breed</p>
                </div>
                <div>
                  <p className="font-bold mb-2">At home:</p>
                  <p>Daily brushing, weekly nail checks, regular ear cleaning</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setIsPopupOpen(true)}
                className="px-8 py-4 rounded-full text-lg font-semibold shadow-lg cursor-pointer"
                style={{backgroundColor: '#2D5A87', color: 'white'}}
              >
                Schedule Puppy's First Grooming
              </button>
            </div>
          </div>
        </section>

        {/* Common Puppy Grooming Questions */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center">
              Common Puppy Grooming Questions
            </h2>
            <div className="space-y-4">
              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  How old should my puppy be for their first grooming?
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  We recommend starting between 8-16 weeks old, after your puppy has had their vaccinations. The earlier you start, the easier it is to build positive associations with grooming. Even if your puppy doesn't need a haircut yet, an introduction visit helps them get comfortable with the spa, the sounds, and the handling.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  What if my puppy is scared or nervous?
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  That's completely normal! Many puppies are nervous during their first grooming. We take our time, use lots of treats and praise, and never force anything. If your puppy needs a break, we give them one. Building trust and comfort is more important than rushing through a groom. Some puppies need multiple short visits before they're ready for a full grooming—and that's okay!
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  Do you groom all puppy breeds?
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  Yes! We groom puppies of all breeds and sizes—from tiny Yorkies to giant Great Dane puppies. Goldendoodles, poodles, terriers, labs, shepherds, you name it. Our experienced groomers know the specific needs of each breed and adjust our approach accordingly.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  How long does a puppy grooming appointment take?
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  First visits are usually 30-60 minutes. We keep them short to prevent overwhelm. As your puppy gets more comfortable and grows larger, appointments will gradually extend to 2-3 hours for small dogs & 2-4 hours for large dogs. We'll call you when they're ready for pickup—no all-day waits like the big chains.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  Can I stay with my puppy during grooming?
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  We actually recommend dropping off your puppy. Many puppies are calmer without their parents present (just like daycare!). That said, for very nervous puppies, we can sometimes accommodate parents staying for the first few minutes to help with the transition. Call us to discuss what's best for your specific puppy.
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-lg">
                <summary className="font-bold text-purple-900 cursor-pointer text-lg">
                  What should I do at home to prepare my puppy?
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  Start handling your puppy's paws, ears, and tail daily. Practice brushing (even if they don't need it yet) so they get used to being groomed. Run water in the tub while they're nearby so they get used to the sound. Give treats during all handling to create positive associations. The more comfortable your puppy is with being touched and handled, the easier grooming will be!
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Give Your Puppy a Pawsitive First Grooming Experience
            </h2>
            <p className="text-xl mb-8">
              Book today and set your puppy up for a lifetime of stress-free grooming!
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
              ⏰ Tuesday-Friday 8am-5:30pm, Saturday 8am-5pm
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
        </footer>

        <AppointmentPopup 
          isOpen={isPopupOpen} 
          onClose={() => setIsPopupOpen(false)} 
        />
      </div>
    </>
  );
}
