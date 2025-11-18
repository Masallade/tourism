import React, { useState, useEffect } from 'react';

const About = () => {
  const [aboutPage, setAboutPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutPage();
  }, []);

  const fetchAboutPage = async () => {
    try {
      const response = await window.apiClient.get('/api/about-page');
      setAboutPage(response.data);
    } catch (error) {
      console.error('Error fetching about page:', error);
    } finally {
      setLoading(false);
    }
  };

  // Default values if no data is loaded
  const defaultData = {
    hero_title: 'About Unison Tour',
    hero_subtitle: 'Pioneering sustainable tourism for a better tomorrow',
    hero_image: null,
    mission_title: 'Our Mission',
    mission_description: `At Unison Tour, we believe that exploring the world shouldn't come at the expense of our planet. 
Our mission is to make sustainable travel accessible, enjoyable, and impactful for everyone.

We partner with eco-conscious service providers worldwide to offer authentic experiences that 
respect local communities, preserve natural habitats, and minimize environmental impact.

Every journey booked through Unison Tour contributes to conservation efforts and supports 
sustainable tourism initiatives around the globe.`,
    mission_image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop',
    mission_stat_number: '10K+',
    mission_stat_label: 'Eco-Travelers',
    values_title: 'Our Core Values',
    values: [
      { title: 'Sustainability', description: 'We prioritize eco-friendly practices in every aspect of travel, from carbon-neutral transportation to zero-waste accommodations.' },
      { title: 'Community', description: 'We support local communities by partnering with indigenous guides, local artisans, and community-owned businesses.' },
      { title: 'Authenticity', description: 'We curate genuine experiences that connect travelers with nature and culture in meaningful, respectful ways.' }
    ],
    impact_title: 'Our Impact',
    impact_stat_1_number: '50+',
    impact_stat_2_number: '500+',
    impact_stat_3_number: '10K+',
    impact_stat_4_number: '1M+',
    team_title: 'Meet Our Team',
    team_description: 'Passionate environmental advocates and travel experts dedicated to making sustainable tourism the norm.',
    team_members: [
      { name: 'Sarah Johnson', role: 'Founder & CEO', image: 'https://i.pravatar.cc/300?img=1' },
      { name: 'Michael Chen', role: 'Head of Sustainability', image: 'https://i.pravatar.cc/300?img=13' },
      { name: 'Emma Williams', role: 'Travel Experience Director', image: 'https://i.pravatar.cc/300?img=5' }
    ],
    cta_title: 'Ready to Travel Sustainably?',
    cta_description: 'Join thousands of eco-conscious travelers making a positive impact on the planet.',
  };

  const data = aboutPage || defaultData;
  const teamMembers = data.team_members && Array.isArray(data.team_members) && data.team_members.length > 0 
    ? data.team_members 
    : defaultData.team_members;

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `/storage/${imagePath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative w-full" style={{ aspectRatio: '16/5', minHeight: '400px' }}>
        {data.hero_image ? (
          <>
            <img 
              src={getImageUrl(data.hero_image)} 
              alt="Hero" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black opacity-10"></div>
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600"></div>
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center text-center z-10">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-white">
              {data.hero_title || 'About Unison Tour'}
            </h1>
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto">
              {data.hero_subtitle || 'Pioneering sustainable tourism for a better tomorrow'}
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Section - Text Content */}
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              {data.mission_title || 'Our Mission'}
            </h2>
            {data.mission_description ? (
              <div className="text-lg text-gray-600 leading-relaxed">
                {data.mission_description.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4 last:mb-0">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
          
          {/* Right Section - Image with Stat Box */}
          <div className="relative">
            {data.mission_image && (
              <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-800" style={{ aspectRatio: '4/3' }}>
                <img 
                  src={getImageUrl(data.mission_image)} 
                  alt="Sustainable Tourism" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {(data.mission_stat_number || data.mission_stat_label) && (
              <div className="absolute -bottom-6 -left-6 bg-green-500 text-white p-6 rounded-xl shadow-lg z-10">
                <p className="text-3xl font-bold">{data.mission_stat_number || ''}</p>
                <p className="text-sm">{data.mission_stat_label || ''}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gradient-to-r from-green-100 to-blue-100 py-16 my-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            {data.values_title || 'Our Core Values'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(data.values && Array.isArray(data.values) && data.values.length > 0 ? data.values : defaultData.values)
              .filter(value => value.title && value.description)
              .map((value, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
              </div>
              ))}
          </div>
        </div>
      </div>

      {/* Impact Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          {data.impact_title || 'Our Impact'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {[
            { number: data.impact_stat_1_number, label: 'Countries Covered', gradient: 'from-green-500 to-green-600' },
            { number: data.impact_stat_2_number, label: 'Eco-Partners', gradient: 'from-blue-500 to-blue-600' },
            { number: data.impact_stat_3_number, label: 'Happy Travelers', gradient: 'from-green-600 to-blue-600' },
            { number: data.impact_stat_4_number, label: 'Trees Planted', gradient: 'from-blue-600 to-green-600' }
          ].filter(stat => stat.number).map((stat, idx) => (
            <div key={idx} className={`bg-gradient-to-br ${stat.gradient} text-white rounded-2xl p-8 shadow-lg`}>
              <p className="text-5xl font-bold mb-2">{stat.number}</p>
              <p className="text-lg">{stat.label}</p>
          </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
            {data.team_title || 'Meet Our Team'}
          </h2>
          {data.team_description && (
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              {data.team_description}
          </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.filter(member => member.name && member.role).map((member, idx) => (
              <div key={idx} className="text-center">
                <div className="relative inline-block mb-4">
                  {member.image && (
                    <div className="w-40 h-40 rounded-full overflow-hidden shadow-lg mx-auto" style={{ aspectRatio: '1/1' }}>
                      <img 
                        src={getImageUrl(member.image)} 
                        alt={member.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
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
      <div className="relative overflow-hidden">
        {/* Gradient Background with Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-green-500 to-blue-600"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        {/* Content */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="mb-8">
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6 text-white drop-shadow-lg">
              {data.cta_title || 'Ready to Travel Sustainably?'}
            </h2>
            {data.cta_description && (
              <p className="text-xl md:text-2xl text-green-50 max-w-3xl mx-auto leading-relaxed">
                {data.cta_description}
              </p>
            )}
          </div>
          
          {/* Buttons with enhanced styling */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mt-10">
            <a 
              href="/" 
              className="group relative px-10 py-5 bg-white text-green-600 rounded-2xl font-bold text-lg hover:bg-green-50 transition-all duration-300 shadow-2xl hover:shadow-green-200 hover:scale-105 transform"
            >
              <span className="relative z-10 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Explore Destinations
              </span>
            </a>
            <a 
              href="/contact" 
              className="group relative px-10 py-5 bg-blue-600 border-3 border-white text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all duration-300 shadow-2xl hover:shadow-blue-200 hover:scale-105 transform"
            >
              <span className="relative z-10 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Get in Touch
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

