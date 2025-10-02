'use client';

import { useState, useRef, useEffect } from 'react';

export default function PhotoBooth() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const startCamera = async () => {
    // Stop existing stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode, width: { ideal: 1080 }, height: { ideal: 1350 } }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera access denied:', err);
      alert('Please allow camera access to use the photo booth!');
    }
  };

  const flipCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to 1080x1350 (4:5 Instagram portrait ratio)
    canvas.width = 1080;
    canvas.height = 1350;

    // Draw video frame - center crop to fill canvas
    const videoAspect = video.videoWidth / video.videoHeight;
    const canvasAspect = canvas.width / canvas.height;
    
    let sx, sy, sWidth, sHeight;
    
    if (videoAspect > canvasAspect) {
      // Video is wider, crop sides
      sHeight = video.videoHeight;
      sWidth = sHeight * canvasAspect;
      sx = (video.videoWidth - sWidth) / 2;
      sy = 0;
    } else {
      // Video is taller, crop top/bottom
      sWidth = video.videoWidth;
      sHeight = sWidth / canvasAspect;
      sx = 0;
      sy = (video.videoHeight - sHeight) / 2;
    }
    
    ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);

    // Draw branded frame overlay
    // Top bar with gradient and Pupperazi branding
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#9b59b6');
    gradient.addColorStop(0.5, '#667eea');
    gradient.addColorStop(1, '#3b82f6');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, 180);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 80px serif';
    ctx.textAlign = 'center';
    ctx.fillText('🐾 Pupperazi Pet Spa', canvas.width / 2, 110);

    // Bottom bar with contact info
    ctx.fillStyle = 'rgba(45, 90, 135, 0.95)';
    ctx.fillRect(0, canvas.height - 140, canvas.width, 140);

    ctx.fillStyle = 'white';
    ctx.font = '48px sans-serif';
    ctx.fillText('📍 Palm Harbor, FL', canvas.width / 2, canvas.height - 85);
    ctx.font = '40px sans-serif';
    ctx.fillText('727-753-9302', canvas.width / 2, canvas.height - 30);

    const imageUrl = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedImage(imageUrl);
  };

  const downloadPhoto = () => {
    if (!capturedImage) return;
    
    try {
      const link = document.createElement('a');
      link.href = capturedImage;
      link.download = `pupperazi-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success message
      alert('Photo saved! Check your downloads folder 📸');
    } catch (err) {
      console.error('Download failed:', err);
      alert('Download failed. Please try again or use the share button.');
    }
  };

  const shareToInstagram = async () => {
    if (!capturedImage) return;

    try {
      // Convert base64 to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const file = new File([blob], 'pupperazi-photo.jpg', { type: 'image/jpeg' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Pupperazi Pet Spa',
          text: 'Check out my photo from Pupperazi Pet Spa! 🐾'
        });
      } else {
        // Fallback: just download
        downloadPhoto();
      }
    } catch (err) {
      console.log('Share cancelled or failed:', err);
      // Offer download as alternative
      if (confirm('Share not available. Download instead?')) {
        downloadPhoto();
      }
    }
  };

  const retake = () => {
    setCapturedImage(null);
  };

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="h-full flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg flex flex-col" style={{ maxHeight: '100vh' }}>
          {/* Header */}
          <div className="text-center mb-4 flex-shrink-0">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">🐾 Pupperazi Photo Booth</h1>
            <p className="text-white/90 text-sm sm:text-base">Snap, Frame & Share!</p>
          </div>

          {/* Camera/Photo View - Fixed aspect ratio container */}
          <div className="flex-shrink-0 mb-4">
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden mx-auto" style={{ width: '100%', maxWidth: '432px', aspectRatio: '4/5' }}>
              {/* Video - always rendered, just hidden when photo captured */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
                style={{ display: capturedImage ? 'none' : 'block' }}
              />
              
              {/* Frame overlays - always show when video is active */}
              {!capturedImage && (
                <>
                  {/* Bottom overlay */}
                  <div className="absolute bottom-0 left-0 right-0 text-center py-2 sm:py-3 z-10" style={{ backgroundColor: 'rgba(45, 90, 135, 0.95)' }}>
                    <p className="text-white font-semibold text-base sm:text-lg">📍 Palm Harbor, FL</p>
                    <p className="text-white text-sm sm:text-base">727-753-9302</p>
                  </div>
                </>
              )}
              
              {/* Captured photo - show when available */}
              {capturedImage && (
                <img src={capturedImage} alt="Captured" className="absolute inset-0 w-full h-full object-cover z-20" />
              )}
            </div>
          </div>

          <canvas ref={canvasRef} className="hidden" />

          {/* Controls */}
          <div className="flex-shrink-0">
            {!capturedImage ? (
              <div className="space-y-3">
                <button
                  onClick={capturePhoto}
                  className="w-full py-3 sm:py-4 rounded-full text-lg sm:text-xl font-bold shadow-lg transform active:scale-95 transition-transform"
                  style={{ backgroundColor: '#C8E5F0', color: '#2D5A87' }}
                >
                  📸 Capture Photo
                </button>
                <button
                  onClick={flipCamera}
                  className="w-full py-2 sm:py-3 rounded-full text-sm sm:text-base font-semibold"
                  style={{ backgroundColor: 'rgba(255,255,255,0.3)', color: 'white', border: '2px solid white' }}
                >
                  🔄 Flip Camera
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={shareToInstagram}
                  className="w-full py-3 sm:py-4 rounded-full text-lg sm:text-xl font-bold shadow-lg transform active:scale-95 transition-transform"
                  style={{ background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)', color: 'white' }}
                >
                  📤 Share!
                </button>
                <button
                  onClick={downloadPhoto}
                  className="w-full py-3 sm:py-4 rounded-full text-lg sm:text-xl font-bold shadow-lg transform active:scale-95 transition-transform"
                  style={{ backgroundColor: '#C8E5F0', color: '#2D5A87' }}
                >
                  🖼️ Save!
                </button>
                <button
                  onClick={retake}
                  className="w-full py-2 sm:py-3 rounded-full text-sm sm:text-base font-semibold"
                  style={{ backgroundColor: 'rgba(255,255,255,0.3)', color: 'white', border: '2px solid white' }}
                >
                  🔄 Retake Photo
                </button>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="mt-4 text-center flex-shrink-0">
            <p className="text-white/80 text-xs sm:text-sm">
              Visit us at 3454 Tampa Rd, Palm Harbor, FL 34684
            </p>
            <a href="/" className="text-white text-xs sm:text-sm underline mt-1 inline-block">
              Learn more about Pupperazi Pet Spa
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

