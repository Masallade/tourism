import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

// Values Slider Component
const ValuesSlider = ({ title, values }) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);
  const sliderRef = useRef(null);
  const autoPlayRef = useRef(null);

  // Calculate slides to show based on screen size
  useEffect(() => {
    const updateSlidesToShow = () => {
      if (window.innerWidth >= 1024) {
        setSlidesToShow(3); // Desktop: 3 cards
      } else if (window.innerWidth >= 768) {
        setSlidesToShow(2); // Tablet: 2 cards
      } else {
        setSlidesToShow(1); // Mobile: 1 card
      }
    };

    updateSlidesToShow();
    window.addEventListener('resize', updateSlidesToShow);
    return () => window.removeEventListener('resize', updateSlidesToShow);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (values.length <= slidesToShow) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.max(0, values.length - slidesToShow);
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 4000);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [values.length, slidesToShow]);

  const maxIndex = Math.max(0, values.length - slidesToShow);

  const goToSlide = (index) => {
    let newIndex;
    if (index < 0) {
      newIndex = maxIndex;
    } else if (index > maxIndex) {
      newIndex = 0;
    } else {
      newIndex = index;
    }
    setCurrentIndex(newIndex);
    
    // Reset auto-play timer
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    if (values.length > slidesToShow) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const maxIdx = Math.max(0, values.length - slidesToShow);
          return prev >= maxIdx ? 0 : prev + 1;
        });
      }, 4000);
    }
  };

  const nextSlide = () => {
    const newIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  };
  
  const prevSlide = () => {
    const newIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
    goToSlide(newIndex);
  };

  if (values.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-green-100 to-blue-100 py-16 my-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          {title || t('our_core_values')}
        </h2>

        {/* Slider Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          {values.length > slidesToShow && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200 group"
                aria-label="Previous slide"
              >
                <svg 
                  className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 group-hover:text-green-600 transition-colors" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200 group"
                aria-label="Next slide"
              >
                <svg 
                  className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 group-hover:text-green-600 transition-colors" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Slider Track */}
          <div 
            ref={sliderRef}
            className="overflow-hidden rounded-lg"
          >
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ 
                transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`,
                willChange: 'transform'
              }}
            >
              {values.map((value, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 px-2 sm:px-4"
                  style={{ width: `${100 / slidesToShow}%`, minWidth: `${100 / slidesToShow}%` }}
                >
                  <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full group">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-800">{value.title}</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          {values.length > slidesToShow && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {Array.from({ length: Math.ceil(values.length / slidesToShow) }).map((_, idx) => {
                const dotIndex = idx;
                const slideStartIndex = dotIndex * slidesToShow;
                const isActive = currentIndex >= slideStartIndex && currentIndex < slideStartIndex + slidesToShow;
                return (
                  <button
                    key={idx}
                    onClick={() => goToSlide(slideStartIndex)}
                    className={`transition-all duration-300 rounded-full ${
                      isActive 
                        ? 'w-8 h-2 bg-green-600' 
                        : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Team Slider Component
const TeamSlider = ({ title, description, members, getImageUrl }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);
  const sliderRef = useRef(null);
  const autoPlayRef = useRef(null);

  // Calculate slides to show based on screen size
  useEffect(() => {
    const updateSlidesToShow = () => {
      if (window.innerWidth >= 1024) {
        setSlidesToShow(4); // Desktop: 4 cards
      } else if (window.innerWidth >= 768) {
        setSlidesToShow(3); // Tablet: 3 cards
      } else if (window.innerWidth >= 640) {
        setSlidesToShow(2); // Small tablet: 2 cards
      } else {
        setSlidesToShow(1); // Mobile: 1 card
      }
    };

    updateSlidesToShow();
    window.addEventListener('resize', updateSlidesToShow);
    return () => window.removeEventListener('resize', updateSlidesToShow);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (members.length <= slidesToShow) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.max(0, members.length - slidesToShow);
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 4000); // Change slide every 4 seconds

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [members.length, slidesToShow]);

  const maxIndex = Math.max(0, members.length - slidesToShow);

  const goToSlide = (index) => {
    let newIndex;
    if (index < 0) {
      newIndex = maxIndex;
    } else if (index > maxIndex) {
      newIndex = 0;
    } else {
      newIndex = index;
    }
    setCurrentIndex(newIndex);
    
    // Reset auto-play timer
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    if (members.length > slidesToShow) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const maxIdx = Math.max(0, members.length - slidesToShow);
          return prev >= maxIdx ? 0 : prev + 1;
        });
      }, 4000);
    }
  };

  const nextSlide = () => {
    const newIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  };
  
  const prevSlide = () => {
    const newIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
    goToSlide(newIndex);
  };

  if (members.length === 0) return null;

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
          {title}
        </h2>
        {description && (
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto text-lg leading-relaxed">
            {description}
          </p>
        )}

        {/* Slider Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          {members.length > slidesToShow && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200 group"
                aria-label="Previous slide"
              >
                <svg 
                  className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 group-hover:text-green-600 transition-colors" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200 group"
                aria-label="Next slide"
              >
                <svg 
                  className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 group-hover:text-green-600 transition-colors" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Slider Track */}
          <div 
            ref={sliderRef}
            className="overflow-hidden rounded-lg"
          >
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ 
                transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`,
                willChange: 'transform'
              }}
            >
              {members.map((member, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 px-2 sm:px-4"
                  style={{ width: `${100 / slidesToShow}%`, minWidth: `${100 / slidesToShow}%` }}
                >
                  <div className="text-center group">
                    <div className="relative inline-block mb-4">
                      {member.image ? (
                        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden shadow-lg mx-auto transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl" style={{ aspectRatio: '1/1' }}>
                          <img 
                            src={getImageUrl(member.image)} 
                            alt={member.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-green-400 to-blue-400 shadow-lg mx-auto flex items-center justify-center text-white text-2xl font-bold transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl">
                          {member.name ? member.name.charAt(0).toUpperCase() : '?'}
                        </div>
                      )}
                      <div className="absolute bottom-0 right-0 w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                    {(member.role || member.description) && (
                      <p className="text-sm sm:text-base text-green-600 font-medium">{member.role || member.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          {members.length > slidesToShow && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {Array.from({ length: Math.ceil(members.length / slidesToShow) }).map((_, idx) => {
                const dotIndex = idx;
                const slideStartIndex = dotIndex * slidesToShow;
                const isActive = currentIndex >= slideStartIndex && currentIndex < slideStartIndex + slidesToShow;
                return (
                  <button
                    key={idx}
                    onClick={() => goToSlide(slideStartIndex)}
                    className={`transition-all duration-300 rounded-full ${
                      isActive 
                        ? 'w-8 h-2 bg-green-600' 
                        : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const About = () => {
  const { t } = useTranslation();
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
    mission_title: t('our_mission'),
    mission_description: null, // Will use translation keys if null
    mission_image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop',
    mission_stat_number: '10K+',
    mission_stat_label: 'Eco-Travelers',
    values_title: t('our_core_values'),
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
    team_title: t('best_team'),
    team_description: t('team_description'),
    team_members: [
      { name: 'Sarah Johnson', role: 'Founder & CEO', image: 'https://i.pravatar.cc/300?img=1' },
      { name: 'Michael Chen', role: 'Head of Sustainability', image: 'https://i.pravatar.cc/300?img=13' },
      { name: 'Emma Williams', role: 'Travel Experience Director', image: 'https://i.pravatar.cc/300?img=5' },
      { name: 'David Rodriguez', role: 'Marketing Director', image: 'https://i.pravatar.cc/300?img=12' },
      { name: 'Lisa Anderson', role: 'Customer Success Manager', image: 'https://i.pravatar.cc/300?img=47' },
      { name: 'James Wilson', role: 'Tech Lead', image: 'https://i.pravatar.cc/300?img=33' },
      { name: 'Maria Garcia', role: 'Operations Manager', image: 'https://i.pravatar.cc/300?img=20' },
      { name: 'Robert Taylor', role: 'Finance Director', image: 'https://i.pravatar.cc/300?img=15' },
      { name: 'Jennifer Brown', role: 'Content Strategist', image: 'https://i.pravatar.cc/300?img=25' },
      { name: 'Thomas Lee', role: 'UX Designer', image: 'https://i.pravatar.cc/300?img=30' },
      { name: 'Amanda White', role: 'Community Manager', image: 'https://i.pravatar.cc/300?img=40' },
      { name: 'Christopher Moore', role: 'Sales Director', image: 'https://i.pravatar.cc/300?img=18' }
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
              {data.hero_title || t('about_unison_tour')}
            </h1>
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto">
              {data.hero_subtitle || t('pioneering_sustainable_tourism')}
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
              {data.mission_title || t('our_mission')}
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
                  {t('mission_default')}
                </p>
                <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                  {t('mission_paragraph_2')}
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {t('mission_paragraph_3')}
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

      {/* Values Section with Slider */}
      <ValuesSlider 
        title={data.values_title || t('our_core_values')}
        values={(data.values && Array.isArray(data.values) && data.values.length > 0 ? data.values : defaultData.values)
          .filter(value => value.title && value.description)}
      />

      {/* Impact Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          {data.impact_title || t('our_impact')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {[
            { number: data.impact_stat_1_number, label: data.impact_stat_1_label || t('countries_covered'), gradient: 'from-green-500 to-green-600' },
            { number: data.impact_stat_2_number, label: data.impact_stat_2_label || t('eco_partners'), gradient: 'from-blue-500 to-blue-600' },
            { number: data.impact_stat_3_number, label: data.impact_stat_3_label || t('happy_travelers'), gradient: 'from-green-600 to-blue-600' },
            { number: data.impact_stat_4_number, label: data.impact_stat_4_label || t('trees_planted'), gradient: 'from-blue-600 to-green-600' }
          ].filter(stat => stat.number).map((stat, idx) => (
            <div key={idx} className={`bg-gradient-to-br ${stat.gradient} text-white rounded-2xl p-8 shadow-lg`}>
              <p className="text-5xl font-bold mb-2">{stat.number}</p>
              <p className="text-lg">{stat.label}</p>
          </div>
          ))}
        </div>
      </div>

      {/* Team Section with Slider */}
      <TeamSlider 
        title={data.team_title || t('best_team')}
        description={data.team_description || t('team_description')}
        members={teamMembers.filter(member => member && member.name)}
        getImageUrl={getImageUrl}
      />

      {/* CTA Section - Redesigned */}
      <div className="relative bg-white py-20 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Top wave separator */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-gray-50 to-transparent"></div>
          
          {/* Geometric shapes */}
          <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-green-100 to-transparent rounded-full blur-3xl opacity-40"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-tr from-blue-100 to-transparent rounded-full blur-3xl opacity-40"></div>
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        {/* Content Container */}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Card */}
          <div className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Inner Content */}
            <div className="px-8 sm:px-12 lg:px-16 py-16 text-center">
              {/* Icon/Badge */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg mb-6 transform hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              {/* Heading */}
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 bg-clip-text text-transparent">
                {data.cta_title || t('ready_travel_sustainably')}
              </h2>
              
              {/* Description */}
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10">
                {data.cta_description || t('ready_travel_sustainably_description')}
                </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="/" 
                  className="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold text-base sm:text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform flex items-center min-w-[200px] justify-center"
                >
                  <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t('explore_destinations_button')}
                </a>
                <a 
                  href="/contact" 
                  className="group relative px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-base sm:text-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 transform flex items-center min-w-[200px] justify-center"
                >
                  <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {t('get_in_touch')}
                </a>
              </div>
            </div>

            {/* Bottom Accent Line */}
            <div className="h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-blue-500"></div>
          </div>
        </div>

        {/* Bottom Spacer for Footer Separation */}
        <div className="h-16"></div>
      </div>
    </div>
  );
};

export default About;

