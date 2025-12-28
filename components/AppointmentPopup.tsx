'use client';

import { useState, useEffect, useRef } from 'react';

// Google Analytics event tracking
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const trackEvent = (eventName: string, params?: Record<string, string | number>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

// Get UTM parameters from URL (filters out undefined values for TypeScript)
const getUTMParams = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  
  const source = params.get('utm_source');
  const medium = params.get('utm_medium');
  const campaign = params.get('utm_campaign');
  const term = params.get('utm_term');
  const content = params.get('utm_content');
  
  if (source) utm.utm_source = source;
  if (medium) utm.utm_medium = medium;
  if (campaign) utm.utm_campaign = campaign;
  if (term) utm.utm_term = term;
  if (content) utm.utm_content = content;
  
  return utm;
};

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
  const hasTrackedOpen = useRef(false);
  const formStarted = useRef(false);

  // Track form open when popup becomes visible
  useEffect(() => {
    if (isOpen && !hasTrackedOpen.current) {
      trackEvent('form_open', { 
        form_name: 'appointment_request',
        ...getUTMParams()
      });
      hasTrackedOpen.current = true;
      formStarted.current = false; // Reset form started flag
    }
    if (!isOpen) {
      hasTrackedOpen.current = false;
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Track first interaction with form
    if (!formStarted.current && value) {
      trackEvent('form_start', { form_name: 'appointment_request' });
      formStarted.current = true;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Format the message to include all appointment details
      const appointmentDetails = `🐾 APPOINTMENT REQUEST

📋 Customer Status: ${formData.isNewCustomer === 'yes' ? 'New Customer ⭐' : 'Returning Customer'}

🐕 Pet Information: ${formData.petInfo}

📅 Requested Date/Time: ${formData.dateTime}

${formData.message ? `💬 Additional Notes:\n${formData.message}` : ''}
      `.trim();

      // Get UTM parameters
      const utmParams = getUTMParams();

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: 'grooming',
          contactMethod: 'either',
          message: appointmentDetails,
          isNewCustomer: formData.isNewCustomer,
          petInfo: formData.petInfo,
          requestedDateTime: formData.dateTime,
          // Include UTM tracking
          ...utmParams
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Track successful form submission
        trackEvent('form_submit_success', { 
          form_name: 'appointment_request',
          is_new_customer: formData.isNewCustomer,
          ...utmParams
        });
        
        setSubmitStatus('success');
        formStarted.current = false;
        setFormData({
          name: '',
          phone: '',
          email: '',
          isNewCustomer: '',
          petInfo: '',
          dateTime: '',
          message: ''
        });
      } else {
        // Track form error
        trackEvent('form_submit_error', { 
          form_name: 'appointment_request',
          error_message: data.error || 'Unknown error'
        });
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Appointment submission error:', error);
      // Track form error
      trackEvent('form_submit_error', { 
        form_name: 'appointment_request',
        error_message: error instanceof Error ? error.message : 'Network error'
      });
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Track form abandonment if user started filling but didn't submit
    if (formStarted.current && submitStatus !== 'success') {
      trackEvent('form_abandon', { 
        form_name: 'appointment_request',
        fields_filled: Object.values(formData).filter(v => v).length.toString()
      });
    }
    
    setSubmitStatus('idle');
    formStarted.current = false;
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="popup-name" className="block text-xs font-semibold text-gray-700 mb-1">
                  Name: *
                </label>
                <input
                  type="text"
                  id="popup-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base text-gray-900 bg-white"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="popup-phone" className="block text-xs font-semibold text-gray-700 mb-1">
                  Phone: *
                </label>
                <input
                  type="tel"
                  id="popup-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base text-gray-900 bg-white"
                  placeholder="(727) 555-0123"
                />
              </div>
            </div>

            {/* Email & New Customer - Side by Side */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="popup-email" className="block text-xs font-semibold text-gray-700 mb-1">
                  Email: *
                </label>
                <input
                  type="email"
                  id="popup-email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base text-gray-900 bg-white"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label htmlFor="popup-customer" className="block text-xs font-semibold text-gray-700 mb-1">
                  New Customer?: *
                </label>
                <select
                  id="popup-customer"
                  name="isNewCustomer"
                  value={formData.isNewCustomer}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base text-gray-900 bg-white"
                >
                  <option value="">Select one</option>
                  <option value="yes">Yes, I'm new</option>
                  <option value="no">No, returning</option>
                </select>
              </div>
            </div>

            {/* Pet Info & Date/Time - Side by Side */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="popup-pet" className="block text-xs font-semibold text-gray-700 mb-1">
                  Pet(s) Name & Breed(s): *
                </label>
                <textarea
                  id="popup-pet"
                  name="petInfo"
                  value={formData.petInfo}
                  onChange={handleInputChange}
                  required
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-base text-gray-900 bg-white"
                  placeholder="Buddy - Golden Retriever"
                />
              </div>
              <div>
                <label htmlFor="popup-datetime" className="block text-xs font-semibold text-gray-700 mb-1">
                  Date & Time Requested: *
                </label>
                <textarea
                  id="popup-datetime"
                  name="dateTime"
                  value={formData.dateTime}
                  onChange={handleInputChange}
                  required
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-base text-gray-900 bg-white"
                  placeholder="Tuesday, March 15th at 2 PM"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="popup-message" className="block text-xs font-semibold text-gray-700 mb-1">
                Additional Notes:
              </label>
              <textarea
                id="popup-message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-base text-gray-900 bg-white"
                placeholder="Special requests or questions..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
