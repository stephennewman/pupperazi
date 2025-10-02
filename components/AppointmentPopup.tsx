'use client';

import { useState } from 'react';

interface AppointmentPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AppointmentPopup({ isOpen, onClose }: AppointmentPopupProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    isNewCustomer: '',
    petInfo: '',
    dateTime: '',
    message: ''
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
        name: '',
        phone: '',
        email: '',
        isNewCustomer: '',
        petInfo: '',
        dateTime: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmitStatus('idle');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-purple-900">
            📝 Request Appointment
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-3xl font-bold leading-none"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div className="p-5">
          {submitStatus === 'success' && (
            <div className="text-center py-8">
              <div className="mb-6 p-6 bg-green-50 border border-green-200 text-green-800 rounded-lg">
                <p className="font-semibold text-lg mb-2">✅ Thanks for submitting!</p>
                <p>We'll get back to you within 24 hours to confirm your appointment.</p>
              </div>
              <button
                onClick={handleClose}
                className="px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Return to Site
              </button>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <p className="font-semibold">❌ Error sending message.</p>
              <p>Please try again or call us directly at 727-753-9302.</p>
            </div>
          )}

          {submitStatus !== 'success' && (
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name & Phone - Side by Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="popup-name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Name: *
                </label>
                <input
                  type="text"
                  id="popup-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="popup-phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone: *
                </label>
                <input
                  type="tel"
                  id="popup-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="(727) 555-0123"
                />
              </div>
            </div>

            {/* Email & New Customer - Side by Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="popup-email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email: *
                </label>
                <input
                  type="email"
                  id="popup-email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label htmlFor="popup-customer" className="block text-sm font-semibold text-gray-700 mb-2">
                  New Customer?: *
                </label>
                <select
                  id="popup-customer"
                  name="isNewCustomer"
                  value={formData.isNewCustomer}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select one</option>
                  <option value="yes">Yes, I'm new</option>
                  <option value="no">No, returning</option>
                </select>
              </div>
            </div>

            {/* Pet Info & Date/Time - Side by Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="popup-pet" className="block text-sm font-semibold text-gray-700 mb-2">
                  Pet(s) Name & Breed(s): *
                </label>
                <textarea
                  id="popup-pet"
                  name="petInfo"
                  value={formData.petInfo}
                  onChange={handleInputChange}
                  required
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Buddy - Golden Retriever"
                />
              </div>
              <div>
                <label htmlFor="popup-datetime" className="block text-sm font-semibold text-gray-700 mb-2">
                  Date & Time Requested: *
                </label>
                <textarea
                  id="popup-datetime"
                  name="dateTime"
                  value={formData.dateTime}
                  onChange={handleInputChange}
                  required
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Tuesday, March 15th at 2 PM"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="popup-message" className="block text-sm font-semibold text-gray-700 mb-2">
                Additional Notes:
              </label>
              <textarea
                id="popup-message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Special requests or questions..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </form>
          )}
        </div>
      </div>
    </div>
  );
}
