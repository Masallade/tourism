export const extractServiceTypes = (service) => {
  if (!service) return [];
  if (Array.isArray(service.service_types)) return service.service_types;
  if (Array.isArray(service.serviceTypes)) return service.serviceTypes;
  if (service.service_type) return [service.service_type];
  if (service.serviceType) return [service.serviceType];
  return [];
};

export const extractThemes = (service) => {
  if (!service) return [];
  if (Array.isArray(service.themes)) return service.themes;
  if (Array.isArray(service.service_themes)) return service.service_themes;
  if (service.theme) return [service.theme];
  return [];
};

