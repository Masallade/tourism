import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-4">
            Terms and Conditions
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: <span className="font-semibold text-gray-800">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Content */}
          <div className="p-8 md:p-12 space-y-10">
            {/* Acceptance of Terms */}
            <section className="border-l-4 border-green-500 pl-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800">1. Acceptance of Terms</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                By accessing and using the <span className="font-semibold text-green-600">Unison Tour</span> website and services, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this service.
              </p>
            </section>

            {/* Use License */}
            <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800">2. Use License</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                Permission is granted to temporarily access the materials on Unison Tour's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  'Modify or copy the materials',
                  'Use the materials for any commercial purpose or for any public display',
                  'Attempt to reverse engineer any software contained on the website',
                  'Remove any copyright or other proprietary notations from the materials'
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 bg-white p-4 rounded-lg shadow-sm">
                    <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Booking and Reservations */}
            <section>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800">3. Booking and Reservations</h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-green-50 rounded-xl p-5 border-l-4 border-green-500">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    3.1 Booking Process
                  </h3>
              <p className="text-gray-700 leading-relaxed">
                    When you make a booking through our platform, you are entering into a contract with the service provider. Unison Tour acts as an intermediary between you and the service provider, facilitating the booking process and ensuring a smooth transaction.
                  </p>
                </div>

                <div className="bg-blue-50 rounded-xl p-5 border-l-4 border-blue-500">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    3.2 Pricing
                  </h3>
              <p className="text-gray-700 leading-relaxed">
                    All prices displayed on our website are subject to change without notice. Prices are confirmed at the time of booking. We reserve the right to correct any pricing errors, and if such an error occurs, we will notify you and provide options to proceed at the correct price or cancel your booking.
                  </p>
                </div>

                <div className="bg-purple-50 rounded-xl p-5 border-l-4 border-purple-500">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    3.3 Payment
                  </h3>
              <p className="text-gray-700 leading-relaxed">
                    Payment must be made in full at the time of booking unless otherwise specified. We accept various payment methods as displayed during checkout, including credit cards, debit cards, and other secure payment options.
              </p>
                </div>
              </div>
            </section>

            {/* Cancellation and Refund */}
            <section className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800">4. Cancellation and Refund Policy</h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-5">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">4.1 Cancellation by Customer</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Cancellation policies vary by service provider. Generally:
              </p>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-gray-700">Cancellations made <strong>48 hours or more</strong> before the service date may be eligible for a full or partial refund</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <p className="text-gray-700">Cancellations made <strong>less than 48 hours</strong> before the service date may not be eligible for a refund</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-700">Refunds will be processed to the original payment method within <strong>5-10 business days</strong></p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Cancellation by Service Provider</h3>
              <p className="text-gray-700 leading-relaxed">
                    If a service provider cancels your booking, you will receive a <strong className="text-green-600">full refund</strong> or alternative arrangements will be made at no additional cost. We will notify you immediately and assist in finding suitable alternatives.
              </p>
                </div>
              </div>
            </section>

            {/* User Accounts */}
            <section>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800">5. User Accounts</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                To access certain features of our website, you may be required to create an account. You are responsible for:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  'Maintaining the confidentiality of your account credentials',
                  'All activities that occur under your account',
                  'Providing accurate and complete information',
                  'Notifying us immediately of any unauthorized use of your account'
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-indigo-600 font-bold text-sm">{index + 1}</span>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Service Provider Responsibilities */}
            <section className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800">6. Service Provider Responsibilities</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                Service providers listed on our platform are independent entities. They are responsible for:
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  'Providing accurate information about their services',
                  'Delivering services as described',
                  'Maintaining appropriate licenses and insurance',
                  'Complying with all applicable laws and regulations'
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm">
                    <svg className="w-5 h-5 text-teal-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Limitation of Liability */}
            <section className="bg-red-50 rounded-xl p-6 border-l-4 border-red-500">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800">7. Limitation of Liability</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                Unison Tour acts as an intermediary platform and is not liable for:
              </p>
              <div className="space-y-3">
                {[
                  'Any loss, injury, or damage arising from the use of services booked through our platform',
                  'Delays, cancellations, or changes made by service providers',
                  'Any disputes between users and service providers',
                  'Technical issues or interruptions to our website'
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 bg-white p-4 rounded-lg">
                    <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800">8. Intellectual Property</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                All content on this website, including text, graphics, logos, images, and software, is the property of Unison Tour or its content suppliers and is protected by copyright and other intellectual property laws. Unauthorized use of any content may violate copyright, trademark, and other laws.
              </p>
            </section>

            {/* Prohibited Uses */}
            <section className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800">9. Prohibited Uses</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">You may not use our website:</p>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  'For any unlawful purpose or to solicit others to perform unlawful acts',
                  'To violate any international, federal, provincial, or state regulations, rules, or laws',
                  'To infringe upon or violate our intellectual property rights or the intellectual property rights of others',
                  'To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate',
                  'To submit false or misleading information',
                  'To upload or transmit viruses or any other type of malicious code'
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 bg-white p-4 rounded-lg shadow-sm">
                    <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews and Content */}
            <section>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800">10. Reviews and Content</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                Users may post reviews and content on our platform. By posting content, you grant us a non-exclusive, royalty-free, perpetual, and worldwide license to use, modify, and display such content. You are responsible for ensuring your content does not violate any laws or infringe on any rights. We reserve the right to remove any content that violates these terms.
              </p>
            </section>

            {/* Modifications to Terms */}
            <section className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-800">11. Modifications to Terms</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these terms at any time to reflect changes in our services, legal requirements, or for other reasons. We will notify users of any material changes by posting the new Terms and Conditions on this page and updating the "Last updated" date. Your continued use of our services after such modifications constitutes acceptance of the updated terms.
              </p>
            </section>

            {/* Governing Law */}
            <section className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-800">12. Governing Law</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                These Terms and Conditions shall be governed by and construed in accordance with the laws of the jurisdiction in which Unison Tour operates, without regard to its conflict of law provisions. Any disputes arising from these terms or your use of our services shall be resolved in the appropriate courts of that jurisdiction.
              </p>
            </section>
              </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 text-center">
            <p className="text-lg mb-2">Have questions about our Terms and Conditions?</p>
            <Link to="/contact" className="inline-block bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
