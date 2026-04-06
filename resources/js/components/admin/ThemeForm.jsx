import React, { useState, useEffect } from 'react';
import { compressImage, getCompressionSettings } from '../../utils/imageCompression';

const ThemeForm = ({ theme, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        image_url: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (theme) {
            setFormData({
                name: theme.name || '',
                image_url: theme.image_url || ''
            });
        }
    }, [theme]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

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
        // Validate size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB.' }));
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
            newErrors.name = 'Theme name is required';
        }

        // Image validation
        if (imageFile) {
            const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
            if (!validTypes.includes(imageFile.type)) {
                newErrors.image = 'Only JPG, PNG, WEBP images allowed.';
            }
            if (imageFile.size > 5 * 1024 * 1024) {
                newErrors.image = 'Image size must be less than 5MB.';
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
        form.append('name', formData.name);
        if (imageFile) {
            try {
                const compressionSettings = getCompressionSettings('theme');
                const compressedImage = await compressImage(imageFile, compressionSettings);
                form.append('image', compressedImage, compressedImage.name);
            } catch (error) {
                console.error('Error compressing image, using original:', error);
                form.append('image', imageFile);
            }
        } else if (formData.image_url) {
            form.append('image_url', formData.image_url);
        }

        if (theme) {
            await window.apiClient.upload(`/api/themes/${theme.id}/update`, form);
        } else {
            await window.apiClient.upload('/api/themes', form);
        }

        onSuccess();
        } catch (error) {
            console.error('Error saving theme:', error);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else if (error.response?.data?.message) {
                setErrors({ general: error.response.data.message });
            } else {
                setErrors({ general: 'An error occurred while saving the theme' });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                        {theme ? 'Edit Theme' : 'Add New Theme'}
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Theme Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter theme name"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">Examples: Adventure, Cultural, Wildlife, Beach, Mountain</p>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Theme Image</label>
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

                    {errors.general && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                            {errors.general}
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
                            {isSubmitting ? 'Saving...' : (theme ? 'Update Theme' : 'Create Theme')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ThemeForm; 