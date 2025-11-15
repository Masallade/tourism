import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';

const TripCalculatorModal = ({ onClose, countries }) => {
  const [formData, setFormData] = useState({
    destination: '',
    budget: '',
    duration: '',
    startDate: '',
    endDate: '',
    travelers: '',
    interests: '',
    accommodation: '',
    travelStyle: ''
  });
  const [aiResponse, setAiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('form'); // 'form' or 'result'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAiResponse(null);

    // Construct a detailed prompt for the AI
    const prompt = `I need help planning an eco-friendly trip with the following details:

Destination: ${formData.destination || 'Not specified'}
Budget: ${formData.budget || 'Not specified'}
Duration: ${formData.duration || 'Not specified'} days
Travel Dates: ${formData.startDate ? `${formData.startDate} to ${formData.endDate || 'TBD'}` : 'Not specified'}
Number of Travelers: ${formData.travelers || 'Not specified'}
Interests: ${formData.interests || 'Not specified'}
Accommodation Preference: ${formData.accommodation || 'Not specified'}
Travel Style: ${formData.travelStyle || 'Not specified'}

Please create a comprehensive, detailed eco-friendly travel plan for this trip. Include:
1. A day-by-day itinerary with sustainable activities
2. Recommended eco-friendly accommodations within the budget
3. Sustainable transportation options
4. Local eco-friendly restaurants and dining options
5. Cultural and environmental experiences
6. Tips for minimizing environmental impact
7. Estimated costs breakdown
8. Best practices for responsible tourism in this destination

Make the response detailed, practical, and focused on sustainability. Format it in a clear, easy-to-read way with sections and bullet points where appropriate.`;

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
      budget: '',
      duration: '',
      startDate: '',
      endDate: '',
      travelers: '',
      interests: '',
      accommodation: '',
      travelStyle: ''
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
              {/* Destination */}
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
                  <option value="">Select a destination</option>
                  {countries.map(country => (
                    <option key={country.id} value={country.name}>{country.name}</option>
                  ))}
                </select>
              </div>

              {/* Budget and Duration Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Budget <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                  >
                    <option value="">Select budget range</option>
                    <option value="Budget ($500-$1000)">Budget ($500-$1000)</option>
                    <option value="Moderate ($1000-$2500)">Moderate ($1000-$2500)</option>
                    <option value="Comfortable ($2500-$5000)">Comfortable ($2500-$5000)</option>
                    <option value="Luxury ($5000+)">Luxury ($5000+)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Duration (Days) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="e.g., 7"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                  />
                </div>
              </div>

              {/* Travel Dates Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    min={formData.startDate}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                  />
                </div>
              </div>

              {/* Travelers and Accommodation Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Travelers
                  </label>
                  <input
                    type="number"
                    name="travelers"
                    value={formData.travelers}
                    onChange={handleChange}
                    min="1"
                    placeholder="e.g., 2"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Accommodation Preference
                  </label>
                  <select
                    name="accommodation"
                    value={formData.accommodation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                  >
                    <option value="">Select preference</option>
                    <option value="Eco-lodge">Eco-lodge</option>
                    <option value="Sustainable Hotel">Sustainable Hotel</option>
                    <option value="Green Hostel">Green Hostel</option>
                    <option value="Homestay">Homestay</option>
                    <option value="Camping">Camping</option>
                    <option value="No preference">No preference</option>
                  </select>
                </div>
              </div>

              {/* Travel Style */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Travel Style
                </label>
                <select
                  name="travelStyle"
                  value={formData.travelStyle}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                >
                  <option value="">Select travel style</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Relaxation">Relaxation</option>
                  <option value="Cultural Immersion">Cultural Immersion</option>
                  <option value="Nature & Wildlife">Nature & Wildlife</option>
                  <option value="Volunteering">Volunteering</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Interests & Activities
                </label>
                <textarea
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  rows="3"
                  placeholder="e.g., Hiking, Wildlife watching, Local cuisine, Photography..."
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



