import React, { useState } from 'react';

const ServiceForm = ({ serviceTypes, country, onSubmit, onClose, loading }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [serviceTypeId, setServiceTypeId] = useState(serviceTypes[0]?.id || '');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !serviceTypeId) {
      setError('Name and type are required.');
      return;
    }
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('service_type_id', serviceTypeId);
    formData.append('country_id', country.id);
    if (image) formData.append('image', image);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-100 text-red-700 p-2 rounded text-center">{error}</div>}
      <div>
        <label className="block text-sm font-semibold mb-1">Service Name</label>
        <input type="text" className="w-full px-3 py-2 border rounded" value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Type</label>
        <select className="w-full px-3 py-2 border rounded" value={serviceTypeId} onChange={e => setServiceTypeId(e.target.value)} required>
          {serviceTypes.map(type => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Country</label>
        <input type="text" className="w-full px-3 py-2 border rounded bg-gray-100" value={country.name} disabled />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Description</label>
        <textarea className="w-full px-3 py-2 border rounded" value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Price</label>
        <input type="number" className="w-full px-3 py-2 border rounded" value={price} onChange={e => setPrice(e.target.value)} min="0" step="0.01" />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Image</label>
        <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />
      </div>
      <div className="flex gap-2 justify-end mt-4">
        <button type="button" className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" onClick={onClose}>Cancel</button>
        <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold" disabled={loading}>{loading ? 'Saving...' : 'Save Service'}</button>
      </div>
    </form>
  );
};

export default ServiceForm;
