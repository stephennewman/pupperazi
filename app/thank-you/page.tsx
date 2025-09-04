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
          Your message has been sent successfully! We've received your inquiry and will get back to you within 24 hours.
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
                <strong>You'll receive an email confirmation</strong> at the address you provided
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 text-sm font-bold">2</span>
              </div>
              <p className="text-gray-700">
                <strong>Our team will review your message</strong> and prepare a personalized response
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 text-sm font-bold">3</span>
              </div>
              <p className="text-gray-700">
                <strong>We'll contact you within 24 hours</strong> via your preferred method
              </p>
            </div>
          </div>
        </div>

        {/* Contact Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
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

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                📧
              </div>
              <h3 className="text-lg font-semibold text-purple-900">Email Us</h3>
            </div>
            <p className="text-gray-600 mb-3">
              Send us an email anytime - we respond quickly!
            </p>
            <a
              href="mailto:stephen.p.newman@gmail.com"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              📧 stephen.p.newman@gmail.com
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            🏠 Back to Home
          </Link>

          <Link
            href="/booking"
            className="bg-white hover:bg-gray-50 text-purple-600 px-8 py-3 rounded-full font-semibold transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border-2 border-purple-600"
          >
            📅 Book Appointment
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Need immediate assistance or have urgent questions?
          </p>
          <p className="text-sm text-gray-500">
            We're here to help! Our team is available during business hours:
            <br />
            <strong>Tuesday - Friday: 8:00 AM - 5:30 PM | Saturday: 8:00 AM - 5:00 PM</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
