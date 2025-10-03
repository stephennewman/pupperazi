'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: string;
  description: string;
  category: 'grooming' | 'bath' | 'addon';
}

interface TimeSlot {
  time: string;
  available: boolean;
}

const services: Service[] = [
  // Grooming Services
  { id: 'bath-bliss', name: 'Bath Time Bliss', duration: 60, price: '$45-65', description: 'Full service bath with premium shampoo and conditioning', category: 'bath' },
  { id: 'mini-makeover', name: 'Mini Makeover', duration: 30, price: '$25-35', description: 'Quick grooming touch-up for your pet', category: 'grooming' },
  { id: 'full-glam', name: 'Full Glam Groom', duration: 120, price: '$65-95', description: 'Complete grooming package with styling and nail trim', category: 'grooming' },
  
  // Wash N Go (by size)
  { id: 'wash-small', name: 'Wash N Go - Small Dog', duration: 30, price: '$15', description: 'Quick wash for small dogs (under 25 lbs)', category: 'bath' },
  { id: 'wash-medium', name: 'Wash N Go - Medium Dog', duration: 45, price: '$17', description: 'Quick wash for medium dogs (25-50 lbs)', category: 'bath' },
  { id: 'wash-large', name: 'Wash N Go - Large Dog', duration: 60, price: '$20', description: 'Quick wash for large dogs (over 50 lbs)', category: 'bath' },
  
  // Add-on Services
  { id: 'nail-trim', name: 'Nail Trim', duration: 15, price: '$15', description: 'Professional nail trimming', category: 'addon' },
  { id: 'ear-cleaning', name: 'Ear Cleaning', duration: 15, price: '$10', description: 'Gentle ear cleaning and inspection', category: 'addon' },
  { id: 'teeth-brushing', name: 'Teeth Brushing', duration: 20, price: '$12', description: 'Dental hygiene with pet-safe toothpaste', category: 'addon' },
  { id: 'flea-treatment', name: 'Flea Treatment', duration: 30, price: '$20', description: 'Flea shampoo and treatment', category: 'addon' },
  { id: 'de-shedding', name: 'De-shedding Treatment', duration: 45, price: '$25', description: 'Reduce shedding with special treatment', category: 'addon' },
];

export default function BookingPage() {
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [petInfo, setPetInfo] = useState({
    name: '',
    breed: '',
    size: '',
    notes: ''
  });

  const [ownerInfo, setOwnerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    emergencyContact: ''
  });

  const [preferences, setPreferences] = useState({
    contactMethod: 'email' as 'email' | 'phone' | 'either',
    reminderPreference: 'email' as 'email' | 'text' | 'both',
    marketingConsent: false
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string>('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState<string>('');

  // Generate next 14 days for booking
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Skip Sundays (day 0) and Mondays (day 1)
      if (date.getDay() !== 0 && date.getDay() !== 1) {
        dates.push(date);
      }
    }
    return dates;
  };

  // Generate time slots based on business hours
  const getTimeSlots = (date: string): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startHour = 8; // 8 AM
    const endHour = 17; // 5 PM
    const interval = 30; // 30-minute intervals
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        
        // All time slots are available for requests
        const available = true;
        
        slots.push({
          time: displayTime,
          available
        });
      }
    }
    return slots;
  };

  const toggleService = (service: Service) => {
    setSelectedServices(prev => {
      const exists = prev.find(s => s.id === service.id);
      if (exists) {
        return prev.filter(s => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  const getTotalDuration = () => {
    return selectedServices.reduce((total, service) => total + service.duration, 0);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    return `${mins}m`;
  };

  const canProceedToCalendar = () => {
    return selectedServices.length > 0;
  };

  const canProceedToPetInfo = () => {
    return selectedServices.length > 0;
  };

  const canProceedToOwnerInfo = () => {
    return selectedDate && selectedTime && petInfo.name && petInfo.breed;
  };

  const canProceedToConfirm = () => {
    return canProceedToOwnerInfo() &&
           ownerInfo.firstName && ownerInfo.lastName && ownerInfo.email && ownerInfo.phone;
  };

  const handleBooking = async () => {
    if (!canProceedToConfirm()) {
      setBookingError('Please complete all required information.');
      return;
    }

    setIsBooking(true);
    setBookingError('');

    try {
      const bookingData = {
        selectedServices,
        selectedDate,
        selectedTime,
        petInfo,
        ownerInfo,
        preferences
      };

      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (response.ok) {
        const bookingId = data.bookingId || `PP-${Date.now().toString(36).toUpperCase()}`;
        
        // Store contract data for the contract signing page
        const contractData = {
          bookingId,
          customerName: `${ownerInfo.firstName} ${ownerInfo.lastName}`,
          petName: petInfo.name,
          services: selectedServices.map(s => s.name),
          totalAmount: selectedServices.reduce((total, service) => {
            // Extract price from service.price string (e.g., "$45-65" -> 45)
            const price = parseInt(service.price.replace(/[^0-9]/g, ''));
            return total + (price || 0);
          }, 0),
          appointmentDate: selectedDate,
          appointmentTime: selectedTime,
        };

        // Store in localStorage for the contract page
        localStorage.setItem(`contract_${bookingId}`, JSON.stringify(contractData));
        localStorage.setItem(`payment_${bookingId}`, JSON.stringify(contractData));

        // Redirect to contract signing page
        window.location.href = `/contract?bookingId=${bookingId}`;
      } else {
        setBookingError(data.error || 'Booking failed. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      setBookingError('Network error. Please check your connection and try again.');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center space-x-2 cursor-pointer">
              <span className="text-2xl">🐾</span>
              <h1 className="text-2xl font-bold text-purple-900">Book Your Appointment</h1>
            </a>
            <button 
              onClick={() => window.close()}
              className="text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
            >
              ✕
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-purple-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <span className="font-medium">Services</span>
              </div>
              <div className="flex-1 h-px bg-gray-200"></div>
              <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-purple-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                  2
                </div>
                <span className="font-medium">Date & Time</span>
              </div>
              <div className="flex-1 h-px bg-gray-200"></div>
              <div className={`flex items-center space-x-2 ${currentStep >= 3 ? 'text-purple-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= 3 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                  3
                </div>
                <span className="font-medium">Pet Info</span>
              </div>
              <div className="flex-1 h-px bg-gray-200"></div>
              <div className={`flex items-center space-x-2 ${currentStep >= 4 ? 'text-purple-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= 4 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                  4
                </div>
                <span className="font-medium">Your Info</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step 1: Service Selection */}
        {currentStep === 1 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-purple-900 mb-4">Request Your Services</h2>
              <p className="text-lg text-gray-600">Choose the pampering your pet deserves</p>
            </div>

            {/* Service Categories */}
            <div className="space-y-8">
              {/* Main Grooming Services */}
              <div>
                <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
                  ✂️ Grooming & Bath Services
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.filter(s => s.category === 'grooming' || s.category === 'bath').map(service => (
                    <div
                      key={service.id}
                      onClick={() => toggleService(service)}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-lg ${
                        selectedServices.find(s => s.id === service.id)
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 bg-white hover:border-purple-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{service.name}</h4>
                        <div className="text-right">
                          <div className="text-lg font-bold text-purple-600">{service.price}</div>
                          <div className="text-sm text-gray-500">{formatDuration(service.duration)}</div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{service.description}</p>
                      {selectedServices.find(s => s.id === service.id) && (
                        <div className="mt-2 flex items-center text-purple-600">
                          <span className="text-sm font-medium">✓ Selected</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Add-on Services */}
              <div>
                <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
                  ➕ Add-on Services
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.filter(s => s.category === 'addon').map(service => (
                    <div
                      key={service.id}
                      onClick={() => toggleService(service)}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-lg ${
                        selectedServices.find(s => s.id === service.id)
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 bg-white hover:border-purple-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{service.name}</h4>
                        <div className="text-right">
                          <div className="text-lg font-bold text-purple-600">{service.price}</div>
                          <div className="text-sm text-gray-500">{formatDuration(service.duration)}</div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{service.description}</p>
                      {selectedServices.find(s => s.id === service.id) && (
                        <div className="mt-2 flex items-center text-purple-600">
                          <span className="text-sm font-medium">✓ Selected</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Services Summary */}
            {selectedServices.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-200">
                <h3 className="text-lg font-bold text-purple-900 mb-4">Selected Services</h3>
                <div className="space-y-2 mb-4">
                  {selectedServices.map(service => (
                    <div key={service.id} className="flex justify-between items-center">
                      <span className="text-gray-700">{service.name}</span>
                      <div className="text-right">
                        <span className="text-purple-600 font-semibold">{service.price}</span>
                        <span className="text-gray-500 text-sm ml-2">({formatDuration(service.duration)})</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Estimated Time:</span>
                    <span className="text-purple-600">{formatDuration(getTotalDuration())}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Next Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                disabled={!canProceedToCalendar()}
                className={`px-8 py-3 rounded-full font-semibold transition-all ${
                  canProceedToCalendar()
                    ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Date & Time Selection */}
        {currentStep === 2 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-purple-900 mb-4">Request Date & Time</h2>
              <p className="text-lg text-gray-600">
                Requested duration: <span className="font-semibold text-purple-600">{formatDuration(getTotalDuration())}</span>
              </p>
              <p className="text-sm text-gray-500 mt-2">We'll confirm availability and get back to you within 24 hours</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Date Selection */}
              <div>
                <h3 className="text-xl font-bold text-purple-800 mb-4">📅 Select Date</h3>
                <div className="grid grid-cols-2 gap-3">
                  {getAvailableDates().map((date, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(date.toDateString())}
                      className={`p-3 rounded-xl border-2 transition-all text-left cursor-pointer ${
                        selectedDate === date.toDateString()
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 bg-white hover:border-purple-300'
                      }`}
                    >
                      <div className="font-semibold text-gray-900">
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className="text-sm text-gray-600">
                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <h3 className="text-xl font-bold text-purple-800 mb-4">🕐 Select Time</h3>
                {selectedDate ? (
                  <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                    {getTimeSlots(selectedDate).map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        className={`p-2 rounded-lg border transition-all text-sm ${
                          !slot.available
                            ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                            : selectedTime === slot.time
                            ? 'border-purple-600 bg-purple-50 text-purple-700 cursor-pointer'
                            : 'border-gray-200 bg-white hover:border-purple-300 text-gray-700 cursor-pointer'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-center py-8">
                    Please select a date first
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3 rounded-full border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold transition-all cursor-pointer"
              >
                ← Back to Services
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                disabled={!selectedDate || !selectedTime}
                className={`px-8 py-3 rounded-full font-semibold transition-all ${
                  selectedDate && selectedTime
                    ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continue to Pet Info →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Pet Information */}
        {currentStep === 3 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-purple-900 mb-4">Pet Information</h2>
              <p className="text-lg text-gray-600">Tell us about your furry friend</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pet Name *
                  </label>
                  <input
                    type="text"
                    value={petInfo.name}
                    onChange={(e) => setPetInfo({...petInfo, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Buddy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Breed *
                  </label>
                  <input
                    type="text"
                    value={petInfo.breed}
                    onChange={(e) => setPetInfo({...petInfo, breed: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Golden Retriever"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Size
                </label>
                <select
                  value={petInfo.size}
                  onChange={(e) => setPetInfo({...petInfo, size: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select size</option>
                  <option value="small">Small (under 25 lbs)</option>
                  <option value="medium">Medium (25-50 lbs)</option>
                  <option value="large">Large (over 50 lbs)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Special Notes
                </label>
                <textarea
                  value={petInfo.notes}
                  onChange={(e) => setPetInfo({...petInfo, notes: e.target.value})}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Any special instructions, behavioral notes, or health concerns..."
                />
              </div>

              {/* Booking Summary */}
              <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                <h3 className="text-lg font-bold text-purple-900 mb-4">Appointment Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-semibold">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-semibold">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold">{formatDuration(getTotalDuration())}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="text-gray-600 mb-1">Services:</div>
                    {selectedServices.map(service => (
                      <div key={service.id} className="flex justify-between ml-4">
                        <span>{service.name}</span>
                        <span className="font-semibold">{service.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between max-w-2xl mx-auto">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 rounded-full border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold transition-all cursor-pointer"
              >
                ← Back to Calendar
              </button>
              <button
                disabled={!canProceedToOwnerInfo()}
                className={`px-8 py-3 rounded-full font-semibold transition-all ${
                  canProceedToOwnerInfo()
                    ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={() => setCurrentStep(4)}
              >
                Continue to Your Info →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Owner Information & Booking */}
        {currentStep === 4 && !bookingSuccess && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-purple-900 mb-4">Your Information</h2>
              <p className="text-lg text-gray-600">Tell us about yourself so we can provide the best service</p>
            </div>

            {/* Error Display */}
            {bookingError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <span className="text-red-600 mr-2">⚠️</span>
                  <p className="text-red-800 font-medium">{bookingError}</p>
                </div>
              </div>
            )}

            <div className="max-w-2xl mx-auto space-y-6">
              {/* Owner Information */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-purple-900 mb-4">👤 Owner Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={ownerInfo.firstName}
                      onChange={(e) => setOwnerInfo({...ownerInfo, firstName: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={ownerInfo.lastName}
                      onChange={(e) => setOwnerInfo({...ownerInfo, lastName: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={ownerInfo.email}
                    onChange={(e) => setOwnerInfo({...ownerInfo, email: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="john.doe@email.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">We'll send booking confirmations and reminders here</p>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={ownerInfo.phone}
                    onChange={(e) => setOwnerInfo({...ownerInfo, phone: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="(727) 555-0123"
                  />
                  <p className="text-xs text-gray-500 mt-1">For appointment confirmations and updates</p>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address (Optional)
                  </label>
                  <input
                    type="text"
                    value={ownerInfo.address}
                    onChange={(e) => setOwnerInfo({...ownerInfo, address: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="123 Main St, Palm Harbor, FL"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Emergency Contact (Optional)
                  </label>
                  <input
                    type="tel"
                    value={ownerInfo.emergencyContact}
                    onChange={(e) => setOwnerInfo({...ownerInfo, emergencyContact: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="(727) 555-0123"
                  />
                  <p className="text-xs text-gray-500 mt-1">Someone we can contact if needed during your appointment</p>
                </div>
              </div>

              {/* Preferences */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-purple-900 mb-4">📱 Communication Preferences</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Preferred Contact Method *
                    </label>
                    <select
                      value={preferences.contactMethod}
                      onChange={(e) => setPreferences({...preferences, contactMethod: e.target.value as 'email' | 'phone' | 'either'})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone Call</option>
                      <option value="either">Either Email or Phone</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Appointment Reminders *
                    </label>
                    <select
                      value={preferences.reminderPreference}
                      onChange={(e) => setPreferences({...preferences, reminderPreference: e.target.value as 'email' | 'text' | 'both'})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="email">Email only</option>
                      <option value="text">Text message only</option>
                      <option value="both">Both email and text</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">We'll send reminders 24 hours before your appointment</p>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="marketing"
                      checked={preferences.marketingConsent}
                      onChange={(e) => setPreferences({...preferences, marketingConsent: e.target.checked})}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="marketing" className="ml-2 text-sm text-gray-700">
                      I'd like to receive updates about special offers and new services
                    </label>
                  </div>
                </div>
              </div>

              {/* Final Summary */}
              <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                <h3 className="text-lg font-bold text-purple-900 mb-4">📋 Final Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pet:</span>
                    <span className="font-semibold">{petInfo.name} ({petInfo.breed})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date & Time:</span>
                    <span className="font-semibold">{selectedDate} at {selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Services:</span>
                    <span className="font-semibold">{selectedServices.length} selected</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold">{formatDuration(getTotalDuration())}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="text-purple-800 font-medium">Ready to book! 🎉</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between max-w-2xl mx-auto">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-3 rounded-full border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold transition-all cursor-pointer"
              >
                ← Back to Pet Info
              </button>
              <button
                disabled={!canProceedToConfirm() || isBooking}
                className={`px-8 py-3 rounded-full font-semibold transition-all ${
                  canProceedToConfirm() && !isBooking
                    ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={handleBooking}
              >
                {isBooking ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Booking...
                  </div>
                ) : (
                  'Book Appointment 🎉'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Booking Success State */}
        {bookingSuccess && (
          <div className="space-y-8">
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h2 className="text-4xl font-bold text-green-800 mb-4">
                🎉 Appointment Booked Successfully!
              </h2>

              <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                Thank you, {ownerInfo.firstName}! Your appointment for {petInfo.name} has been confirmed.
                We've sent a confirmation email to {ownerInfo.email}.
              </p>

              {/* Booking Details */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-purple-900 mb-6 text-center">📅 Appointment Details</h3>

                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Pet Information</h4>
                    <p className="text-gray-600"><strong>Name:</strong> {petInfo.name}</p>
                    <p className="text-gray-600"><strong>Breed:</strong> {petInfo.breed}</p>
                    {petInfo.size && <p className="text-gray-600"><strong>Size:</strong> {petInfo.size}</p>}
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Appointment Details</h4>
                    <p className="text-gray-600"><strong>Date:</strong> {selectedDate}</p>
                    <p className="text-gray-600"><strong>Time:</strong> {selectedTime}</p>
                    <p className="text-gray-600"><strong>Duration:</strong> {formatDuration(getTotalDuration())}</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Services Booked:</h4>
                  <div className="space-y-2">
                    {selectedServices.map(service => (
                      <div key={service.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <span className="font-medium">{service.name}</span>
                        <span className="text-purple-600 font-semibold">{service.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {bookingId && (
                  <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm text-purple-800">
                      <strong>Booking ID:</strong> {bookingId}
                    </p>
                  </div>
                )}
              </div>

              {/* Next Steps */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
                <h3 className="text-xl font-bold text-blue-900 mb-4">🎯 What Happens Next?</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                    <p className="text-blue-800">Check your email for appointment confirmation</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                    <p className="text-blue-800">We'll call you within 24 hours to confirm</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                    <p className="text-blue-800">You'll receive a reminder {preferences.reminderPreference} 24 hours before</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                    <p className="text-blue-800">Arrive 10 minutes early for your appointment</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.href = '/'}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-colors shadow-lg hover:shadow-xl cursor-pointer"
                >
                  🏠 Back to Home
                </button>

                <button
                  onClick={() => {
                    // Reset the booking form
                    setSelectedServices([]);
                    setSelectedDate('');
                    setSelectedTime('');
                    setPetInfo({ name: '', breed: '', size: '', notes: '' });
                    setOwnerInfo({ firstName: '', lastName: '', email: '', phone: '', address: '', emergencyContact: '' });
                    setPreferences({ contactMethod: 'email', reminderPreference: 'email', marketingConsent: false });
                    setCurrentStep(1);
                    setBookingSuccess(false);
                    setBookingId('');
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold transition-colors shadow-lg hover:shadow-xl cursor-pointer"
                >
                  📅 Book Another Appointment
                </button>
              </div>

              {/* Contact Information */}
              <div className="mt-8 text-center">
                <p className="text-gray-600 mb-2">Questions about your appointment?</p>
                <p className="text-lg">
                  Call us: <a href="tel:727-753-9302" className="text-purple-600 hover:text-purple-700 font-semibold">(727) 753-9302</a> |
                  Email: <a href="mailto:PupperaziPetSpa@gmail.com" className="text-purple-600 hover:text-purple-700 font-semibold">PupperaziPetSpa@gmail.com</a>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 