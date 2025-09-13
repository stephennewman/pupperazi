'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface PaymentData {
  bookingId: string;
  amount: number;
  services: string[];
  customerName: string;
  petName: string;
  appointmentDate: string;
  appointmentTime: string;
}

export default function PaymentPage() {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'failed'>('pending');
  const router = useRouter();

  useEffect(() => {
    // Get payment data from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get('bookingId');
    const paymentLink = urlParams.get('paymentLink');
    
    if (bookingId) {
      // In a real app, you'd fetch this from your API
      const storedData = localStorage.getItem(`payment_${bookingId}`);
      if (storedData) {
        setPaymentData(JSON.parse(storedData));
      } else {
        setError('Payment data not found. Please complete your booking first.');
      }
    } else {
      setError('No booking ID provided.');
    }
    
    setIsLoading(false);
  }, []);

  const handlePayment = async () => {
    setPaymentStatus('processing');
    
    try {
      // Create Stripe payment link
      const response = await fetch('/api/payment/create-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: paymentData?.amount || 0,
          bookingId: paymentData?.bookingId || '',
          customerEmail: paymentData?.customerName || '',
        }),
      });

      const result = await response.json();

      if (response.ok && result.paymentLink) {
        // Redirect to Stripe payment page
        window.location.href = result.paymentLink;
      } else {
        throw new Error(result.error || 'Failed to create payment link');
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="text-red-600 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-red-800 mb-2">Payment Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <a 
              href="/booking" 
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Start New Booking
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="text-yellow-600 text-4xl mb-4">💳</div>
            <h2 className="text-xl font-bold text-yellow-800 mb-2">No Payment Data</h2>
            <p className="text-yellow-600 mb-4">Please complete your booking and contract first.</p>
            <a 
              href="/booking" 
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Start Booking
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center p-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8">
            <div className="text-green-600 text-6xl mb-4">✅</div>
            <h2 className="text-3xl font-bold text-green-800 mb-4">Payment Successful!</h2>
            <p className="text-green-700 text-lg mb-6">
              Thank you, {paymentData.customerName}! Your payment has been processed successfully.
            </p>
            
            <div className="bg-white rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-4">Appointment Confirmed</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Pet:</strong> {paymentData.petName}</p>
                <p><strong>Date:</strong> {paymentData.appointmentDate}</p>
                <p><strong>Time:</strong> {paymentData.appointmentTime}</p>
                <p><strong>Amount Paid:</strong> ${paymentData.amount}</p>
                <p><strong>Booking ID:</strong> {paymentData.bookingId}</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-green-700">
                You'll receive a confirmation email shortly with all the details.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/" 
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  🏠 Back to Home
                </a>
                <button
                  onClick={() => window.print()}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  🖨️ Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center space-x-2 cursor-pointer">
              <span className="text-2xl">🐾</span>
              <h1 className="text-2xl font-bold text-purple-900">Payment</h1>
            </a>
            <div className="text-sm text-gray-600">
              Booking ID: {paymentData.bookingId}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Payment Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-purple-900 mb-4">💳 Payment Summary</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
              <p className="text-gray-600">Name: {paymentData.customerName}</p>
              <p className="text-gray-600">Pet: {paymentData.petName}</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Appointment Details</h3>
              <p className="text-gray-600">Date: {paymentData.appointmentDate}</p>
              <p className="text-gray-600">Time: {paymentData.appointmentTime}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-900 mb-3">Services</h3>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              {paymentData.services.map((service, index) => (
                <li key={index}>{service}</li>
              ))}
            </ul>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-purple-900">Total Amount:</span>
                <span className="text-3xl font-bold text-purple-600">${paymentData.amount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-purple-900 mb-4">Payment Methods</h2>
          
          <div className="space-y-4 mb-6">
            <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input 
                    type="radio" 
                    id="stripe" 
                    name="payment" 
                    value="stripe" 
                    defaultChecked
                    className="w-5 h-5 text-purple-600"
                  />
                  <label htmlFor="stripe" className="font-medium text-gray-900">
                    Credit/Debit Card (Stripe)
                  </label>
                </div>
                <div className="text-sm text-gray-500">Secure & Fast</div>
              </div>
            </div>

            <div className="border-2 border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input 
                    type="radio" 
                    id="square" 
                    name="payment" 
                    value="square" 
                    className="w-5 h-5 text-purple-600"
                  />
                  <label htmlFor="square" className="font-medium text-gray-900">
                    Square Payment
                  </label>
                </div>
                <div className="text-sm text-gray-500">Alternative Option</div>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <div className="text-center">
            <button
              onClick={handlePayment}
              disabled={paymentStatus === 'processing'}
              className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all ${
                paymentStatus === 'processing'
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {paymentStatus === 'processing' ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </div>
              ) : (
                `Pay $${paymentData.amount} Now`
              )}
            </button>
            
            {paymentStatus === 'failed' && (
              <div className="mt-4 text-red-600">
                Payment failed. Please try again or contact us for assistance.
              </div>
            )}
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="text-green-600">🔒</span>
              <span>Your payment information is secure and encrypted. We never store your card details.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
