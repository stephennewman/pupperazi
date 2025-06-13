'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: string;
  description: string;
  category: 'grooming' | 'bath' | 'addon' | 'boarding';
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
  const [currentStep, setCurrentStep] = useState(1);

  // Generate next 14 days for booking
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Skip Sundays (day 0)
      if (date.getDay() !== 0) {
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
        
        // Simulate availability (in real app, this would check actual bookings)
        const available = Math.random() > 0.3; // 70% chance of being available
        
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

  const canProceedToConfirm = () => {
    return selectedDate && selectedTime && petInfo.name && petInfo.breed;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🐾</span>
              <h1 className="text-2xl font-bold text-purple-900">Book Your Appointment</h1>
            </div>
            <button 
              onClick={() => window.close()}
              className="text-gray-500 hover:text-gray-700 text-xl"
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
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step 1: Service Selection */}
        {currentStep === 1 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-purple-900 mb-4">Select Your Services</h2>
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
                    ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continue to Calendar →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Date & Time Selection */}
        {currentStep === 2 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-purple-900 mb-4">Choose Date & Time</h2>
              <p className="text-lg text-gray-600">
                Appointment duration: <span className="font-semibold text-purple-600">{formatDuration(getTotalDuration())}</span>
              </p>
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
                      className={`p-3 rounded-xl border-2 transition-all text-left ${
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
                            ? 'border-purple-600 bg-purple-50 text-purple-700'
                            : 'border-gray-200 bg-white hover:border-purple-300 text-gray-700'
                        }`}
                      >
                        {slot.time}
                        {!slot.available && <div className="text-xs">Booked</div>}
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
                className="px-6 py-3 rounded-full border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold transition-all"
              >
                ← Back to Services
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                disabled={!selectedDate || !selectedTime}
                className={`px-8 py-3 rounded-full font-semibold transition-all ${
                  selectedDate && selectedTime
                    ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl'
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
                className="px-6 py-3 rounded-full border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold transition-all"
              >
                ← Back to Calendar
              </button>
              <button
                disabled={!canProceedToConfirm()}
                className={`px-8 py-3 rounded-full font-semibold transition-all ${
                  canProceedToConfirm()
                    ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={() => {
                  // In a real app, this would submit to an API
                  alert(`Appointment booked for ${petInfo.name}! We'll call 727-753-9302 to confirm your ${selectedDate} at ${selectedTime} appointment.`);
                  window.close();
                }}
              >
                Book Appointment 🎉
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 