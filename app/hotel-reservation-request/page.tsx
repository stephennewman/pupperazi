'use client';

import { useState } from 'react';
import Head from 'next/head';

export default function HotelReservationRequest() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    petName: '',
    ownerName: '',
    email: '',
    phone: '',
    checkInDate: '',
    checkOutDate: '',
    petType: '',
    petSize: '',
    specialNeeds: '',
    emergencyContact: '',
    emergencyPhone: '',
    additionalNotes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate form submission - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitStatus('success');
      setFormData({
        petName: '',
        ownerName: '',
        email: '',
        phone: '',
        checkInDate: '',
        checkOutDate: '',
        petType: '',
        petSize: '',
        specialNeeds: '',
        emergencyContact: '',
        emergencyPhone: '',
        additionalNotes: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Structured Data for Google
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "name": "Pupperazi Pet Spa - Pet Hotel",
    "description": "Pet boarding and hotel services at Pupperazi Pet Spa in Palm Harbor, FL",
    "url": "https://pupperazi-pet-spa.vercel.app/hotel-reservation-request",
    "telephone": "727-753-9302",
    "email": "PupperaziPetSpa@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "3454 Tampa Rd",
      "addressLocality": "Palm Harbor",
      "addressRegion": "FL",
      "postalCode": "34684",
      "addressCountry": "US"
    }
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Navigation */}
        <nav className="fixed top-4 w-full bg-white/90 backdrop-blur-md z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <a href="/" className="flex items-center space-x-2 cursor-pointer">
                <span className="text-2xl">🐾</span>
                <h1 className="text-2xl font-bold text-purple-900">Pupperazi Pet Spa</h1>
              </a>
              
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-8">
                <a href="/#services" className="text-gray-700 transition-colors cursor-pointer" style={{color: '#2D5A87'}} onMouseEnter={(e) => e.currentTarget.style.color = '#3D6B9F'} onMouseLeave={(e) => e.currentTarget.style.color = '#2D5A87'}>Services</a>
                <a href="/#gallery" className="text-gray-700 transition-colors cursor-pointer" style={{color: '#2D5A87'}} onMouseEnter={(e) => e.currentTarget.style.color = '#3D6B9F'} onMouseLeave={(e) => e.currentTarget.style.color = '#2D5A87'}>Gallery</a>
                <a href="/#boarding" className="text-gray-700 transition-colors cursor-pointer" style={{color: '#2D5A87'}} onMouseEnter={(e) => e.currentTarget.style.color = '#3D6B9F'} onMouseLeave={(e) => e.currentTarget.style.color = '#2D5A87'}>Boarding</a>
                <a href="/about-us" className="text-gray-700 transition-colors cursor-pointer" style={{color: '#2D5A87'}} onMouseEnter={(e) => e.currentTarget.style.color = '#3D6B9F'} onMouseLeave={(e) => e.currentTarget.style.color = '#2D5A87'}>About</a>
                <a href="/map-hours" className="text-gray-700 transition-colors cursor-pointer" style={{color: '#2D5A87'}} onMouseEnter={(e) => e.currentTarget.style.color = '#3D6B9F'} onMouseLeave={(e) => e.currentTarget.style.color = '#2D5A87'}>Map & Hours</a>
                <a
                  href="tel:727-753-9302"
                  className="px-4 py-2 rounded-full font-semibold transition-colors cursor-pointer"
                  style={{backgroundColor: '#2D5A87', color: 'white'}}
                >
                  727-753-9302
                </a>
              </div>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 cursor-pointer"
              >
                <span className="sr-only">Open menu</span>
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span className={`block w-6 h-0.5 bg-gray-600 transition-all ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
                  <span className={`block w-6 h-0.5 bg-gray-600 transition-all ${isMenuOpen ? 'opacity-0' : 'my-1'}`}></span>
                  <span className={`block w-6 h-0.5 bg-gray-600 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
                </div>
              </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="md:hidden pb-4">
                <div className="flex flex-col space-y-2">
                  <a href="/#services" className="px-2 py-1 cursor-pointer transition-colors" style={{color: '#2D5A87'}} onMouseEnter={(e) => e.currentTarget.style.color = '#3D6B9F'} onMouseLeave={(e) => e.currentTarget.style.color = '#2D5A87'}>Services</a>
                  <a href="/#gallery" className="px-2 py-1 cursor-pointer transition-colors" style={{color: '#2D5A87'}} onMouseEnter={(e) => e.currentTarget.style.color = '#3D6B9F'} onMouseLeave={(e) => e.currentTarget.style.color = '#2D5A87'}>Gallery</a>
                  <a href="/#boarding" className="px-2 py-1 cursor-pointer transition-colors" style={{color: '#2D5A87'}} onMouseEnter={(e) => e.currentTarget.style.color = '#3D6B9F'} onMouseLeave={(e) => e.currentTarget.style.color = '#2D5A87'}>Boarding</a>
                  <a href="/about-us" className="px-2 py-1 cursor-pointer transition-colors" style={{color: '#2D5A87'}} onMouseEnter={(e) => e.currentTarget.style.color = '#3D6B9F'} onMouseLeave={(e) => e.currentTarget.style.color = '#2D5A87'}>About</a>
                  <a href="/map-hours" className="px-2 py-1 cursor-pointer transition-colors" style={{color: '#2D5A87'}} onMouseEnter={(e) => e.currentTarget.style.color = '#3D6B9F'} onMouseLeave={(e) => e.currentTarget.style.color = '#2D5A87'}>Map & Hours</a>
                  <a
                    href="tel:727-753-9302"
                    className="px-4 py-2 rounded-full font-semibold transition-colors cursor-pointer mx-2 mt-2"
                    style={{backgroundColor: '#2D5A87', color: 'white'}}
                  >
                    727-753-9302
                  </a>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Refer a Friend Banner */}
        <section className="pt-32 pb-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-4 rounded-2xl shadow-lg">
              <p className="text-lg font-semibold">
                🎉 Refer a Friend for 10% off your next full service & their first full service!
              </p>
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <section className="pt-8 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-purple-900 mb-6 mt-8">
              Request a Reservation
            </h1>
            <p className="text-xl text-gray-700 mb-8 font-light">
              Book your pet's stay at our boutique hotel
            </p>
          </div>
        </section>

        {/* Hotel Information */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-purple-900 mb-6">
                🏨 The Pawsh Pet Hotel
              </h2>
              <p className="text-xl text-gray-700 mb-4">
                Sleepovers That Feel Like Staycations
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold text-purple-900 mb-6">🛏️ What's Included</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      Comfy bedding in a private pen
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      Minimum of 4 potty breaks a day
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      15 minutes of solo walk or playtime
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      Filtered water, fresh blankets, and TLC from our staff
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      Medication administration if needed
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold text-purple-900 mb-6">💰 Overnight Rates</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                      <span className="font-semibold text-purple-900">1 Dog</span>
                      <span className="text-2xl font-bold text-purple-600">$35/night</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                      <span className="font-semibold text-purple-900">2 Dogs (same room)</span>
                      <span className="text-2xl font-bold text-purple-600">$50/night</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                      <span className="font-semibold text-purple-900">3 Dogs (same room)</span>
                      <span className="text-2xl font-bold text-purple-600">$60/night</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reservation Form */}
        <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-purple-900 mb-4">
                📝 Reservation Request Form
              </h2>
              <p className="text-lg text-gray-700">
                Please fill out the form below and we'll get back to you within 24 hours
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  <p className="font-semibold">✅ Thanks! Message sent.</p>
                  <p>We'll get back to you within 24 hours to confirm your reservation.</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  <p className="font-semibold">❌ Error sending message.</p>
                  <p>Please try again or call us directly at 727-753-9302.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Pet Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="petName" className="block text-sm font-semibold text-gray-700 mb-2">
                      Pet's Name *
                    </label>
                    <input
                      type="text"
                      id="petName"
                      name="petName"
                      value={formData.petName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter your pet's name"
                    />
                  </div>

                  <div>
                    <label htmlFor="petType" className="block text-sm font-semibold text-gray-700 mb-2">
                      Pet Type *
                    </label>
                    <select
                      id="petType"
                      name="petType"
                      value={formData.petType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select pet type</option>
                      <option value="dog">Dog</option>
                      <option value="cat">Cat</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="petSize" className="block text-sm font-semibold text-gray-700 mb-2">
                      Pet Size *
                    </label>
                    <select
                      id="petSize"
                      name="petSize"
                      value={formData.petSize}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select size</option>
                      <option value="small">Small (under 25 lbs)</option>
                      <option value="medium">Medium (25-50 lbs)</option>
                      <option value="large">Large (50-100 lbs)</option>
                      <option value="xlarge">Extra Large (over 100 lbs)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="specialNeeds" className="block text-sm font-semibold text-gray-700 mb-2">
                      Special Needs
                    </label>
                    <input
                      type="text"
                      id="specialNeeds"
                      name="specialNeeds"
                      value={formData.specialNeeds}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Medication, dietary restrictions, etc."
                    />
                  </div>
                </div>

                {/* Owner Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="ownerName" className="block text-sm font-semibold text-gray-700 mb-2">
                      Owner's Name *
                    </label>
                    <input
                      type="text"
                      id="ownerName"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="(727) 123-4567"
                    />
                  </div>

                  <div>
                    <label htmlFor="emergencyContact" className="block text-sm font-semibold text-gray-700 mb-2">
                      Emergency Contact Name
                    </label>
                    <input
                      type="text"
                      id="emergencyContact"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Emergency contact name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="emergencyPhone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Emergency Contact Phone
                  </label>
                  <input
                    type="tel"
                    id="emergencyPhone"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="(727) 123-4567"
                  />
                </div>

                {/* Dates */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="checkInDate" className="block text-sm font-semibold text-gray-700 mb-2">
                      Check-in Date *
                    </label>
                    <input
                      type="date"
                      id="checkInDate"
                      name="checkInDate"
                      value={formData.checkInDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="checkOutDate" className="block text-sm font-semibold text-gray-700 mb-2">
                      Check-out Date *
                    </label>
                    <input
                      type="date"
                      id="checkOutDate"
                      name="checkOutDate"
                      value={formData.checkOutDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label htmlFor="additionalNotes" className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    id="additionalNotes"
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Any special instructions, feeding schedule, or other important information..."
                  />
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-4 bg-purple-600 text-white rounded-full font-semibold text-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Reservation Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12" style={{backgroundColor: '#3D6B9F', color: 'white'}}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Main Footer Content */}
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              {/* Brand Section */}
              <div className="md:col-span-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
                  <span className="text-3xl">🐾</span>
                  <h3 className="text-2xl font-bold">Pupperazi Pet Spa</h3>
                </div>
                <p className="text-blue-100 mb-4">
                  Where Every Pet Gets the VIP Treatment
                </p>
                <div className="text-sm text-blue-100">
                  <p>3454 Tampa Rd</p>
                  <p>Palm Harbor, FL 34684</p>
                  <p className="mt-2">727-753-9302</p>
                  <p>PupperaziPetSpa@gmail.com</p>
                </div>
                {/* Social Media Links */}
                <div className="flex justify-center md:justify-start space-x-4 mt-4">
                  <a 
                    href="https://facebook.com/pupperazipetspa" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    aria-label="Facebook"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://instagram.com/pupperazipetspa" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    aria-label="Instagram"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.281h-1.563c-.312 0-.563-.251-.563-.563V5.583c0-.312.251-.563.563-.563h1.563c.312 0 .563.251.563.563v1.561c0 .312-.251.563-.563.563zm-5.6 9.281c-2.4 0-4.35-1.95-4.35-4.35s1.95-4.35 4.35-4.35 4.35 1.95 4.35 4.35-1.95 4.35-4.35 4.35z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Services */}
              <div className="text-center md:text-left">
                <h4 className="text-lg font-semibold mb-4">Services</h4>
                <ul className="space-y-2 text-sm text-blue-100">
                  <li><a href="/our-services" className="hover:text-white transition-colors">Our Services</a></li>
                  <li><a href="/grooming" className="hover:text-white transition-colors">Grooming</a></li>
                  <li><a href="/wash-n-go-baths" className="hover:text-white transition-colors">Wash N Go Baths</a></li>
                  <li><a href="/appointments" className="hover:text-white transition-colors">Book Appointment</a></li>
                </ul>
              </div>

              {/* About & Info */}
              <div className="text-center md:text-left">
                <h4 className="text-lg font-semibold mb-4">About & Info</h4>
                <ul className="space-y-2 text-sm text-blue-100">
                  <li><a href="/about-us" className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="/map-hours" className="hover:text-white transition-colors">Map & Hours</a></li>
                  <li><a href="/hotel-reservation-request" className="hover:text-white transition-colors">Hotel Reservations</a></li>
                  <li><a href="/booking" className="hover:text-white transition-colors">Online Booking</a></li>
                </ul>
              </div>

              {/* Quick Links */}
              <div className="text-center md:text-left">
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm text-blue-100">
                  <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                  <li><a href="/#services" className="hover:text-white transition-colors">Services</a></li>
                  <li><a href="/#gallery" className="hover:text-white transition-colors">Gallery</a></li>
                  <li><a href="/#contact" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="pt-8" style={{borderTop: '1px solid #5A8BC4'}}>
              <div className="text-center">
                <p className="text-blue-200">
                  © 2026 Pupperazi Pet Spa LLC. All rights reserved. We roll out the paw-parazzi experience! 🎬
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
