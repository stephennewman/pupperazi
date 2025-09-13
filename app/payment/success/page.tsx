'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentSuccessPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  useEffect(() => {
    if (bookingId) {
      // In a real app, you'd verify the payment with Stripe
      // and update your database
      console.log('Payment successful for booking:', bookingId);
      
      // Simulate processing
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } else {
      setError('No booking ID provided');
      setIsLoading(false);
    }
  }, [bookingId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your payment...</p>
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
              href="/" 
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8">
          <div className="text-green-600 text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold text-green-800 mb-4">Payment Successful!</h2>
          <p className="text-green-700 text-lg mb-6">
            Thank you! Your payment has been processed successfully.
          </p>
          
          <div className="bg-white rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-4">Booking Confirmed</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Booking ID:</strong> {bookingId}</p>
              <p><strong>Status:</strong> Payment Complete</p>
              <p><strong>Next Steps:</strong> You'll receive a confirmation email with all the details.</p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-green-700">
              Your appointment is now confirmed and paid for. We look forward to seeing you and your pet!
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
