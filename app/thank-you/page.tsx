import Link from 'next/link';

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Main Message */}
        <h1 className="text-4xl sm:text-5xl font-bold text-purple-900 mb-6">
          Thank You! 🎉
        </h1>

        <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Your request has been sent successfully! We've received your inquiry and will get back to you within one business day, likely much sooner.
        </p>

        {/* Contact Info */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-purple-900 mb-4">
            What Happens Next?
          </h2>
          <div className="space-y-3 text-left">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 text-sm font-bold">1</span>
              </div>
              <p className="text-gray-700">
                <strong>Your request is being logged</strong> by our system
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 text-sm font-bold">2</span>
              </div>
              <p className="text-gray-700">
                <strong>Our team will review your request</strong> and prepare a personalized response
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 text-sm font-bold">3</span>
              </div>
              <p className="text-gray-700">
                <strong>We'll contact you to confirm details</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Contact Options */}
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                📞
              </div>
              <h3 className="text-lg font-semibold text-purple-900">Call Us</h3>
            </div>
            <p className="text-gray-600 mb-3">
              Prefer to speak directly? Give us a call!
            </p>
            <a
              href="tel:727-753-9302"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              📞 (727) 753-9302
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center items-center">
          <Link
            href="/"
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            🏠 Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
