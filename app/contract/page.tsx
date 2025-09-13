'use client';

import { useState, useEffect } from 'react';
import { DocusealForm } from '@docuseal/react';

interface ContractData {
  bookingId: string;
  customerName: string;
  petName: string;
  services: string[];
  totalAmount: number;
  appointmentDate: string;
  appointmentTime: string;
}

export default function ContractPage() {
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Get contract data from URL parameters or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get('bookingId');
    
    if (bookingId) {
      // In a real app, you'd fetch this from your API
      const storedData = localStorage.getItem(`contract_${bookingId}`);
      if (storedData) {
        setContractData(JSON.parse(storedData));
      } else {
        setError('Contract data not found. Please complete your booking first.');
      }
    } else {
      setError('No booking ID provided.');
    }
    
    setIsLoading(false);
  }, []);

  const handleContractComplete = async (data: any) => {
    console.log('Contract signed:', data);
    
    // Send contract completion to your API
    try {
      const response = await fetch('/api/contract/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: contractData?.bookingId,
          contractData: data,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // Redirect to payment page
        window.location.href = `/payment?bookingId=${contractData?.bookingId}&paymentLink=${result.paymentLink}`;
      } else {
        setError('Failed to process contract. Please try again.');
      }
    } catch (error) {
      console.error('Contract completion error:', error);
      setError('An error occurred. Please contact us for assistance.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contract...</p>
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
            <h2 className="text-xl font-bold text-red-800 mb-2">Contract Error</h2>
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

  if (!contractData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="text-yellow-600 text-4xl mb-4">📋</div>
            <h2 className="text-xl font-bold text-yellow-800 mb-2">No Contract Data</h2>
            <p className="text-yellow-600 mb-4">Please complete your booking first to access the contract.</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center space-x-2 cursor-pointer">
              <span className="text-2xl">🐾</span>
              <h1 className="text-2xl font-bold text-purple-900">Contract Signing</h1>
            </a>
            <div className="text-sm text-gray-600">
              Booking ID: {contractData.bookingId}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Contract Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-purple-900 mb-4">📋 Service Agreement Summary</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
              <p className="text-gray-600">Name: {contractData.customerName}</p>
              <p className="text-gray-600">Pet: {contractData.petName}</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Appointment Details</h3>
              <p className="text-gray-600">Date: {contractData.appointmentDate}</p>
              <p className="text-gray-600">Time: {contractData.appointmentTime}</p>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold text-gray-900 mb-2">Services</h3>
            <ul className="list-disc list-inside text-gray-600">
              {contractData.services.map((service, index) => (
                <li key={index}>{service}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4 p-4 bg-purple-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-purple-900">Total Amount:</span>
              <span className="text-2xl font-bold text-purple-600">${contractData.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Contract Signing */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-purple-900 mb-4">✍️ Digital Contract Signing</h2>
          <p className="text-gray-600 mb-6">
            Please review and sign the service agreement below. This contract outlines the terms of service for your pet's grooming appointment.
          </p>

          {/* DocuSeal Form Integration */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="text-gray-500 mb-4">
              <div className="text-4xl mb-2">📄</div>
              <p className="text-lg font-medium">Contract Signing Form</p>
              <p className="text-sm">Powered by DocuSeal</p>
            </div>
            
            {/* In production, replace with actual DocuSeal form */}
            <DocusealForm
              src="https://docuseal.com/d/your_document_id" // Replace with your actual document ID
              email={contractData.customerName} // You'd get this from the booking data
              onComplete={handleContractComplete}
            />
            
            {/* Fallback for development */}
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Development Mode:</strong> DocuSeal integration requires API setup. 
                For now, you can proceed with a mock signature.
              </p>
              <button
                onClick={() => handleContractComplete({ signed: true, timestamp: new Date().toISOString() })}
                className="mt-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Mock Sign Contract
              </button>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Terms & Conditions</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• By signing this contract, you agree to the terms of service for Pupperazi Pet Spa.</p>
            <p>• Payment is due upon completion of services unless other arrangements are made.</p>
            <p>• Cancellations must be made at least 24 hours in advance.</p>
            <p>• We reserve the right to refuse service if your pet poses a safety risk.</p>
            <p>• All grooming services are performed at your own risk.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
