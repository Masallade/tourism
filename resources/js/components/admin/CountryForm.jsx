import React, { useState, useEffect } from 'react';

const CountryForm = ({ country, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        image_url: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (country) {
            setFormData({
                name: country.name || '',
                slug: country.slug || '',
                description: country.description || '',
                image_url: country.image_url || ''
            });
        }
    }, [country]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Auto-generate slug from name
        if (name === 'name') {
            const slug = value.toLowerCase()
                .replace(/[^a-z0-9 -]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim('-');
            setFormData(prev => ({
                ...prev,
                slug: slug
            }));
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        // Validate type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            setErrors(prev => ({ ...prev, image: 'Only JPG, PNG, WEBP images allowed.' }));
            return;
        }
        // Validate size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, image: 'Image size must be less than 2MB.' }));
            return;
        }
        setImageFile(file);
        setErrors(prev => ({ ...prev, image: '' }));
        // Preview
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Country name is required';
        }

        if (!formData.slug.trim()) {
            newErrors.slug = 'Slug is required';
        }

        // Image validation
        if (imageFile) {
            const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
            if (!validTypes.includes(imageFile.type)) {
                newErrors.image = 'Only JPG, PNG, WEBP images allowed.';
            }
            if (imageFile.size > 2 * 1024 * 1024) {
                newErrors.image = 'Image size must be less than 2MB.';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const form = new FormData();
            form.append('name', formData.name.trim());
            form.append('slug', formData.slug.trim());
            form.append('description', formData.description.trim());
            if (imageFile) {
                form.append('image', imageFile);
            } else if (formData.image_url) {
                form.append('image_url', formData.image_url);
            }

            let responseData;
            if (country) {
                // For FormData updates, use POST to /update endpoint
                // Laravel API routes don't support method spoofing, so we use a dedicated POST route
                responseData = await window.apiClient.upload(`/api/countries/${country.id}/update`, form);
            } else {
                responseData = await window.apiClient.upload('/api/countries', form);
            }

            // Check if image was saved
            if (imageFile && responseData.data) {
                const savedCountry = responseData.data.country || responseData.data;
                if (savedCountry?.image_url) {
                    const imagePath = savedCountry.image_url;
                    console.log('Image saved successfully:', imagePath);
                    setSuccessMessage(`✅ Image saved successfully to: ${imagePath}`);
                    // Clear success message after 5 seconds
                    setTimeout(() => setSuccessMessage(''), 5000);
                } else {
                    console.error('Image not in response:', responseData.data);
                    setErrors({ 
                        image: '❌ Image file was not saved. Please check storage permissions and try again.',
                        general: 'Country saved but image upload failed. The image_url was not returned. Please try uploading the image again.'
                    });
                    setIsSubmitting(false);
                    return;
                }
            } else if (!imageFile && responseData.data) {
                // Country saved without image
                setSuccessMessage('✅ Country saved successfully');
                setTimeout(() => setSuccessMessage(''), 3000);
            }

            if (responseData.data?.success === false) {
                if (responseData.data.errors) {
                    setErrors(responseData.data.errors);
                } else {
                    setErrors({ general: responseData.data.message || 'An error occurred while saving the country' });
                }
                setIsSubmitting(false);
                return;
            }

            onSuccess();
        } catch (error) {
            console.error('Error saving country:', error);
            
            // Extract error messages
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else if (error.response?.data?.message) {
                setErrors({ general: error.response.data.message });
            } else if (error.message) {
                setErrors({ general: error.message });
            } else {
                setErrors({ general: 'An error occurred while saving the country. Please try again.' });
            }
            
            // Check specifically for image upload errors
            if (imageFile && error.response?.data?.errors?.image) {
                setErrors(prev => ({ 
                    ...prev, 
                    image: error.response.data.errors.image[0] || 'Image upload failed. Please try again.'
                }));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                        {country ? 'Edit Country' : 'Add New Country'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Country Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                    errors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter country name"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Slug <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                    errors.slug ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="country-name-slug"
                            />
                            {errors.slug && (
                                <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Enter country description"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country Image</label>
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/jpg"
                            onChange={handleImageChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        {errors.image && (
                            <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                        )}
                        {imagePreview && (
                            <img src={imagePreview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded shadow" />
                        )}
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Or Image URL</label>
                        <input
                            type="url"
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleInputChange}
                            placeholder="https://example.com/image.jpg"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">If a file is chosen, it will be used instead of the URL.</p>
                    </div>

                    {successMessage && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">
                            {successMessage}
                        </div>
                    )}

                    {errors.general && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                            {errors.general}
                        </div>
                    )}
                    
                    {errors.image && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
                            {Array.isArray(errors.image) ? errors.image[0] : errors.image}
                        </div>
                    )}

                    <div className="flex justify-end mt-6 space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Saving...' : (country ? 'Update Country' : 'Create Country')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CountryForm; 