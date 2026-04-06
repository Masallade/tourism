import React from 'react';

const BookingConfirmation = ({
  booking,
  onBackToService,
  onBookAnother,
}) => {
  if (!booking) {
    return null;
  }

  const service = booking.service || {};
  const provider = booking.provider || {};

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;

    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Flexible';
    if (timeString.includes(':')) {
      const [hour, minute] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hour, 10), parseInt(minute, 10));
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }
    return timeString;
  };

  const travelerSummary = () => {
    const parts = [];
    if (booking.travelers_adults) {
      parts.push(`${booking.travelers_adults} ${booking.travelers_adults === 1 ? 'Adult' : 'Adults'}`);
    }
    if (booking.travelers_children) {
      parts.push(`${booking.travelers_children} ${booking.travelers_children === 1 ? 'Child' : 'Children'}`);
    }
    return parts.join(', ') || 'Not specified';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm uppercase tracking-wide text-green-600 font-semibold mb-2">
              Booking confirmed
            </p>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              You're all set!
            </h1>
            <p className="text-gray-600 max-w-2xl mb-6">
              We’ve emailed a receipt and confirmation to {booking.contact_email}. Your tour operator will send pickup details soon.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="px-5 py-3 bg-gray-100 rounded-lg font-mono text-sm text-gray-700">
                Reference: {booking.reference}
              </div>
              <div className="px-5 py-3 bg-gray-100 rounded-lg text-sm text-gray-700">
                Status: <span className="font-semibold text-green-600 capitalize">{booking.status}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-xl border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tour details</h2>
              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between flex-wrap gap-3">
                  <span className="font-medium">Experience</span>
                  <span className="text-right">{service.name || 'Selected tour'}</span>
                </div>
                <div className="flex justify-between flex-wrap gap-3">
                  <span className="font-medium">Operator</span>
                  <span className="text-right">{provider.name || 'Tour provider'}</span>
                </div>
                <div className="flex justify-between flex-wrap gap-3">
                  <span className="font-medium">Date & time</span>
                  <span className="text-right">
                    {formatDate(booking.activity_date)} • {formatTime(booking.activity_time)}
                  </span>
                </div>
                <div className="flex justify-between flex-wrap gap-3">
                  <span className="font-medium">Travelers</span>
                  <span className="text-right">{travelerSummary()}</span>
                </div>
                {booking.pickup_location && (
                  <div className="flex justify-between flex-wrap gap-3">
                    <span className="font-medium">Pickup</span>
                    <span className="text-right max-w-md">{booking.pickup_location}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact details</h2>
              <div className="grid gap-3 text-gray-700 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Lead traveler</p>
                  <p className="font-medium">
                    {booking.lead_traveler_first_name} {booking.lead_traveler_last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Primary contact</p>
                  <p className="font-medium">
                    {booking.contact_first_name} {booking.contact_last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium break-words">{booking.contact_email}</p>
                </div>
                {booking.phone_number && (
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">
                      {booking.phone_country_code} {booking.phone_number}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 p-6 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">What's next?</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="text-green-600">•</span>
                  You’ll receive pickup instructions from {provider.name || 'the provider'} within 24 hours.
                </li>
                <li className="flex gap-3">
                  <span className="text-green-600">•</span>
                  Bring a valid ID and be ready 10 minutes before your pickup time.
                </li>
                <li className="flex gap-3">
                  <span className="text-green-600">•</span>
                  Need help? Our support team is available 24/7 via phone or chat.
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <button
              onClick={onBackToService}
              className="flex-1 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            >
              Back to tour page
            </button>
            <button
              onClick={onBookAnother}
              className="flex-1 px-6 py-3 rounded-lg border border-gray-300 text-gray-800 font-semibold hover:bg-gray-100 transition"
            >
              Explore more experiences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;


