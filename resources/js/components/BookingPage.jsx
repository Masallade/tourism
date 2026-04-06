import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookingFlow from './BookingFlow';
import BookingConfirmation from './BookingConfirmation';

const BookingPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedBooking, setCompletedBooking] = useState(null);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await fetch(`/api/services/${serviceId}`);
        if (!response.ok) throw new Error('Service not found');
        const data = await response.json();
        setService(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    if (serviceId) {
      fetchServiceDetails();
    }
  }, [serviceId]);

  const handleClose = () => {
    navigate(-1);
  };

  const handleComplete = (result) => {
    if (result?.booking) {
      setCompletedBooking(result.booking);
    }
  };

  const handleBackToService = () => {
    navigate(`/service/${serviceId}`);
  };

  const handleBookAnother = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Service not found</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (completedBooking) {
    return (
      <BookingConfirmation
        booking={completedBooking}
        onBackToService={handleBackToService}
        onBookAnother={handleBookAnother}
      />
    );
  }

  return (
    <BookingFlow
      service={service}
      onClose={handleClose}
      onComplete={handleComplete}
    />
  );
};

export default BookingPage;

