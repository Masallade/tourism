import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';

const TripCalculatorModal = ({ onClose, countries }) => {
  const [formData, setFormData] = useState({
    destination: '',
    tourType: '',
    travelDates: '',
    duration: '',
    groupSize: '',
    adults: '',
    children: '',
    budgetPerPerson: '',
    activityLevel: '',
    travelStyle: [],
    accommodation: '',
    transportation: '',
    interests: [],
    specialRequirements: ''
  });
  const [themes, setThemes] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [aiResponse, setAiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('form'); // 'form' or 'result'

  useEffect(() => {
    fetchThemesAndServiceTypes();
  }, []);

  const fetchThemesAndServiceTypes = async () => {
    try {
      setLoadingData(true);
      const [themesRes, serviceTypesRes] = await Promise.all([
        fetch('/api/themes'),
        fetch('/api/service-types')
      ]);
      
      const themesData = await themesRes.json();
      const serviceTypesData = await serviceTypesRes.json();
      
      setThemes(themesData);
      setServiceTypes(serviceTypesData);
    } catch (err) {
      console.error('Error fetching themes and service types:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = e.target.checked;
      const fieldName = e.target.getAttribute('data-field') || name;
      
      setFormData(prev => {
        const currentArray = prev[fieldName] || [];
        const updatedArray = checked
          ? [...currentArray, value]
          : currentArray.filter(item => item !== value);
        
        return {
          ...prev,
          [fieldName]: updatedArray
        };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that at least one service type is selected
    if (formData.travelStyle.length === 0) {
      setError('Please select at least one service type (travel style).');
      return;
    }
    
    setLoading(true);
    setError(null);
    setAiResponse(null);

    // Construct a detailed prompt for the AI
    const groupComposition = [];
    if (formData.adults) groupComposition.push(`${formData.adults} adult(s)`);
    if (formData.children) groupComposition.push(`${formData.children} child(ren)`);
    const groupInfo = groupComposition.length > 0 ? groupComposition.join(', ') : (formData.groupSize || 'Not specified');
    
    const prompt = `I need help planning an eco-friendly tour with the following details:

TOUR BASICS:
- Destination: ${formData.destination || 'Not specified'}
- Tour Type: ${formData.tourType || 'Not specified'}
- Travel Dates: ${formData.travelDates || 'Not specified'}
- Duration: ${formData.duration || 'Not specified'} days

GROUP DETAILS:
- Group Size: ${formData.groupSize || 'Not specified'} travelers
- Group Composition: ${groupInfo}
- Budget: ${formData.budgetPerPerson || 'Not specified'} per person

TRAVEL PREFERENCES:
- Activity Level: ${formData.activityLevel || 'Not specified'}
- Service Types (Travel Styles): ${formData.travelStyle.length > 0 ? formData.travelStyle.join(', ') : 'Not specified'}
- Accommodation Type: ${formData.accommodation || 'Not specified'}
- Transportation Preference: ${formData.transportation || 'Not specified'}
- Themes (Interests & Activities): ${formData.interests.length > 0 ? formData.interests.join(', ') : 'Not specified'}
- Special Requirements: ${formData.specialRequirements || 'None'}

Please create a comprehensive, detailed eco-friendly tour plan. Include:
1. A day-by-day itinerary with sustainable activities and tour highlights
2. Recommended eco-friendly accommodations suitable for the group size and budget
3. Sustainable transportation options (local transport, eco-friendly tours)
4. Local eco-friendly restaurants and dining experiences
5. Cultural immersion activities and environmental experiences
6. Group-friendly activities and tour recommendations
7. Tips for minimizing environmental impact during the tour
8. Estimated costs breakdown per person
9. Best practices for responsible tourism in this destination
10. Safety considerations and travel tips

Make the response detailed, practical, and focused on sustainability and group travel. Format it in a clear, easy-to-read way with sections and bullet points where appropriate.`;

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          message: prompt
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAiResponse(data.message);
        setStep('result');
      } else {
        setError(data.error || 'Failed to generate trip plan. Please try again.');
      }
    } catch (err) {
      console.error('Trip calculator error:', err);
      setError('An error occurred while generating your trip plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      destination: '',
      tourType: '',
      travelDates: '',
      duration: '',
      groupSize: '',
      adults: '',
      children: '',
      budgetPerPerson: '',
      activityLevel: '',
      travelStyle: [],
      accommodation: '',
      transportation: '',
      interests: [],
      specialRequirements: ''
    });
    setAiResponse(null);
    setError(null);
    setStep('form');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-modalPop">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl font-bold focus:outline-none z-10 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold">Unison Tour Calculator</h2>
              <p className="text-green-100 text-sm mt-1">Plan your perfect eco-friendly adventure</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section 1: Trip Basics */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Trip Basics
                </h3>
                
                <div className="space-y-4">
                  {/* Destination and Tour Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Destination <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                      >
                        <option value="">Select destination</option>
                        {countries && countries.length > 0 ? (
                          countries.map(country => (
                            <option key={country.id} value={country.name}>{country.name}</option>
                          ))
                        ) : (
                          <option value="" disabled>Loading destinations...</option>
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tour Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="tourType"
                        value={formData.tourType}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                      >
                        <option value="">Select tour type</option>
                        <option value="Group Tour">Group Tour (Join others)</option>
                        <option value="Private Tour">Private Tour (Just your group)</option>
                        <option value="Self-Guided">Self-Guided Tour</option>
                        <option value="Custom Tour">Custom Tour Package</option>
                      </select>
                    </div>
                  </div>

                  {/* Travel Dates and Duration */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Preferred Travel Dates <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="travelDates"
                        value={formData.travelDates}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tour Duration <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                      >
                        <option value="">Select duration</option>
                        <option value="1-3 days">1-3 days (Weekend getaway)</option>
                        <option value="4-7 days">4-7 days (Week tour)</option>
                        <option value="8-14 days">8-14 days (Extended tour)</option>
                        <option value="15-21 days">15-21 days (Long tour)</option>
                        <option value="22+ days">22+ days (Extended journey)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Group Details */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Group Details
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Total Travelers <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="groupSize"
                        value={formData.groupSize}
                        onChange={handleChange}
                        required
                        min="1"
                        max="50"
                        placeholder="e.g., 4"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Adults (18+)
                      </label>
                      <input
                        type="number"
                        name="adults"
                        value={formData.adults}
                        onChange={handleChange}
                        min="0"
                        placeholder="e.g., 2"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Children (Under 18)
                      </label>
                      <input
                        type="number"
                        name="children"
                        value={formData.children}
                        onChange={handleChange}
                        min="0"
                        placeholder="e.g., 2"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Budget Per Person <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="budgetPerPerson"
                      value={formData.budgetPerPerson}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                    >
                      <option value="">Select budget per person</option>
                      <option value="Budget ($300-$600)">Budget ($300-$600)</option>
                      <option value="Moderate ($600-$1,200)">Moderate ($600-$1,200)</option>
                      <option value="Comfortable ($1,200-$2,500)">Comfortable ($1,200-$2,500)</option>
                      <option value="Premium ($2,500-$5,000)">Premium ($2,500-$5,000)</option>
                      <option value="Luxury ($5,000+)">Luxury ($5,000+)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Travel Preferences */}
              <div className="bg-gradient-to-r from-amber-50 to-green-50 rounded-xl p-4 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Travel Preferences
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Activity Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="activityLevel"
                      value={formData.activityLevel}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                    >
                      <option value="">Select activity level</option>
                      <option value="Easy">Easy (Light walking, minimal physical activity)</option>
                      <option value="Moderate">Moderate (Regular walking, some hiking)</option>
                      <option value="Active">Active (Hiking, biking, physical activities)</option>
                      <option value="Challenging">Challenging (Strenuous activities, adventure sports)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Service Types (Travel Styles) <span className="text-red-500">*</span>
                      <span className="text-xs text-gray-500 font-normal ml-2">(Select one or more)</span>
                    </label>
                    {loadingData ? (
                      <div className="flex items-center justify-center p-8 border-2 border-gray-200 rounded-xl">
                        <ClipLoader color="#10b981" size={24} />
                        <span className="ml-3 text-gray-600">Loading service types...</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border-2 border-gray-200 rounded-xl bg-gray-50">
                        {serviceTypes.length > 0 ? (
                          serviceTypes.map((serviceType) => (
                            <label key={serviceType.id} className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-white transition-colors">
                              <input
                                type="checkbox"
                                name="travelStyle"
                                data-field="travelStyle"
                                value={serviceType.name}
                                checked={formData.travelStyle.includes(serviceType.name)}
                                onChange={handleChange}
                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                              />
                              <span className="text-sm text-gray-700">{serviceType.name}</span>
                            </label>
                          ))
                        ) : (
                          <div className="col-span-full text-center text-gray-500 py-4">
                            No service types available
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Accommodation Type
                      </label>
                      <select
                        name="accommodation"
                        value={formData.accommodation}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                      >
                        <option value="">Any preference</option>
                        <option value="Eco-Lodge">Eco-Lodge</option>
                        <option value="Sustainable Hotel">Sustainable Hotel</option>
                        <option value="Boutique Hotel">Boutique Hotel</option>
                        <option value="Homestay">Homestay (Local family)</option>
                        <option value="Green Hostel">Green Hostel</option>
                        <option value="Camping">Camping/Glamping</option>
                        <option value="Resort">Eco-Resort</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Transportation Preference
                      </label>
                      <select
                        name="transportation"
                        value={formData.transportation}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                      >
                        <option value="">Any preference</option>
                        <option value="Public Transport">Public Transport (Buses, Trains)</option>
                        <option value="Private Vehicle">Private Vehicle/Driver</option>
                        <option value="Walking & Cycling">Walking & Cycling Tours</option>
                        <option value="Boat & Ferry">Boat & Ferry</option>
                        <option value="Mixed">Mixed (Best option for route)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Interests & Activities (Themes) */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Interests & Activities (Themes)
                  <span className="text-xs text-gray-500 font-normal ml-2">(Select one or more)</span>
                </h3>
                
                {loadingData ? (
                  <div className="flex items-center justify-center p-8 border-2 border-gray-200 rounded-xl bg-white">
                    <ClipLoader color="#10b981" size={24} />
                    <span className="ml-3 text-gray-600">Loading themes...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {themes.length > 0 ? (
                      themes.map((theme) => (
                        <label key={theme.id} className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-white/50 transition-colors">
                          <input
                            type="checkbox"
                            name="interests"
                            data-field="interests"
                            value={theme.name}
                            checked={formData.interests.includes(theme.name)}
                            onChange={handleChange}
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          />
                          <span className="text-sm text-gray-700">{theme.name}</span>
                        </label>
                      ))
                    ) : (
                      <div className="col-span-full text-center text-gray-500 py-4">
                        No themes available
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Special Requirements */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Special Requirements or Preferences
                </label>
                <textarea
                  name="specialRequirements"
                  value={formData.specialRequirements}
                  onChange={handleChange}
                  rows="3"
                  placeholder="e.g., Dietary restrictions, accessibility needs, specific places to visit, special occasions..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors resize-none"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <ClipLoader color="#ffffff" size={20} />
                      <span>Generating Plan...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Generate Trip Plan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Results View */
            <div className="space-y-6">
              {/* AI Response */}
              {aiResponse && (
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-full p-2">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Your Personalized Trip Plan</h3>
                  </div>
                  <div className="prose max-w-none">
                    <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {aiResponse}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleReset}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Plan Another Trip</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all shadow-lg"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes modalPop {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-modalPop {
          animation: modalPop 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TripCalculatorModal;




