import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';

const AboutPageEditor = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [aboutPage, setAboutPage] = useState({
        hero_title: '',
        hero_subtitle: '',
        hero_image: '',
        mission_title: '',
        mission_description: '',
        mission_image: '',
        mission_stat_number: '',
        mission_stat_label: '',
        values_title: '',
        values: [],
        impact_title: '',
        impact_stat_1_number: '',
        impact_stat_2_number: '',
        impact_stat_3_number: '',
        impact_stat_4_number: '',
        team_title: '',
        team_description: '',
        team_members: [],
        cta_title: '',
        cta_description: '',
    });
    const [heroImageFile, setHeroImageFile] = useState(null);
    const [missionImageFile, setMissionImageFile] = useState(null);
    const [teamMemberImageFiles, setTeamMemberImageFiles] = useState({});

    useEffect(() => {
        fetchAboutPage();
    }, []);

    const fetchAboutPage = async () => {
        try {
            const response = await window.apiClient.get('/api/about-page');
            if (response.data) {
                const data = response.data;
                setAboutPage({
                    hero_title: data.hero_title || '',
                    hero_subtitle: data.hero_subtitle || '',
                    hero_image: data.hero_image || '',
                    mission_title: data.mission_title || '',
                    mission_description: data.mission_description || '',
                    mission_image: data.mission_image || data.mission_image_url || '',
                    mission_stat_number: data.mission_stat_number || '',
                    mission_stat_label: data.mission_stat_label || '',
                    values_title: data.values_title || '',
                    values: data.values && Array.isArray(data.values) ? data.values : [],
                    impact_title: data.impact_title || '',
                    impact_stat_1_number: data.impact_stat_1_number || '',
                    impact_stat_2_number: data.impact_stat_2_number || '',
                    impact_stat_3_number: data.impact_stat_3_number || '',
                    impact_stat_4_number: data.impact_stat_4_number || '',
                    team_title: data.team_title || '',
                    team_description: data.team_description || '',
                    team_members: data.team_members && Array.isArray(data.team_members) ? data.team_members : [],
                    cta_title: data.cta_title || '',
                    cta_description: data.cta_description || '',
                });
            }
        } catch (error) {
            console.error('Error fetching about page:', error);
            setErrorMessage('Failed to load about page content. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAboutPage(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTeamMemberChange = (index, field, value) => {
        setAboutPage(prev => {
            const newMembers = [...prev.team_members];
            newMembers[index] = {
                ...newMembers[index],
                [field]: value
            };
            return {
                ...prev,
                team_members: newMembers
            };
        });
    };

    const addTeamMember = () => {
        setAboutPage(prev => ({
            ...prev,
            team_members: [...prev.team_members, { name: '', role: '', image: '' }]
        }));
    };

    const removeTeamMember = (index) => {
        setAboutPage(prev => ({
            ...prev,
            team_members: prev.team_members.filter((_, i) => i !== index)
        }));
    };

    const handleValueChange = (index, field, value) => {
        setAboutPage(prev => {
            const newValues = [...prev.values];
            newValues[index] = {
                ...newValues[index],
                [field]: value
            };
            return {
                ...prev,
                values: newValues
            };
        });
    };

    const addValue = () => {
        setAboutPage(prev => ({
            ...prev,
            values: [...prev.values, { title: '', description: '' }]
        }));
    };

    const removeValue = (index) => {
        setAboutPage(prev => ({
            ...prev,
            values: prev.values.filter((_, i) => i !== index)
        }));
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }
        return `/storage/${imagePath}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const formData = new FormData();
            
            // Add all text fields (excluding image fields - they're handled separately)
            Object.keys(aboutPage).forEach(key => {
                // Skip image fields - they're handled separately below
                if (key === 'hero_image' || key === 'mission_image') {
                    return;
                }
                
                if (key === 'team_members' || key === 'values') {
                    formData.append(key, JSON.stringify(aboutPage[key]));
                } else {
                    formData.append(key, aboutPage[key] || '');
                }
            });

            // Add image files only if new files are selected
            // Don't send existing image paths as strings - backend will preserve them
            if (heroImageFile) {
                formData.append('hero_image', heroImageFile);
            }
            if (missionImageFile) {
                formData.append('mission_image', missionImageFile);
            }
            
            // Add team member images with their indices
            Object.keys(teamMemberImageFiles).forEach(index => {
                if (teamMemberImageFiles[index]) {
                    formData.append(`team_member_images[${index}]`, teamMemberImageFiles[index]);
                }
            });

            await window.apiClient.post('/api/about-page', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            setSuccessMessage('About page content saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
            
            // Clear file inputs after successful save
            setHeroImageFile(null);
            setMissionImageFile(null);
            setTeamMemberImageFiles({});
            
            // Refresh data to get updated image paths
            fetchAboutPage();
        } catch (error) {
            console.error('Error saving about page:', error);
            setErrorMessage(error.response?.data?.message || 'Failed to save about page content. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-700/40">
                <ClipLoader color="#10b981" size={60} speedMultiplier={0.9} />
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">About Page Content</h1>

            {successMessage && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        <span className="text-green-700">{successMessage}</span>
                    </div>
                </div>
            )}

            {errorMessage && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                        </svg>
                        <span className="text-red-700">{errorMessage}</span>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-8">
                {/* Hero Section */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Hero Section</h2>
                    
                    <div className="mb-4">
                        <label htmlFor="hero_title" className="block text-sm font-medium text-gray-700 mb-2">
                            Hero Title
                        </label>
                        <input
                            type="text"
                            id="hero_title"
                            name="hero_title"
                            value={aboutPage.hero_title}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="About Unison Tour"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="hero_subtitle" className="block text-sm font-medium text-gray-700 mb-2">
                            Hero Subtitle
                        </label>
                        <input
                            type="text"
                            id="hero_subtitle"
                            name="hero_subtitle"
                            value={aboutPage.hero_subtitle}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Pioneering sustainable tourism for a better tomorrow"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="hero_image" className="block text-sm font-medium text-gray-700 mb-2">
                            Hero Image
                        </label>
                        <div className="mb-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800 font-medium mb-1">📐 Recommended Size:</p>
                            <p className="text-xs text-blue-700">1920 × 600 pixels (16:5 aspect ratio)</p>
                            <p className="text-xs text-blue-600 mt-1">Max file size: 2MB | Formats: JPG, PNG</p>
                        </div>
                        <input
                            type="file"
                            id="hero_image"
                            name="hero_image"
                            accept="image/*"
                            onChange={(e) => setHeroImageFile(e.target.files[0] || null)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        {aboutPage.hero_image && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <p className="text-sm font-medium text-gray-700 mb-2">Current image:</p>
                                <div className="relative inline-block">
                                    <img 
                                        src={getImageUrl(aboutPage.hero_image)} 
                                        alt="Hero" 
                                        className="w-full max-w-md h-auto object-cover rounded-lg border-2 border-gray-300 shadow-md"
                                    />
                                </div>
                            </div>
                        )}
                        {heroImageFile && (
                            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                                <p className="text-sm font-medium text-green-700 mb-2">✨ New image selected:</p>
                                <div className="relative inline-block">
                                    <img 
                                        src={URL.createObjectURL(heroImageFile)} 
                                        alt="Preview" 
                                        className="w-full max-w-md h-auto object-cover rounded-lg border-2 border-green-400 shadow-md"
                                    />
                                </div>
                                <p className="text-xs text-green-600 mt-2">
                                    File: {heroImageFile.name} ({(heroImageFile.size / 1024 / 1024).toFixed(2)} MB)
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mission Section */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Mission Section</h2>
                    
                    <div className="mb-4">
                        <label htmlFor="mission_title" className="block text-sm font-medium text-gray-700 mb-2">
                            Mission Title
                        </label>
                        <input
                            type="text"
                            id="mission_title"
                            name="mission_title"
                            value={aboutPage.mission_title}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Our Mission"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="mission_description" className="block text-sm font-medium text-gray-700 mb-2">
                            Mission Description
                        </label>
                        <textarea
                            id="mission_description"
                            name="mission_description"
                            value={aboutPage.mission_description}
                            onChange={handleChange}
                            rows="5"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="At Unison Tour, we believe that exploring the world shouldn't come at the expense of our planet..."
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="mission_image" className="block text-sm font-medium text-gray-700 mb-2">
                            Mission Image
                        </label>
                        <div className="mb-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800 font-medium mb-1">📐 Recommended Size:</p>
                            <p className="text-xs text-blue-700">800 × 600 pixels (4:3 aspect ratio)</p>
                            <p className="text-xs text-blue-600 mt-1">Max file size: 2MB | Formats: JPG, PNG</p>
                        </div>
                        <input
                            type="file"
                            id="mission_image"
                            name="mission_image"
                            accept="image/*"
                            onChange={(e) => setMissionImageFile(e.target.files[0] || null)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        {aboutPage.mission_image && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <p className="text-sm font-medium text-gray-700 mb-2">Current image:</p>
                                <div className="relative inline-block">
                                    <img 
                                        src={getImageUrl(aboutPage.mission_image)} 
                                        alt="Mission" 
                                        className="w-full max-w-sm h-auto object-cover rounded-lg border-2 border-gray-300 shadow-md"
                                    />
                                </div>
                            </div>
                        )}
                        {missionImageFile && (
                            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                                <p className="text-sm font-medium text-green-700 mb-2">✨ New image selected:</p>
                                <div className="relative inline-block">
                                    <img 
                                        src={URL.createObjectURL(missionImageFile)} 
                                        alt="Preview" 
                                        className="w-full max-w-sm h-auto object-cover rounded-lg border-2 border-green-400 shadow-md"
                                    />
                                </div>
                                <p className="text-xs text-green-600 mt-2">
                                    File: {missionImageFile.name} ({(missionImageFile.size / 1024 / 1024).toFixed(2)} MB)
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="mission_stat_number" className="block text-sm font-medium text-gray-700 mb-2">
                                Stat Number
                            </label>
                            <input
                                type="text"
                                id="mission_stat_number"
                                name="mission_stat_number"
                                value={aboutPage.mission_stat_number}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="10K+"
                            />
                        </div>
                        <div>
                            <label htmlFor="mission_stat_label" className="block text-sm font-medium text-gray-700 mb-2">
                                Stat Label
                            </label>
                            <input
                                type="text"
                                id="mission_stat_label"
                                name="mission_stat_label"
                                value={aboutPage.mission_stat_label}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Eco-Travelers"
                            />
                        </div>
                    </div>
                </div>

                {/* Values Section */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Core Values Section</h2>
                    
                    <div className="mb-4">
                        <label htmlFor="values_title" className="block text-sm font-medium text-gray-700 mb-2">
                            Values Title
                        </label>
                        <input
                            type="text"
                            id="values_title"
                            name="values_title"
                            value={aboutPage.values_title}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Our Core Values"
                        />
                    </div>

                    <div className="mb-4">
                        <button
                            type="button"
                            onClick={addValue}
                            className="mb-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Value
                        </button>
                    </div>

                    {aboutPage.values.map((value, index) => (
                        <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg font-semibold text-gray-700">Value {index + 1}</h3>
                                <button
                                    type="button"
                                    onClick={() => removeValue(index)}
                                    className="text-red-600 hover:text-red-800 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={value.title || ''}
                                    onChange={(e) => handleValueChange(index, 'title', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Value Title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={value.description || ''}
                                    onChange={(e) => handleValueChange(index, 'description', e.target.value)}
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Value description..."
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Impact Section */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Impact Section</h2>
                    
                    <div className="mb-4">
                        <label htmlFor="impact_title" className="block text-sm font-medium text-gray-700 mb-2">
                            Impact Title
                        </label>
                        <input
                            type="text"
                            id="impact_title"
                            name="impact_title"
                            value={aboutPage.impact_title}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Our Impact"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { num: 1, label: 'Countries Covered' },
                            { num: 2, label: 'Eco-Partners' },
                            { num: 3, label: 'Happy Travelers' },
                            { num: 4, label: 'Trees Planted' }
                        ].map((stat) => (
                            <div key={stat.num} className="p-4 border border-gray-200 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-700 mb-3">{stat.label}</h3>
                                <div>
                                    <label htmlFor={`impact_stat_${stat.num}_number`} className="block text-sm font-medium text-gray-700 mb-2">
                                        Value (e.g., 10K+, 50+, 1M+)
                                    </label>
                                    <input
                                        type="text"
                                        id={`impact_stat_${stat.num}_number`}
                                        name={`impact_stat_${stat.num}_number`}
                                        value={aboutPage[`impact_stat_${stat.num}_number`]}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="10K+"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team Section */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Team Section</h2>
                    
                    <div className="mb-4">
                        <label htmlFor="team_title" className="block text-sm font-medium text-gray-700 mb-2">
                            Team Title
                        </label>
                        <input
                            type="text"
                            id="team_title"
                            name="team_title"
                            value={aboutPage.team_title}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Meet Our Team"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="team_description" className="block text-sm font-medium text-gray-700 mb-2">
                            Team Description
                        </label>
                        <textarea
                            id="team_description"
                            name="team_description"
                            value={aboutPage.team_description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Passionate environmental advocates and travel experts..."
                        />
                    </div>

                    <div className="mb-4">
                        <button
                            type="button"
                            onClick={addTeamMember}
                            className="mb-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Team Member
                        </button>
                    </div>

                    <div className="space-y-4">
                        {aboutPage.team_members.map((member, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-lg font-semibold text-gray-700">Team Member {index + 1}</h3>
                                    <button
                                        type="button"
                                        onClick={() => removeTeamMember(index)}
                                        className="text-red-600 hover:text-red-800 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            value={member.name || ''}
                                            onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Role
                                        </label>
                                        <input
                                            type="text"
                                            value={member.role || ''}
                                            onChange={(e) => handleTeamMemberChange(index, 'role', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="Founder & CEO"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Image (Upload or URL)
                                        </label>
                                        <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded">
                                            <p className="text-xs text-blue-700">📐 Recommended: 400 × 400px (Square)</p>
                                            <p className="text-xs text-blue-600">Max: 2MB | JPG, PNG</p>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    setTeamMemberImageFiles(prev => ({
                                                        ...prev,
                                                        [index]: file
                                                    }));
                                                }
                                            }}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mb-2"
                                        />
                                        <input
                                            type="text"
                                            value={member.image || ''}
                                            onChange={(e) => handleTeamMemberChange(index, 'image', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="Or enter image URL"
                                        />
                                        {(member.image || teamMemberImageFiles[index]) && (
                                            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                <p className="text-xs text-gray-600 mb-2">Preview:</p>
                                                <div className="relative inline-block">
                                                    <img 
                                                        src={teamMemberImageFiles[index] 
                                                            ? URL.createObjectURL(teamMemberImageFiles[index])
                                                            : getImageUrl(member.image)
                                                        } 
                                                        alt={member.name || 'Team member'} 
                                                        className="w-32 h-32 object-cover rounded-full border-2 border-gray-300 shadow-md"
                                                    />
                                                </div>
                                                {teamMemberImageFiles[index] && (
                                                    <p className="text-xs text-green-600 mt-2">
                                                        File: {teamMemberImageFiles[index].name} ({(teamMemberImageFiles[index].size / 1024).toFixed(2)} KB)
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Call to Action Section</h2>
                    
                    <div className="mb-4">
                        <label htmlFor="cta_title" className="block text-sm font-medium text-gray-700 mb-2">
                            CTA Title
                        </label>
                        <input
                            type="text"
                            id="cta_title"
                            name="cta_title"
                            value={aboutPage.cta_title}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Ready to Travel Sustainably?"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="cta_description" className="block text-sm font-medium text-gray-700 mb-2">
                            CTA Description
                        </label>
                        <textarea
                            id="cta_description"
                            name="cta_description"
                            value={aboutPage.cta_description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Join thousands of eco-conscious travelers..."
                        />
                    </div>
                    <p className="text-sm text-gray-500 italic">
                        Note: The "Explore Destinations" and "Get in Touch" buttons are hardcoded in the view and cannot be edited here.
                    </p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4 border-t border-gray-200">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <>
                                <ClipLoader color="#ffffff" size={20} className="mr-2" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                                </svg>
                                Save About Page
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AboutPageEditor;

