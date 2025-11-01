'use client';

import { useState } from 'react';

export default function QRCodePage() {
  const [url, setUrl] = useState('https://pupperazipetspa.com/photo-booth');

  return (
    <div className="min-h-screen p-8" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="text-4xl font-bold text-center mb-4" style={{ color: '#2D5A87' }}>
            🐾 Pupperazi Photo Booth QR Code
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Generate a QR code for your in-store photo booth!
          </p>

          {/* URL Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2" style={{ color: '#2D5A87' }}>
              Photo Booth URL:
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-3 border-2 rounded-lg"
              style={{ borderColor: '#2D5A87' }}
            />
          </div>

          {/* QR Code Display */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-6">
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-lg shadow-xl mb-4">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(url)}`}
                  alt="QR Code"
                  className="w-full h-auto"
                  style={{ maxWidth: '400px' }}
                />
              </div>
              <a
                href={`https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(url)}`}
                download="pupperazi-qr-code.png"
                className="px-8 py-3 rounded-full font-bold text-lg shadow-lg"
                style={{ backgroundColor: '#C8E5F0', color: '#2D5A87' }}
              >
                📥 Download High-Res QR Code
              </a>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4" style={{ color: '#2D5A87' }}>
              📋 How to Use:
            </h3>
            <ol className="space-y-2 text-gray-700 ml-4">
              <li>✅ Click "Download High-Res QR Code" above</li>
              <li>🖨️ Print it at least 4"x4" size (bigger is better!)</li>
              <li>📍 Place in store where customers can easily scan it</li>
              <li>📸 Customers scan → take photo → share on Instagram!</li>
            </ol>
            
            <div className="mt-4 p-3 bg-white rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>URL:</strong> <code className="text-xs">{url}</code>
              </p>
            </div>

            <div className="mt-6 p-4 bg-purple-100 rounded-lg">
              <h4 className="font-bold mb-2" style={{ color: '#2D5A87' }}>💡 Pro Tips:</h4>
              <ul className="space-y-1 text-sm text-gray-700 ml-4">
                <li>• Add signage: "📸 Snap & Share! Scan for your Pupperazi photo"</li>
                <li>• Place near checkout or waiting area</li>
                <li>• Encourage sharing with #PupperaziPetSpa</li>
                <li>• Test the QR code before printing!</li>
              </ul>
            </div>

            <div className="mt-6 text-center">
              <a
                href="/photo-booth"
                className="inline-block px-6 py-3 rounded-full font-semibold"
                style={{ backgroundColor: '#2D5A87', color: 'white' }}
              >
                🎥 Test Photo Booth
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

