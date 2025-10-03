import React from 'react';
import { Link } from 'react-router-dom';

const ServiceCard = ({ service }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden">
        {service.image ? (
          <img 
            src={`/storage/${service.image}`} 
            alt={service.name}
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-400 to-green-400 flex items-center justify-center">
            <span className="text-white font-bold text-xl">{service.name.charAt(0)}</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent py-2 px-3">
          <span className="text-white font-semibold">{service.price ? `$${service.price}` : 'Contact for price'}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-green-800 mb-1">{service.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{service.description || 'No description provided'}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {service.serviceType?.name || 'Service'}
            </span>
            {service.theme && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full ml-1">
                {service.theme.name}
              </span>
            )}
          </div>
          <Link to={`/service/${service.id}`} className="text-xs text-blue-600 hover:underline">
            View Details
          </Link>
        </div>
        <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {service.country?.name || 'Unknown Location'}
          </span>
          
          {service.duration && (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {service.duration}
            </span>
          )}
        </div>
        
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          {(service.min_age || service.max_age) && (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Ages: {service.min_age && service.max_age 
                ? `${service.min_age}-${service.max_age}` 
                : service.min_age 
                  ? `${service.min_age}+` 
                  : `Up to ${service.max_age}`}
            </span>
          )}
          
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {service.provider?.name || 'Unknown Provider'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;