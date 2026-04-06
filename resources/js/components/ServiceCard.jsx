import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { extractServiceTypes, extractThemes } from '../utils/serviceHelpers';
import { sanitizeDescriptionHtml } from '../utils/sanitizeHtml';

const Icon = ({ className = 'w-4 h-4', children, ...props }) => (
  <span className={`inline-flex items-center justify-center flex-shrink-0 text-gray-500 ${className}`} {...props}>
    {children}
  </span>
);

const MetaItem = ({ icon, label, className = '' }) => {
  if (label == null || label === '') return null;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs text-gray-600 ${className}`} title={label}>
      {icon}
      <span className="truncate">{label}</span>
    </span>
  );
};

const ServiceCard = ({ service }) => {
  const serviceTypes = extractServiceTypes(service);
  const serviceThemes = extractThemes(service);
  const location = useLocation();

  const isFromProviderPage = location.pathname.startsWith('/service-provider/');
  const providerId = isFromProviderPage ? location.pathname.split('/')[2] : null;
  const isFromTripsPage = location.pathname === '/trips' || location.pathname.startsWith('/trips?');

  const navigationState = {};
  if (isFromProviderPage && providerId) navigationState.fromProviderId = providerId;
  if (isFromTripsPage) navigationState.fromTrips = true;

  const locationLabel = service.country?.name || null;
  const durationLabel = service.duration || null;
  const ageLabel =
    service.min_age != null || service.max_age != null
      ? service.min_age != null && service.max_age != null
        ? `Ages ${service.min_age}–${service.max_age}`
        : service.min_age != null
          ? `Ages ${service.min_age}+`
          : `Up to age ${service.max_age}`
      : null;
  const groupLabel =
    service.min_travelers != null && service.max_travelers != null
      ? `${service.min_travelers}–${service.max_travelers} travelers`
      : service.min_travelers != null
        ? `${service.min_travelers}+ travelers`
        : service.max_travelers != null
          ? `Up to ${service.max_travelers} travelers`
          : null;
  const priceLabel = service.price != null ? `$${Number(service.price).toLocaleString()}` : 'Contact for price';

  return (
    <Link
      to={`/service/${service.id}`}
      state={Object.keys(navigationState).length > 0 ? navigationState : null}
      className="group block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-green-200"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        {service.image ? (
          <img
            src={`/storage/${service.image}`}
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
            <span className="text-white font-bold text-3xl opacity-90">{service.name.charAt(0)}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-2">
          {(serviceTypes.length ? serviceTypes : []).slice(0, 2).map((type) => (
            <span
              key={`card-type-${service.id}-${type.id}`}
              className="text-xs font-medium bg-white/95 text-blue-800 px-2.5 py-1 rounded-full shadow-sm"
            >
              {type.name}
            </span>
          ))}
          {serviceThemes.slice(0, 2).map((theme) => (
            <span
              key={`card-theme-${service.id}-${theme.id}`}
              className="text-xs font-medium bg-white/95 text-green-800 px-2.5 py-1 rounded-full shadow-sm"
            >
              {theme.name}
            </span>
          ))}
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="text-lg font-bold text-white drop-shadow-md">{priceLabel}</span>
          {durationLabel && (
            <span className="text-sm font-medium text-white/95 bg-black/30 px-2 py-1 rounded-lg">
              {durationLabel}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-green-700 transition-colors line-clamp-2">
          {service.name}
        </h3>
        {service.provider?.name && (
          <p className="text-sm text-gray-500 mb-2 truncate">by {service.provider.name}</p>
        )}
        <div
          className="text-sm text-gray-600 line-clamp-2 mb-4 [&_strong]:font-bold [&_br]:block min-h-[2.5rem]"
          dangerouslySetInnerHTML={{
            __html: service.description ? sanitizeDescriptionHtml(service.description) : 'No description provided',
          }}
        />

        {/* Meta row */}
        <div className="space-y-2 mb-4">
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            <MetaItem
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
              label={locationLabel}
            />
            <MetaItem
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              label={durationLabel}
            />
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            <MetaItem
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              label={ageLabel}
            />
            <MetaItem
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
              label={groupLabel}
            />
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {serviceTypes.length + serviceThemes.length > 0
              ? `${serviceTypes.length} type(s) · ${serviceThemes.length} theme(s)`
              : '\u00A0'}
          </span>
          <span className="text-sm font-medium text-green-600 group-hover:text-green-700 flex items-center gap-1">
            View Details
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;