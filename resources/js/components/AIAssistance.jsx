import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AIAssistance = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: t('ai_assistant_welcome', { defaultValue: 'Hello! 👋 I\'m your Unison Tour AI Assistant. I\'m here to help you plan your perfect eco-friendly adventure. Ask me anything about destinations, sustainable travel tips, or our services!' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to top immediately when component mounts or route changes
  useLayoutEffect(() => {
    // Scroll both window and document element to ensure it works
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname]);

  // Also ensure scroll to top after render (fallback)
  useEffect(() => {
    // Immediate scroll
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Also try after a tiny delay to catch any late renders
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickQuestions = [
    t('best_eco_destinations'),
    t('sustainable_accommodation'),
    t('green_travel_tips'),
    t('activities_adventures'),
    t('budget_planning'),
    t('custom_itinerary')
  ];

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      type: 'user',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Call backend API with Gemini integration
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          message: messageText
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const botMessage = {
          type: 'bot',
          text: data.message,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        // Fallback to simulated response if API fails
        const botResponse = generateAIResponse(messageText);
        const botMessage = {
          type: 'bot',
          text: botResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('AI Chat error:', error);
      // Fallback to simulated response on error
      const botResponse = generateAIResponse(messageText);
      const botMessage = {
        type: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateAIResponse = (question) => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('destination') || lowerQuestion.includes('place')) {
      return "🌍 For eco-friendly destinations, I recommend:\n\n• Costa Rica - Rich biodiversity and sustainable tourism\n• Norway - Fjords and responsible travel initiatives\n• New Zealand - Pristine nature and eco-lodges\n• Iceland - Geothermal energy and natural wonders\n• Bhutan - Carbon-negative country\n\nWould you like detailed information about any of these destinations?";
    }
    
    if (lowerQuestion.includes('accommodation') || lowerQuestion.includes('hotel')) {
      return "🏨 We partner with certified eco-friendly accommodations that:\n\n✓ Use renewable energy\n✓ Implement water conservation\n✓ Source local, organic food\n✓ Minimize waste and plastic\n✓ Support local communities\n\nWhat type of accommodation are you looking for? (Eco-lodge, Sustainable hotel, Green hostel)";
    }
    
    if (lowerQuestion.includes('tip') || lowerQuestion.includes('advice')) {
      return "🌿 Here are my top sustainable travel tips:\n\n1. Pack light to reduce carbon emissions\n2. Use reusable water bottles and bags\n3. Choose local transportation\n4. Support local businesses and communities\n5. Respect wildlife and natural habitats\n6. Offset your carbon footprint\n7. Leave no trace\n\nNeed specific advice for your trip?";
    }
    
    if (lowerQuestion.includes('activity') || lowerQuestion.includes('adventure')) {
      return "🚶 Popular eco-friendly activities include:\n\n• Hiking and trekking\n• Wildlife watching tours\n• Kayaking and canoeing\n• Cycling tours\n• Beach cleanups\n• Volunteering programs\n• Cultural immersion experiences\n• Photography expeditions\n\nWhich activity interests you most?";
    }
    
    if (lowerQuestion.includes('budget') || lowerQuestion.includes('price') || lowerQuestion.includes('cost')) {
      return "💰 Budget planning tips:\n\n• Off-season travel can save 30-50%\n• Local eco-lodges often offer better value\n• Group tours reduce individual costs\n• Many eco-activities are free or low-cost\n• Eating local is both sustainable and affordable\n\nWhat's your budget range? I can suggest options accordingly.";
    }
    
    if (lowerQuestion.includes('itinerary') || lowerQuestion.includes('plan')) {
      return "🗺️ I'd love to help plan your perfect eco-trip! To create a personalized itinerary, I need to know:\n\n• Destination preference\n• Trip duration\n• Budget range\n• Interest (adventure, relaxation, culture, etc.)\n• Travel dates\n\nShare these details and I'll craft an amazing sustainable journey for you!";
    }
    
    return "I'm here to help with your eco-travel needs! I can assist with:\n\n• Destination recommendations\n• Sustainable accommodation\n• Green travel tips\n• Activities and adventures\n• Budget planning\n• Custom itineraries\n\nWhat would you like to know more about?";
  };

  const handleQuickQuestion = (question) => {
    handleSendMessage(question);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-50 pt-20 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mb-4 shadow-lg animate-pulse">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-3">
            {t('ai_travel_assistant')}
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t('ai_assistant_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Features Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-green-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {t('quick_questions')}
              </h3>
              <div className="space-y-2">
                {quickQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickQuestion(question)}
                    className="w-full text-left px-4 py-3 bg-gradient-to-r from-green-50 to-blue-50 hover:from-green-100 hover:to-blue-100 rounded-lg transition-all duration-200 text-sm font-medium text-gray-700 border border-green-200 hover:border-green-300 hover:shadow-md transform hover:-translate-y-0.5"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4">{t('ai_capabilities')}</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">{t('availability_24_7')}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">{t('instant_responses')}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">{t('personalized_advice')}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">{t('eco_focused_guidance')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-green-100">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-green-500 to-blue-500 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Unison Tour AI</h3>
                    <p className="text-xs text-green-100">Online • Ready to help</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                  <span className="text-xs text-white">Active</span>
                </div>
              </div>

              {/* Messages Area */}
              <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-green-50/30 to-blue-50/30">
                {messages.map((message, idx) => (
                  <div
                    key={idx}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                  >
                    <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-br-none shadow-lg'
                            : 'bg-white text-gray-800 rounded-bl-none shadow-md border border-gray-100'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                      </div>
                      <p className={`text-xs text-gray-500 mt-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-md border border-gray-100">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <button className="p-2 text-gray-400 hover:text-green-500 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={t('ask_anything')}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-400 transition-colors"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim()}
                    className="p-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:from-green-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  💡 {t('tip_specific')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">{t('about_ai_assistant')}</h3>
              <p className="text-gray-600 text-sm">
                {t('ai_assistant_info')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AIAssistance;

