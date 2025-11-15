import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: <span className="font-semibold text-gray-800">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Content */}
          <div className="p-8 md:p-12 space-y-10">
            {/* Introduction */}
            <section className="border-l-4 border-green-500 pl-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800">1. Introduction</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                Welcome to <span className="font-semibold text-green-600">Unison Tour</span> ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience on our website and in using our services. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our tourism platform.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800">2. Information We Collect</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    2.1 Personal Information
                  </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may collect personal information that you voluntarily provide to us when you:
              </p>
                  <div className="grid md:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-start space-x-3 bg-white p-4 rounded-lg shadow-sm">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-gray-700">Register for an account</span>
                    </div>
                    <div className="flex items-start space-x-3 bg-white p-4 rounded-lg shadow-sm">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span className="text-gray-700">Book travel services or tours</span>
                    </div>
                    <div className="flex items-start space-x-3 bg-white p-4 rounded-lg shadow-sm">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-700">Subscribe to our newsletter</span>
                    </div>
                    <div className="flex items-start space-x-3 bg-white p-4 rounded-lg shadow-sm">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      <span className="text-gray-700">Contact us through forms</span>
                    </div>
                  </div>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                    <p className="text-gray-700">
                      <strong className="text-blue-800">This information may include:</strong> your name, email address, phone number, mailing address, payment information, and travel preferences.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    2.2 Automatically Collected Information
                  </h3>
              <p className="text-gray-700 leading-relaxed">
                    When you visit our website, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device. This helps us improve your experience and provide personalized content.
              </p>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800">3. How We Use Your Information</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">We use the information we collect to:</p>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  'Process and manage your bookings and reservations',
                  'Send you booking confirmations and travel updates',
                  'Respond to your inquiries and provide customer support',
                  'Send you marketing communications (with your consent)',
                  'Improve our website and services',
                  'Detect and prevent fraud or abuse',
                  'Comply with legal obligations'
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Information Sharing */}
            <section className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800">4. Information Sharing and Disclosure</h2>
              </div>
              <div className="bg-white rounded-xl p-6 mb-4">
                <p className="text-lg font-semibold text-green-700 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  We do not sell your personal information.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">We may share your information with:</p>
                <div className="space-y-3">
                  {[
                    { title: 'Service Providers', desc: 'Third-party companies that help us operate our website and provide services (e.g., payment processors, email service providers)' },
                    { title: 'Travel Partners', desc: 'Service providers, tour operators, and accommodation providers to fulfill your bookings' },
                    { title: 'Legal Requirements', desc: 'When required by law or to protect our rights and safety' }
                  ].map((item, index) => (
                    <div key={index} className="border-l-4 border-green-400 pl-4 py-2 bg-white rounded">
                      <h4 className="font-semibold text-gray-800 mb-1">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800">5. Data Security</h2>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border-l-4 border-red-500">
                <p className="text-gray-700 leading-relaxed text-lg">
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security audits. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                </p>
              </div>
            </section>

            {/* Your Rights */}
            <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800">6. Your Rights</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">You have the right to:</p>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  'Access your personal information',
                  'Correct inaccurate or incomplete information',
                  'Request deletion of your personal information',
                  'Object to processing of your personal information',
                  'Request restriction of processing',
                  'Data portability',
                  'Withdraw consent at any time'
                ].map((right, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-indigo-600 font-bold text-sm">{index + 1}</span>
                    </div>
                    <span className="text-gray-700">{right}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Cookies */}
            <section>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800">7. Cookies and Tracking Technologies</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies help us provide you with a better experience by remembering your preferences and analyzing how you use our site. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
              </p>
            </section>

            {/* Third-Party Links */}
            <section className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-800">8. Third-Party Links</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review the privacy policies of any third-party sites you visit to understand how they collect, use, and share your information.
              </p>
            </section>

            {/* Children's Privacy */}
            <section className="bg-pink-50 rounded-xl p-6 border-l-4 border-pink-400">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-pink-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-800">9. Children's Privacy</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal information, please contact us immediately, and we will take steps to delete such information from our records.
              </p>
            </section>

            {/* Changes to Policy */}
            <section className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-800">10. Changes to This Privacy Policy</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                We may update our Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
              </p>
            </section>
              </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 text-center">
            <p className="text-lg mb-2">Have questions about our Privacy Policy?</p>
            <Link to="/contact" className="inline-block bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
