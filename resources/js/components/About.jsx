import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            About Unison Tour
          </h1>
          <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto">
            Pioneering sustainable tourism for a better tomorrow
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              At Unison Tour, we believe that exploring the world shouldn't come at the expense of our planet. 
              Our mission is to make sustainable travel accessible, enjoyable, and impactful for everyone.
            </p>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              We partner with eco-conscious service providers worldwide to offer authentic experiences that 
              respect local communities, preserve natural habitats, and minimize environmental impact.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Every journey booked through Unison Tour contributes to conservation efforts and supports 
              sustainable tourism initiatives around the globe.
            </p>
          </div>
          <div className="relative">
            <div className="aspect-w-16 aspect-h-12 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop" 
                alt="Sustainable Tourism" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-green-500 text-white p-6 rounded-xl shadow-lg">
              <p className="text-3xl font-bold">10K+</p>
              <p className="text-sm">Eco-Travelers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gradient-to-r from-green-100 to-blue-100 py-16 my-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Sustainability</h3>
              <p className="text-gray-600">
                We prioritize eco-friendly practices in every aspect of travel, from carbon-neutral 
                transportation to zero-waste accommodations.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Community</h3>
              <p className="text-gray-600">
                We support local communities by partnering with indigenous guides, local artisans, 
                and community-owned businesses.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Authenticity</h3>
              <p className="text-gray-600">
                We curate genuine experiences that connect travelers with nature and culture in 
                meaningful, respectful ways.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Our Impact
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-8 shadow-lg">
            <p className="text-5xl font-bold mb-2">50+</p>
            <p className="text-lg">Countries Covered</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-8 shadow-lg">
            <p className="text-5xl font-bold mb-2">500+</p>
            <p className="text-lg">Eco-Partners</p>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-blue-600 text-white rounded-2xl p-8 shadow-lg">
            <p className="text-5xl font-bold mb-2">10K+</p>
            <p className="text-lg">Happy Travelers</p>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-green-600 text-white rounded-2xl p-8 shadow-lg">
            <p className="text-5xl font-bold mb-2">1M+</p>
            <p className="text-lg">Trees Planted</p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
            Meet Our Team
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Passionate environmental advocates and travel experts dedicated to making sustainable tourism the norm.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Johnson', role: 'Founder & CEO', image: 'https://i.pravatar.cc/300?img=1' },
              { name: 'Michael Chen', role: 'Head of Sustainability', image: 'https://i.pravatar.cc/300?img=13' },
              { name: 'Emma Williams', role: 'Travel Experience Director', image: 'https://i.pravatar.cc/300?img=5' }
            ].map((member, idx) => (
              <div key={idx} className="text-center">
                <div className="relative inline-block mb-4">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-40 h-40 rounded-full object-cover mx-auto shadow-lg"
                  />
                  <div className="absolute bottom-0 right-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                <p className="text-green-600 font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Travel Sustainably?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of eco-conscious travelers making a positive impact on the planet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/" 
              className="px-8 py-4 bg-white text-green-600 rounded-xl font-bold text-lg hover:bg-green-50 transition-colors shadow-lg"
            >
              Explore Destinations
            </a>
            <a 
              href="/contact" 
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-green-600 transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

