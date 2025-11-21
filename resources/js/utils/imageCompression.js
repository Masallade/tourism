/**
 * Client-side image compression utility
 * Compresses images before upload to reduce file size
 */

/**
 * Compress an image file
 * @param {File} file - The image file to compress
 * @param {Object} options - Compression options
 * @param {number} options.maxWidth - Maximum width (default: 1920)
 * @param {number} options.maxHeight - Maximum height (default: 1080)
 * @param {number} options.quality - JPEG quality 0-1 (default: 0.85)
 * @param {number} options.maxSizeMB - Maximum file size in MB (default: 2)
 * @returns {Promise<File>} - Compressed image file
 */
export const compressImage = (file, options = {}) => {
    return new Promise((resolve, reject) => {
        const {
            maxWidth = 1920,
            maxHeight = 1080,
            quality = 0.85,
            maxSizeMB = 2
        } = options;

        // If file is already small enough, return as is
        if (file.size <= maxSizeMB * 1024 * 1024) {
            resolve(file);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                // Calculate new dimensions maintaining aspect ratio
                let width = img.width;
                let height = img.height;

                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width = width * ratio;
                    height = height * ratio;
                }

                // Create canvas
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');

                // Draw image on canvas
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to blob with compression
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Failed to compress image'));
                            return;
                        }

                        // If still too large, reduce quality further
                        if (blob.size > maxSizeMB * 1024 * 1024) {
                            let currentQuality = quality;
                            let attempts = 0;
                            const maxAttempts = 5;

                            const tryCompress = () => {
                                canvas.toBlob(
                                    (compressedBlob) => {
                                        if (!compressedBlob) {
                                            // If compression fails, use the best we have
                                            const compressedFile = new File(
                                                [blob],
                                                file.name,
                                                {
                                                    type: file.type,
                                                    lastModified: Date.now()
                                                }
                                            );
                                            resolve(compressedFile);
                                            return;
                                        }

                                        if (compressedBlob.size <= maxSizeMB * 1024 * 1024 || attempts >= maxAttempts) {
                                            const compressedFile = new File(
                                                [compressedBlob],
                                                file.name,
                                                {
                                                    type: file.type,
                                                    lastModified: Date.now()
                                                }
                                            );
                                            resolve(compressedFile);
                                        } else {
                                            currentQuality = Math.max(0.3, currentQuality - 0.1);
                                            attempts++;
                                            tryCompress();
                                        }
                                    },
                                    file.type,
                                    currentQuality
                                );
                            };

                            tryCompress();
                        } else {
                            const compressedFile = new File(
                                [blob],
                                file.name,
                                {
                                    type: file.type,
                                    lastModified: Date.now()
                                }
                            );
                            resolve(compressedFile);
                        }
                    },
                    file.type,
                    quality
                );
            };

            img.onerror = () => {
                reject(new Error('Failed to load image'));
            };

            img.src = e.target.result;
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsDataURL(file);
    });
};

/**
 * Compress multiple image files
 * @param {File[]} files - Array of image files to compress
 * @param {Object} options - Compression options
 * @returns {Promise<File[]>} - Array of compressed image files
 */
export const compressImages = async (files, options = {}) => {
    const compressedFiles = [];
    for (const file of files) {
        try {
            // Only compress image files
            if (file.type.startsWith('image/')) {
                const compressed = await compressImage(file, options);
                compressedFiles.push(compressed);
            } else {
                // For non-image files (like PDFs), keep as is
                compressedFiles.push(file);
            }
        } catch (error) {
            console.error('Error compressing file:', file.name, error);
            // If compression fails, use original file
            compressedFiles.push(file);
        }
    }
    return compressedFiles;
};

/**
 * Get compression settings for different image types
 */
export const getCompressionSettings = (imageType) => {
    const settings = {
        service_provider: {
            maxWidth: 1920,
            maxHeight: 1080,
            quality: 0.85,
            maxSizeMB: 2
        },
        service: {
            maxWidth: 1920,
            maxHeight: 1080,
            quality: 0.85,
            maxSizeMB: 3
        },
        country: {
            maxWidth: 1200,
            maxHeight: 800,
            quality: 0.85,
            maxSizeMB: 1
        },
        theme: {
            maxWidth: 800,
            maxHeight: 600,
            quality: 0.85,
            maxSizeMB: 2
        },
        about_hero: {
            maxWidth: 1920,
            maxHeight: 600,
            quality: 0.85,
            maxSizeMB: 2
        },
        about_mission: {
            maxWidth: 800,
            maxHeight: 600,
            quality: 0.85,
            maxSizeMB: 2
        },
        about_team: {
            maxWidth: 400,
            maxHeight: 400,
            quality: 0.85,
            maxSizeMB: 1
        },
        document: {
            maxWidth: 1920,
            maxHeight: 1920,
            quality: 0.8,
            maxSizeMB: 2
        }
    };

    return settings[imageType] || settings.service_provider;
};

