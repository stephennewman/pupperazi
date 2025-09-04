import LeadCaptureForm from '@/components/LeadCaptureForm';

export default function LeadsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-purple-900">Pupperazi Pet Spa</h1>
              <p className="text-gray-600">Professional Pet Grooming & Care</p>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-700 hover:text-purple-600 transition-colors">Home</a>
              <a href="/booking" className="text-gray-700 hover:text-purple-600 transition-colors">Book Now</a>
              <a href="/proposal" className="text-gray-700 hover:text-purple-600 transition-colors">Services</a>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-purple-900 mb-4">
            Request Your Pet's Appointment 🐕‍🦺
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Tell us about your furry friend and we'll help you schedule the perfect appointment.
            You'll receive email confirmation, and our team gets instant SMS notification to respond quickly!
          </p>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📧</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email Confirmation</h3>
              <p className="text-gray-600 text-sm">Receive detailed information about our services via email</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Team Notification</h3>
              <p className="text-gray-600 text-sm">Our team receives instant SMS notification (617-347-2721) to respond quickly</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Quick Response</h3>
              <p className="text-gray-600 text-sm">Our team responds within 24 hours to your inquiry</p>
            </div>
          </div>
        </div>

        {/* Lead Capture Form */}
        <LeadCaptureForm />

        {/* Additional Information */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-purple-900 mb-6">
              Why Choose Pupperazi Pet Spa?
            </h3>

            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">🏆 Professional Service</h4>
                <p className="text-gray-600 mb-4">
                  Our certified groomers have years of experience working with all breeds and sizes of dogs.
                  We use only premium, pet-safe products and techniques.
                </p>

                <h4 className="font-semibold text-gray-900 mb-3">🧼 Premium Products</h4>
                <p className="text-gray-600 mb-4">
                  We use high-quality, hypoallergenic shampoos, conditioners, and grooming products
                  that keep your pet's coat healthy and shiny.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">🏠 Convenient Location</h4>
                <p className="text-gray-600 mb-4">
                  Located in the heart of the city with easy parking and flexible appointment times
                  to fit your busy schedule.
                </p>

                <h4 className="font-semibold text-gray-900 mb-3">💝 Pet-First Approach</h4>
                <p className="text-gray-600 mb-4">
                  Your pet's comfort and safety are our top priorities. We take extra care with
                  anxious pets and provide a stress-free environment.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-gray-600">
                <strong>Questions?</strong> Feel free to call us at <a href="tel:555-123-PAWS" className="text-purple-600 hover:text-purple-700">(555) 123-PAWS</a> or
                email <a href="mailto:contact@krezzo.com" className="text-purple-600 hover:text-purple-700">contact@krezzo.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Pupperazi Pet Spa</h3>
              <p className="text-gray-300">
                Professional pet grooming services with a personal touch.
                Your pet's happiness is our passion!
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Professional Grooming</li>
                <li>Bath & Spa Treatments</li>
                <li>Pet Boarding</li>
                <li>Doggy Daycare</li>
                <li>Training Classes</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-300">
                <li>📧 contact@krezzo.com</li>
                <li>📞 (555) 123-PAWS</li>
                <li>🏠 123 Pet Street, Pawstown, PA 12345</li>
                <li>🕒 Mon-Sat: 8AM-6PM</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Pupperazi Pet Spa. All rights reserved. Made with 🐾 for pets everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
