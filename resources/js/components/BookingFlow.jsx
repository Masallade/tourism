import React, { useState, useEffect } from 'react';

const BookingFlow = ({ service, onClose, onComplete }) => {
  // Early return if service is not available
  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Service information not available</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }
  
  const [currentStep, setCurrentStep] = useState(1); // 1: Contact, 2: Activity, 3: Payment
  
  // Contact Details State
  const [contactForm, setContactForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneCountryCode: '+92',
    phoneNumber: '',
    receiveSMS: false,
  });
  
  // Activity Details State
  const [activityForm, setActivityForm] = useState({
    date: '',
    time: '',
    travelers: { adults: 1, children: 0 },
    leadTravelerFirstName: '',
    leadTravelerLastName: '',
    pickupLocation: '',
  });
  
  // Payment Details State
  const [paymentForm, setPaymentForm] = useState({
    paymentTiming: 'payNow', // 'payNow' or 'reserveNow'
    paymentMethod: 'card', // 'card', 'paypal', 'paypalLater', 'googlePay'
    promoCode: '',
    promoCodeApplied: false,
  });
  const serviceMinTravelers = Math.max(Number(service?.min_travelers) || 1, 1);
  const serviceMaxTravelers = Math.max(Number(service?.max_travelers) || serviceMinTravelers, serviceMinTravelers);
  const [additionalTravelers, setAdditionalTravelers] = useState([]);
  const [travelerFieldError, setTravelerFieldError] = useState('');

  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  
  // Validation State
  const [validation, setValidation] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phoneNumber: false,
  });
  
  // Pickup Location Options
  const [pickupLocations, setPickupLocations] = useState([
    { id: 'local', name: "I live locally / I'm staying with friends, relatives", address: '' },
    { id: 'notBooked', name: 'My hotel is not yet booked', address: '' },
    { id: 'notListed', name: 'My hotel is not listed', address: '' },
    { id: 'parkLane', name: 'Park Lane Hotel', address: '107 MM Alam Rd Block B3 Block B 3 Gulberg III, Lahore 54000 Pakistan' },
    { id: 'luxusGrand', name: 'Luxus Grand Hotel', address: '4 Egerton Road, Lahore 54000 Pakistan' },
    { id: 'airport', name: 'Lahore Airport', address: '' },
  ]);
  
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [filteredPickupLocations, setFilteredPickupLocations] = useState(pickupLocations);
  
  // Calculate total price - safely handle service data
  const basePrice = (service && typeof service.price !== 'undefined' && service.price !== null) 
    ? parseFloat(service.price) 
    : 200;
  const totalPrice = basePrice; // Can add promo code discount later
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };
  
  // Validation functions
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  const validatePhone = (phone) => {
    return phone.length >= 10;
  };
  
  // Handle contact form changes
  const handleContactChange = (field, value) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation
    if (field === 'firstName') {
      setValidation(prev => ({ ...prev, firstName: value.trim().length > 0 }));
    } else if (field === 'lastName') {
      setValidation(prev => ({ ...prev, lastName: value.trim().length > 0 }));
    } else if (field === 'email') {
      setValidation(prev => ({ ...prev, email: validateEmail(value) }));
    } else if (field === 'phoneNumber') {
      setValidation(prev => ({ ...prev, phoneNumber: validatePhone(value) }));
    }
  };
  
  // Handle pickup location search
  const handlePickupSearch = (value) => {
    setActivityForm(prev => ({ ...prev, pickupLocation: value }));
    if (value.trim() === '') {
      setFilteredPickupLocations(pickupLocations);
    } else {
      const filtered = pickupLocations.filter(loc =>
        loc.name.toLowerCase().includes(value.toLowerCase()) ||
        loc.address.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredPickupLocations(filtered);
    }
    setShowPickupDropdown(true);
  };
  
  const selectPickupLocation = (location) => {
    setActivityForm(prev => ({ ...prev, pickupLocation: location.name }));
    setShowPickupDropdown(false);
  };

  const totalAdults = activityForm.travelers.adults;
  const totalChildren = activityForm.travelers.children;
  const totalTravelers = totalAdults + totalChildren;
  const remainingSlots = Math.max(0, serviceMaxTravelers - totalTravelers);
  const meetsMinCapacity = totalTravelers >= serviceMinTravelers;
  const additionalTravelersValid = additionalTravelers.every(
    (traveler) => traveler.firstName?.trim() && traveler.lastName?.trim()
  );

  const handleAddTraveler = () => {
    if (remainingSlots <= 0) {
      setTravelerFieldError(`You can add up to ${serviceMaxTravelers} traveler${serviceMaxTravelers === 1 ? '' : 's'} for this service.`);
      return;
    }

    setTravelerFieldError('');
    setAdditionalTravelers(prev => ([
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        firstName: '',
        lastName: '',
        type: 'adult',
      },
    ]));
  };

  const handleTravelerChange = (id, field, value) => {
    setAdditionalTravelers(prev =>
      prev.map(traveler =>
        traveler.id === id ? { ...traveler, [field]: value } : traveler
      )
    );
  };

  const handleRemoveTraveler = (id) => {
    setAdditionalTravelers(prev => prev.filter(traveler => traveler.id !== id));
    setTravelerFieldError('');
  };

  const buildBookingPayload = () => {
    const trimmedPhone = contactForm.phoneNumber.trim();
    const pickupValue = activityForm.pickupLocation?.trim() || '';
    const promoValue = paymentForm.promoCode.trim();
    const additionalAdults = additionalTravelers.filter(traveler => traveler.type === 'adult').length;
    const additionalChildren = additionalTravelers.filter(traveler => traveler.type === 'child').length;
    const serializedAdditionalTravelers = additionalTravelers.map((traveler, index) => ({
      order: index + 2, // Lead traveler is #1
      type: traveler.type,
      first_name: traveler.firstName.trim(),
      last_name: traveler.lastName.trim(),
    }));

    return {
      contact_first_name: contactForm.firstName.trim(),
      contact_last_name: contactForm.lastName.trim(),
      contact_email: contactForm.email.trim(),
      phone_country_code: contactForm.phoneCountryCode,
      phone_number: trimmedPhone || null,
      receive_sms: contactForm.receiveSMS,
      activity_date: activityForm.date,
      activity_time: activityForm.time,
      travelers_adults: 1 + additionalAdults,
      travelers_children: additionalChildren,
      lead_traveler_first_name: activityForm.leadTravelerFirstName || contactForm.firstName,
      lead_traveler_last_name: activityForm.leadTravelerLastName || contactForm.lastName,
      pickup_location: pickupValue || null,
      special_requests: null,
      payment_timing: paymentForm.paymentTiming,
      payment_method: paymentForm.paymentMethod,
      promo_code: promoValue || null,
      promo_code_applied: paymentForm.promoCodeApplied,
      currency: 'USD',
      form_snapshot: {
        contact: contactForm,
        activity: activityForm,
        payment: paymentForm,
        travelers: {
          total: totalTravelers,
          requiredMin: serviceMinTravelers,
          allowedMax: serviceMaxTravelers,
          additionalTravelers: serializedAdditionalTravelers,
        },
        service: {
          id: service?.id,
          name: service?.name,
          price: service?.price,
        },
      },
    };
  };
  
  // Check if current step is complete
  const isStepComplete = (step) => {
    if (step === 1) {
      return validation.firstName && validation.lastName && validation.email && validation.phoneNumber;
    } else if (step === 2) {
      const leadFieldsComplete = activityForm.pickupLocation && activityForm.leadTravelerFirstName && activityForm.leadTravelerLastName;
      return leadFieldsComplete && meetsMinCapacity && additionalTravelersValid;
    } else if (step === 3) {
      return true; // Payment step doesn't need validation before showing
    }
    return false;
  };

  // Handle next step - only move forward if current step is complete
  const handleNext = () => {
    if (isStepComplete(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      alert('Please fill all required fields and make sure traveler requirements are met before proceeding.');
    }
  };
  
  // Handle back step
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Handle promo code
  const handleApplyPromoCode = () => {
    if (paymentForm.promoCode.trim() !== '') {
      setPaymentForm(prev => ({ ...prev, promoCodeApplied: true }));
      // Here you would validate the promo code with backend
    }
  };
  
  // Handle payment completion
  const handlePayNow = async () => {
    if (isSubmittingBooking) {
      return;
    }

    try {
      setSubmissionError('');
      setIsSubmittingBooking(true);

      if (!window.apiClient || !service?.id) {
        throw new Error('Booking service is temporarily unavailable.');
      }

      const payload = buildBookingPayload();
      const { data } = await window.apiClient.post(`/api/services/${service.id}/bookings`, payload);

      if (onComplete) {
        onComplete({
          booking: data?.booking,
          totalPrice,
        });
      }
    } catch (error) {
      console.error('Booking submission failed:', error);
      let message = 'Unable to complete the booking. Please try again.';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.data?.errors) {
        const firstError = Object.values(error.response.data.errors).flat()[0];
        if (firstError) {
          message = firstError;
        }
      } else if (error.message) {
        message = error.message;
      }
      setSubmissionError(message);
    } finally {
      setIsSubmittingBooking(false);
    }
  };
  
  // Initialize with default values
  useEffect(() => {
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setActivityForm(prev => ({
      ...prev,
      date: tomorrow.toISOString().split('T')[0],
      time: '09:00',
    }));
  }, []);

  useEffect(() => {
    setAdditionalTravelers([]);
  }, [service?.id]);

  useEffect(() => {
    const additionalAdults = additionalTravelers.filter((traveler) => traveler.type === 'adult').length;
    const additionalChildren = additionalTravelers.filter((traveler) => traveler.type === 'child').length;
    setActivityForm(prev => ({
      ...prev,
      travelers: {
        adults: 1 + additionalAdults,
        children: additionalChildren,
      },
    }));
  }, [additionalTravelers]);

  useEffect(() => {
    if (
      travelerFieldError &&
      (activityForm.travelers.adults + activityForm.travelers.children) < serviceMaxTravelers
    ) {
      setTravelerFieldError('');
    }
  }, [travelerFieldError, activityForm.travelers.adults, activityForm.travelers.children, serviceMaxTravelers]);
  
  // Update lead traveler when contact form changes
  useEffect(() => {
    if (currentStep === 2) {
      setActivityForm(prev => ({
        ...prev,
        leadTravelerFirstName: contactForm.firstName,
        leadTravelerLastName: contactForm.lastName,
      }));
    }
  }, [contactForm.firstName, contactForm.lastName, currentStep]);
  
  // Render as a page component (not a modal)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Close Button */}
      <div className="sticky top-4 z-20 flex justify-end px-4 pointer-events-none" style={{ zIndex: 10000 }}>
        <button
          onClick={onClose}
          className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition pointer-events-auto"
          aria-label="Close"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" onClick={(e) => e.stopPropagation()}>
            {/* Left Column - Booking Form */}
            <div className="lg:col-span-2 space-y-4">
              {/* Step 1: Contact Details - Always visible, collapsible */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div 
                  className={`flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition ${
                    currentStep === 1 ? 'bg-green-50' : ''
                  }`}
                  onClick={() => {
                    if (currentStep !== 1) {
                      setCurrentStep(1);
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      currentStep === 1 ? 'bg-green-600 text-white' : isStepComplete(1) ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
                    }`}>
                      1
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Contact details</h2>
                  </div>
                  <svg 
                    className={`w-6 h-6 text-gray-600 transition-transform ${currentStep === 1 ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {currentStep === 1 && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 mb-6">
                      We'll use this information to send you confirmation and updates about your booking.
                    </p>
                    
                    <div className="space-y-4">
                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={contactForm.firstName}
                          onChange={(e) => handleContactChange('firstName', e.target.value)}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                            validation.firstName
                              ? 'border-green-500 focus:ring-green-500'
                              : 'border-gray-300 focus:ring-blue-500'
                          }`}
                          placeholder="First Name"
                        />
                        {validation.firstName && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={contactForm.lastName}
                          onChange={(e) => handleContactChange('lastName', e.target.value)}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                            validation.lastName
                              ? 'border-green-500 focus:ring-green-500'
                              : 'border-gray-300 focus:ring-blue-500'
                          }`}
                          placeholder="Last Name"
                        />
                        {validation.lastName && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                        <span className="ml-2 text-gray-400 cursor-help">
                          <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => handleContactChange('email', e.target.value)}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                            validation.email
                              ? 'border-green-500 focus:ring-green-500'
                              : 'border-gray-300 focus:ring-blue-500'
                          }`}
                          placeholder="Email"
                        />
                        {validation.email && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Phone Number */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                        <span className="ml-2 text-gray-400 cursor-help">
                          <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={contactForm.phoneCountryCode}
                          onChange={(e) => setContactForm(prev => ({ ...prev, phoneCountryCode: e.target.value }))}
                          className="px-3 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="+92">+92</option>
                          <option value="+1">+1</option>
                          <option value="+44">+44</option>
                          <option value="+91">+91</option>
                        </select>
                        <div className="relative flex-1">
                          <input
                            type="tel"
                            value={contactForm.phoneNumber}
                            onChange={(e) => handleContactChange('phoneNumber', e.target.value)}
                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                              validation.phoneNumber
                                ? 'border-green-500 focus:ring-green-500'
                                : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            placeholder="Phone Number"
                          />
                          {validation.phoneNumber && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* SMS Updates Checkbox */}
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="receiveSMS"
                        checked={contactForm.receiveSMS}
                        onChange={(e) => setContactForm(prev => ({ ...prev, receiveSMS: e.target.checked }))}
                        className="mt-1 mr-2 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <label htmlFor="receiveSMS" className="text-sm text-gray-700">
                        Receive SMS updates about your booking. Message rates may apply.
                      </label>
                    </div>
                    
                    {/* Next Button - Only show if step is complete and current step is 1 */}
                    {isStepComplete(1) && (
                      <div className="flex justify-end pt-4">
                        <button
                          onClick={handleNext}
                          className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                        >
                          Next
                        </button>
                      </div>
                    )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Step 2: Activity Details - Show when step 1 is complete, collapsible */}
              {isStepComplete(1) && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div 
                    className={`flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition ${
                      currentStep === 2 ? 'bg-green-50' : ''
                    }`}
                    onClick={() => {
                      if (currentStep !== 2 && isStepComplete(1)) {
                        setCurrentStep(2);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        currentStep === 2 ? 'bg-green-600 text-white' : isStepComplete(2) ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
                      }`}>
                        2
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Activity details</h2>
                    </div>
                    <svg 
                      className={`w-6 h-6 text-gray-600 transition-transform ${currentStep === 2 ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  {currentStep === 2 && (
                    <div className="px-6 pb-6">
                  
                  {/* Activity Summary Card */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6 flex gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      {service?.image ? (
                        <img
                          src={`/storage/${service.image}`}
                          alt={service.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs text-gray-600">
                          Free cancellation before 9:00 AM on {activityForm.date ? formatDate(activityForm.date) : 'tour date'} (tour local time)
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{service?.name || 'Tour Name'}</h3>
                      <p className="text-sm text-gray-600 mb-2">{service?.name || 'Tour Name'}</p>
                      <div className="text-sm text-gray-600">
                        {activityForm.date && formatDate(activityForm.date)} • {activityForm.time || '9:00 AM'}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {activityForm.travelers.adults} {activityForm.travelers.adults === 1 ? 'Adult' : 'Adults'}
                        {activityForm.travelers.children > 0 && `, ${activityForm.travelers.children} ${activityForm.travelers.children === 1 ? 'Child' : 'Children'}`}
                      </div>
                    </div>
                  </div>
                  
                  {/* Lead Traveler */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Traveler</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={activityForm.leadTravelerFirstName}
                          onChange={(e) => setActivityForm(prev => ({ ...prev, leadTravelerFirstName: e.target.value }))}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="First Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={activityForm.leadTravelerLastName}
                          onChange={(e) => setActivityForm(prev => ({ ...prev, leadTravelerLastName: e.target.value }))}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Last Name"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Travelers */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">Additional travelers</h3>
                      <span className="text-sm text-gray-600">
                        {totalTravelers}/{serviceMaxTravelers} slots used
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      This service allows between {serviceMinTravelers} and {serviceMaxTravelers} total travelers (including the lead traveler). Add each traveler’s name below.
                    </p>
                    {additionalTravelers.length === 0 ? (
                      <div className="border border-dashed border-gray-300 rounded-lg p-4 text-sm text-gray-600 bg-gray-50">
                        No additional travelers added yet. Use the button below to add another traveler.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {additionalTravelers.map((traveler, index) => (
                          <div key={traveler.id} className="border rounded-lg p-4 bg-white shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                              <span className="font-semibold text-gray-900">Traveler #{index + 2}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveTraveler(traveler.id)}
                                className="text-sm text-red-600 hover:text-red-700"
                              >
                                Remove
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={traveler.firstName}
                                  onChange={(e) => handleTravelerChange(traveler.id, 'firstName', e.target.value)}
                                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="First Name"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  Last Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={traveler.lastName}
                                  onChange={(e) => handleTravelerChange(traveler.id, 'lastName', e.target.value)}
                                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Last Name"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Traveler Type</label>
                                <select
                                  value={traveler.type}
                                  onChange={(e) => handleTravelerChange(traveler.id, 'type', e.target.value)}
                                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="adult">Adult</option>
                                  <option value="child">Child</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4">
                      <button
                        type="button"
                        onClick={handleAddTraveler}
                        disabled={remainingSlots <= 0}
                        className={`px-6 py-3 rounded-lg font-semibold transition ${
                          remainingSlots <= 0
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-50'
                        }`}
                      >
                        Add traveler
                      </button>
                      <span className="text-sm text-gray-600">
                        {remainingSlots > 0
                          ? `${remainingSlots} slot${remainingSlots === 1 ? '' : 's'} remaining`
                          : 'Maximum capacity reached'}
                      </span>
                    </div>
                    {!meetsMinCapacity && (
                      <p className="text-sm text-red-500 mt-2">
                        This service requires at least {serviceMinTravelers} traveler{serviceMinTravelers === 1 ? '' : 's'}. Add {Math.max(0, serviceMinTravelers - totalTravelers)} more traveler{serviceMinTravelers - totalTravelers === 1 ? '' : 's'} to proceed.
                      </p>
                    )}
                    {travelerFieldError && (
                      <p className="text-sm text-red-500 mt-2">{travelerFieldError}</p>
                    )}
                    {!additionalTravelersValid && (
                      <p className="text-sm text-red-500 mt-2">Please provide first and last names for each additional traveler.</p>
                    )}
                  </div>
                  
                  {/* Pickup Location */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pickup Location <span className="text-red-500">*</span>
                    </label>
                    <p className="text-sm text-gray-600 mb-3">
                      The provider offers pickup from select locations.
                    </p>
                    <div className="relative">
                      <input
                        type="text"
                        value={activityForm.pickupLocation}
                        onChange={(e) => handlePickupSearch(e.target.value)}
                        onFocus={() => setShowPickupDropdown(true)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                        placeholder="Select or search pickup location"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      
                      {/* Dropdown */}
                      {showPickupDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                          {filteredPickupLocations.map((location) => (
                            <div
                              key={location.id}
                              onClick={() => selectPickupLocation(location)}
                              className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium text-gray-900">{location.name}</div>
                              {location.address && (
                                <div className="text-sm text-gray-600 mt-1">{location.address}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                      {/* Navigation Buttons */}
                      <div className="flex justify-between pt-4">
                        <button
                          onClick={handleBack}
                          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                        >
                          Back
                        </button>
                        {isStepComplete(2) && (
                          <button
                            onClick={handleNext}
                            className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                          >
                            Next
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Step 3: Payment Details - Show when step 2 is complete, collapsible */}
              {isStepComplete(2) && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div 
                    className={`flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition ${
                      currentStep === 3 ? 'bg-green-50' : ''
                    }`}
                    onClick={() => {
                      if (currentStep !== 3 && isStepComplete(2)) {
                        setCurrentStep(3);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        currentStep === 3 ? 'bg-green-600 text-white' : 'bg-green-500 text-white'
                      }`}>
                        3
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Payment details</h2>
                    </div>
                    <svg 
                      className={`w-6 h-6 text-gray-600 transition-transform ${currentStep === 3 ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  {currentStep === 3 && (
                    <div className="px-6 pb-6">
                  
                  {/* Choose when to pay */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose when to pay</h3>
                    <div className="space-y-3">
                      <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-500 transition">
                        <input
                          type="radio"
                          name="paymentTiming"
                          value="payNow"
                          checked={paymentForm.paymentTiming === 'payNow'}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, paymentTiming: e.target.value }))}
                          className="mr-3 w-5 h-5 text-green-600"
                        />
                        <div className="flex-1">
                          <span className="font-semibold text-gray-900">Pay now</span>
                          <span className="ml-2 text-gray-600">${totalPrice.toFixed(2)}</span>
                        </div>
                      </label>
                      <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-500 transition">
                        <input
                          type="radio"
                          name="paymentTiming"
                          value="reserveNow"
                          checked={paymentForm.paymentTiming === 'reserveNow'}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, paymentTiming: e.target.value }))}
                          className="mr-3 w-5 h-5 text-green-600"
                        />
                        <div className="flex-1">
                          <span className="font-semibold text-gray-900">Reserve Now, Pay Later</span>
                          <div className="text-sm text-gray-600 mt-1">
                            No extra fees. You'll be charged ${totalPrice.toFixed(2)} on {activityForm.date ? formatDate(activityForm.date) : 'tour date'}.
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  {/* Pay with */}
                  <div className="mb-6 p-4 border-2 border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Pay with</h3>
                    <div className="space-y-3">
                      <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-500 transition">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={paymentForm.paymentMethod === 'card'}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                          className="mr-3 w-5 h-5 text-green-600"
                        />
                        <span className="font-semibold text-gray-900 mr-4">Credit/Debit Card</span>
                        <div className="flex gap-2">
                          <span className="text-xs text-gray-500">Discover</span>
                          <span className="text-xs text-gray-500">JCB</span>
                          <span className="text-xs text-gray-500">Visa</span>
                          <span className="text-xs text-gray-500">Mastercard</span>
                          <span className="text-xs text-gray-500">Amex</span>
                        </div>
                      </label>
                      <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-500 transition">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="paypal"
                          checked={paymentForm.paymentMethod === 'paypal'}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                          className="mr-3 w-5 h-5 text-green-600"
                        />
                        <span className="font-semibold text-gray-900">PayPal</span>
                      </label>
                      <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-500 transition">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="paypalLater"
                          checked={paymentForm.paymentMethod === 'paypalLater'}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                          className="mr-3 w-5 h-5 text-green-600"
                        />
                        <div>
                          <span className="font-semibold text-gray-900">PayPal Pay Later</span>
                          <div className="text-sm text-gray-600 mt-1">
                            Starting at $19.11/mo or as low as 0% APR with PayPal. <a href="#" className="text-blue-600 hover:underline">Learn more</a>.
                          </div>
                        </div>
                      </label>
                      <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-500 transition">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="googlePay"
                          checked={paymentForm.paymentMethod === 'googlePay'}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                          className="mr-3 w-5 h-5 text-green-600"
                        />
                        <span className="font-semibold text-gray-900">Google Pay</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Promo Code */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Promo code</h3>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={paymentForm.promoCode}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, promoCode: e.target.value }))}
                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter promo code"
                      />
                      <button
                        onClick={handleApplyPromoCode}
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                  
                  {/* Total Price */}
                  <div className="mb-6 p-4 bg-green-50 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold text-gray-900">Total price</span>
                      <span className="text-2xl font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>
                        Free cancellation before 9:00 AM on {activityForm.date ? formatDate(activityForm.date) : 'tour date'} (tour local time)
                      </span>
                    </div>
                  </div>
                  
                  {/* Legal Text */}
                  <div className="mb-6 text-xs text-gray-600 space-y-2">
                    <p>
                      By clicking 'Pay now', you agree to our Terms & Privacy and Cookies Statement, plus the tour operator's rules & regulations (see listing for more details).
                    </p>
                    <p>
                      Your booking is facilitated by our platform, but a third-party tour operator provides the tour/activity directly to you. By clicking 'Pay now', you consent to receive special offers, tips and other updates from us, from which you can unsubscribe at any time.
                    </p>
                    <p>
                      Your statement will list our platform as the merchant for this transaction.
                    </p>
                  </div>

                  {submissionError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700" role="alert">
                      {submissionError}
                    </div>
                  )}

                      {/* Pay Now Button */}
                      <div className="mb-4">
                        <button
                      onClick={handlePayNow}
                      disabled={isSubmittingBooking}
                      className={`w-full py-4 bg-green-600 text-white rounded-lg font-bold text-lg transition ${
                        isSubmittingBooking ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-700'
                      }`}
                    >
                      {isSubmittingBooking ? 'Submitting booking...' : 'Pay now'}
                    </button>
                      </div>
                      
                      {/* Back Button */}
                      <div className="flex justify-start">
                        <button
                          onClick={handleBack}
                          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                        >
                          Back
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Right Column - Summary Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                {/* Tour Summary Card */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-2 border-gray-200">
                  <div className="flex gap-4 mb-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      {service?.image ? (
                        <img
                          src={`/storage/${service.image}`}
                          alt={service.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{service?.name || 'Tour Name'}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg key={star} className="w-4 h-4 text-green-500 fill-current" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm font-semibold text-gray-900">5.0</span>
                        <span className="text-sm text-gray-600">(18)</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        by {service?.provider?.name || 'Tour Provider'}
                      </p>
                      <p className="text-sm text-gray-600">{service?.name || 'Tour Name'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Date</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {activityForm.date ? formatDate(activityForm.date) : 'Select date'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Time</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {activityForm.time || '9:00 AM'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Travelers</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {activityForm.travelers.adults} {activityForm.travelers.adults === 1 ? 'Adult' : 'Adults'}
                        {activityForm.travelers.children > 0 && `, ${activityForm.travelers.children} ${activityForm.travelers.children === 1 ? 'Child' : 'Children'}`}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>
                        Free cancellation before 9:00 AM on {activityForm.date ? formatDate(activityForm.date) : 'tour date'} (tour local time)
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                {/* 24/7 Support Card */}
                <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">24/7 global support</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <a href="tel:+18337642165" className="text-blue-600 hover:underline font-medium">
                        +1 833 764 2165
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <a href="#" className="text-blue-600 hover:underline font-medium">
                        Chat now
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;

