'use client';

import { useState } from 'react';
import LeadCaptureForm from './LeadCaptureForm';

interface LeadPopupProps {
  isOpen: boolean;
  onClose: () => void;
  triggerText?: string;
}

export default function LeadPopup({ isOpen, onClose, triggerText = "Request Appointment 🐾" }: LeadPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity cursor-pointer"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl transform transition-all">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
            aria-label="Close popup"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="p-8">
            <LeadCaptureForm onSuccess={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Trigger Button Component
export function LeadPopupTrigger({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={className}
      >
        {children}
      </button>
      <LeadPopup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
