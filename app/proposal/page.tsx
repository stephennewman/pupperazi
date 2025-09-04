'use client';

export default function ProposalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Website Migration Proposal
            </h1>
            <h2 className="text-xl md:text-2xl text-gray-600">
              Move off Wix with SEO Preservation
            </h2>
          </div>

          {/* Introduction */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-l-4" style={{borderLeftColor: '#2D5A87'}}>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Hi Melissa,
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Thank you for the opportunity to put this together. As a customer of Pupperazi, I really value the service you provide 
              and I'm excited about the chance to help your business grow.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Below is a very simple proposal package. I've kept the cost lower than your current Wix subscription, with a small upfront 
              setup cost to cover tooling and time. There's some other items we'll want to discuss when the time is right, but for now 
              this gets the ball rolling.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Feel free to call or text me at 617-347-2721 or email me at stephen@krezzo.com with any questions.
            </p>
            <div className="mt-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                Best,<br/>
                Stephen
              </p>
            </div>
          </div>

          {/* Overview */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Overview</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              We'll migrate your site from Wix, map the contact form so notifications work exactly the same as today, 
              and preserve your SEO so there's no drop-off in your search rankings. The goal is a seamless transition 
              that maintains everything that's working while giving you more control and flexibility.
            </p>
          </div>

          {/* Proposal Options */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Proposal Options</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Option 1 */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-transparent hover:border-blue-200 transition-colors">
                <div className="text-center mb-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Option 1</h4>
                  <h5 className="text-lg font-semibold" style={{color: '#2D5A87'}}>
                    Basic Migration + Care Subscription
                  </h5>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-700">Map contact form and ensure notifications match current behavior</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-700">Preserve current SEO (no ranking drop-off)</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-700">Migrate from Wix and verify everything works</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-700">Ongoing fixes and small changes</span>
                  </li>
                </ul>
                
                <div className="border-t pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2" style={{color: '#2D5A87'}}>$200</div>
                    <div className="text-gray-600 mb-3">one-time setup</div>
                    <div className="text-2xl font-bold mb-2" style={{color: '#2D5A87'}}>$25/month</div>
                    <div className="text-sm text-gray-600 mb-2">subscription</div>
                    <div className="text-xs text-gray-500 leading-tight">
                      Includes up to 1 hour/month for updates/changes/fixes (unused time rolls over)<br/>
                      Additional time needed can be billed at flat rate of $50/hr
                    </div>
                  </div>
                </div>
              </div>

              {/* Option 2 */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-transparent hover:border-blue-200 transition-colors">
                <div className="text-center mb-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Option 2</h4>
                  <h5 className="text-lg font-semibold" style={{color: '#2D5A87'}}>
                    Results-as-a-Service (Performance Model)
                  </h5>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-700">Agree on success criteria (e.g., booked appointments)</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-700">Establish baseline performance</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-700">Compensation tied to improvements above baseline</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-700">More creative freedom for offers, UX, and optional social/ads</span>
                  </li>
                </ul>
                
                <div className="border-t pt-6">
                  <div className="text-center">
                    <div className="text-lg font-semibold mb-3" style={{color: '#2D5A87'}}>
                      Flexible model: small setup + performance-based payments
                    </div>
                    <div className="text-sm text-gray-500 italic">
                      To be discussed and can try in a few months, just highlighting the idea :)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="rounded-2xl shadow-lg p-8 text-center" style={{backgroundColor: '#3D6B9F', color: 'white'}}>
            <h3 className="text-2xl font-bold mb-4">Ready to Discuss?</h3>
            <p className="text-blue-100 mb-6">
              Let's schedule a call to go over the details and answer any questions you might have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:617-347-2721"
                className="px-8 py-3 rounded-full font-semibold transition-colors cursor-pointer"
                style={{backgroundColor: '#C8E5F0', color: '#2D5A87'}}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#B5D9E8'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#C8E5F0'}
              >
                Call: 617-347-2721
              </a>
              <a 
                href="mailto:stephen@krezzo.com"
                className="px-8 py-3 rounded-full font-semibold transition-colors cursor-pointer border-2 border-blue-200 hover:bg-blue-200 hover:text-blue-800"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}