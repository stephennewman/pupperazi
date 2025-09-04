'use client';

import { useState } from 'react';

interface FormData {
  nameAndPhone: string;
  email: string;
  newCustomer: string;
  petsNameAndBreed: string;
  dateTimeRequested: string;
  message: string;
}

interface FormErrors {
  nameAndPhone?: string;
  email?: string;
  newCustomer?: string;
  petsNameAndBreed?: string;
  dateTimeRequested?: string;
  message?: string;
}

interface LeadCaptureFormProps {
  onSuccess?: () => void;
}

export default function LeadCaptureForm({ onSuccess }: LeadCaptureFormProps = {}) {
  const [formData, setFormData] = useState<FormData>({
    nameAndPhone: '',
    email: '',
    newCustomer: '',
    petsNameAndBreed: '',
    dateTimeRequested: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nameAndPhone.trim()) {
      newErrors.nameAndPhone = 'Name and phone number are required';
    } else {
      // Check if it contains both name and phone-like information
      const phoneRegex = /(\d{3}[\-\.\s]??\d{3}[\-\.\s]??\d{4}|\(\d{3}\)\s*\d{3}[\-\.\s]??\d{4}|\d{3}[\-\.\s]??\d{4})/;
      if (!phoneRegex.test(formData.nameAndPhone)) {
        newErrors.nameAndPhone = 'Please include both name and phone number (e.g., "John Doe - 555-123-4567")';
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.newCustomer.trim()) {
      newErrors.newCustomer = 'Please indicate if you are a new customer';
    }

    if (!formData.petsNameAndBreed.trim()) {
      newErrors.petsNameAndBreed = 'Pet name and breed are required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please tell us how we can help';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage('Thank you! We\'ll be in touch via email and text message soon.');
        // Reset form
        setFormData({
          nameAndPhone: '',
          email: '',
          newCustomer: '',
          petsNameAndBreed: '',
          dateTimeRequested: '',
          message: ''
        });
        setErrors({});
        // Call success callback if provided (for popup closing)
        if (onSuccess) {
          setTimeout(() => onSuccess(), 2000); // Close popup after 2 seconds
        }
      } else {
        setSubmitStatus('error');
        setSubmitMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setSubmitMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitStatus('idle');
    setSubmitMessage('');
    setFormData({
      nameAndPhone: '',
      email: '',
      newCustomer: '',
      petsNameAndBreed: '',
      dateTimeRequested: '',
      message: ''
    });
    setErrors({});
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-purple-900 mb-2">Request Appointment 🐾</h2>
                    <p className="text-gray-600">Fill out the form below and we'll send you information via email. Our team will also receive an immediate SMS notification to respond to your inquiry.</p>
      </div>

      {submitStatus === 'success' ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-green-800 mb-2">Thank You!</h3>
          <p className="text-gray-600 mb-6">{submitMessage}</p>
          {onSuccess && (
            <p className="text-sm text-green-600 mb-4">This popup will close automatically in a few seconds...</p>
          )}
          <button
            onClick={resetForm}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Submit Another Inquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name & Phone Number */}
          <div>
            <label htmlFor="nameAndPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Name & Phone Number *
            </label>
            <input
              type="text"
              id="nameAndPhone"
              name="nameAndPhone"
              value={formData.nameAndPhone}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.nameAndPhone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="John Doe - 555-123-4567"
            />
            {errors.nameAndPhone && (
              <p className="mt-1 text-sm text-red-600">{errors.nameAndPhone}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* New Customer */}
          <div>
            <label htmlFor="newCustomer" className="block text-sm font-medium text-gray-700 mb-1">
              New Customer? *
            </label>
            <select
              id="newCustomer"
              name="newCustomer"
              value={formData.newCustomer}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.newCustomer ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Please select...</option>
              <option value="yes">Yes, I'm a new customer</option>
              <option value="no">No, I'm an existing customer</option>
            </select>
            {errors.newCustomer && (
              <p className="mt-1 text-sm text-red-600">{errors.newCustomer}</p>
            )}
          </div>

          {/* Pet(s) Name & Breed(s) */}
          <div>
            <label htmlFor="petsNameAndBreed" className="block text-sm font-medium text-gray-700 mb-1">
              Pet(s) Name & Breed(s) *
            </label>
            <input
              type="text"
              id="petsNameAndBreed"
              name="petsNameAndBreed"
              value={formData.petsNameAndBreed}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.petsNameAndBreed ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Buddy (Golden Retriever), Max (Labrador)"
            />
            {errors.petsNameAndBreed && (
              <p className="mt-1 text-sm text-red-600">{errors.petsNameAndBreed}</p>
            )}
          </div>

          {/* Date & Time Requested */}
          <div>
            <label htmlFor="dateTimeRequested" className="block text-sm font-medium text-gray-700 mb-1">
              Date & Time Requested
            </label>
            <input
              type="text"
              id="dateTimeRequested"
              name="dateTimeRequested"
              value={formData.dateTimeRequested}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.dateTimeRequested ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Next Tuesday at 2 PM, or ASAP"
            />
            {errors.dateTimeRequested && (
              <p className="mt-1 text-sm text-red-600">{errors.dateTimeRequested}</p>
            )}
          </div>


          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.message ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Tell us about your pet's needs..."
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600">{errors.message}</p>
            )}
          </div>

          {/* Error Message */}
          {submitStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-700">{submitMessage}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending...
                </div>
              ) : (
                'Send Me Information 📱📧'
              )}
            </button>
            <p className="text-xs text-gray-500 mt-2">
              * Required fields. We'll contact you via both email and text message.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
