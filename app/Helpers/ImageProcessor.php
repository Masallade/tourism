<?php

namespace App\Helpers;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
class ImageProcessor
{
    /**
     * Maximum dimensions for different image types
     */
    private static $maxDimensions = [
        'service_provider' => ['width' => 1920, 'height' => 1080], // 16:9 ratio
        'service' => ['width' => 1920, 'height' => 1080], // 16:9 ratio
        'country' => ['width' => 1200, 'height' => 800], // 3:2 ratio
        'theme' => ['width' => 800, 'height' => 600], // 4:3 ratio
        'destination' => ['width' => 1920, 'height' => 1080], // 16:9 ratio for destination images
        'about_hero' => ['width' => 1920, 'height' => 600], // 16:5 ratio
        'about_mission' => ['width' => 800, 'height' => 600], // 4:3 ratio
        'about_team' => ['width' => 400, 'height' => 400], // 1:1 ratio (square)
    ];

    /**
     * Maximum file sizes in bytes
     */
    private static $maxSizes = [
        'service_provider' => 2 * 1024 * 1024, // 2MB
        'service' => 3 * 1024 * 1024, // 3MB
        'country' => 1 * 1024 * 1024, // 1MB
        'theme' => 2 * 1024 * 1024, // 2MB
        'destination' => 2 * 1024 * 1024, // 2MB target after compression (allows 5MB upload, compresses to 2MB)
        'about_hero' => 2 * 1024 * 1024, // 2MB
        'about_mission' => 2 * 1024 * 1024, // 2MB
        'about_team' => 1 * 1024 * 1024, // 1MB
    ];

    /**
     * Quality settings for JPEG compression
     */
    private static $jpegQuality = 85;

    /**
     * Quality settings for PNG compression (0-9, lower is better)
     */
    private static $pngQuality = 6;

    /**
     * Process and compress an uploaded image
     * 
     * @param UploadedFile $file
     * @param string $type Image type (service_provider, service, country, theme, etc.)
     * @param string $storagePath Storage path where image will be saved
     * @return string Path to saved image
     */
    public static function processAndStore(UploadedFile $file, string $type, string $storagePath): string
    {
        return self::processWithGD($file, $type, $storagePath);
    }

    /**
     * Process image using PHP GD library (fallback)
     */
    private static function processWithGD(UploadedFile $file, string $type, string $storagePath): string
    {
        $maxDim = self::$maxDimensions[$type] ?? ['width' => 1920, 'height' => 1080];
        $maxSize = self::$maxSizes[$type] ?? 2 * 1024 * 1024;

        $filePath = $file->getRealPath();
        $extension = strtolower($file->getClientOriginalExtension());
        
        // Create image resource based on type
        switch ($extension) {
            case 'jpg':
            case 'jpeg':
                $sourceImage = imagecreatefromjpeg($filePath);
                break;
            case 'png':
                $sourceImage = imagecreatefrompng($filePath);
                break;
            case 'webp':
                if (function_exists('imagecreatefromwebp')) {
                    $sourceImage = imagecreatefromwebp($filePath);
                } else {
                    throw new \Exception('WebP support not available in GD library');
                }
                break;
            default:
                throw new \Exception('Unsupported image format: ' . $extension);
        }

        if (!$sourceImage) {
            throw new \Exception('Failed to create image from file');
        }

        // Get original dimensions
        $originalWidth = imagesx($sourceImage);
        $originalHeight = imagesy($sourceImage);

        // Calculate new dimensions maintaining aspect ratio
        $newWidth = $originalWidth;
        $newHeight = $originalHeight;

        if ($originalWidth > $maxDim['width'] || $originalHeight > $maxDim['height']) {
            $ratio = min($maxDim['width'] / $originalWidth, $maxDim['height'] / $originalHeight);
            $newWidth = (int)($originalWidth * $ratio);
            $newHeight = (int)($originalHeight * $ratio);
        }

        // Create new image with new dimensions
        $newImage = imagecreatetruecolor($newWidth, $newHeight);

        // Preserve transparency for PNG
        if ($extension === 'png') {
            imagealphablending($newImage, false);
            imagesavealpha($newImage, true);
            $transparent = imagecolorallocatealpha($newImage, 255, 255, 255, 127);
            imagefill($newImage, 0, 0, $transparent);
        }

        // Resize image
        imagecopyresampled(
            $newImage,
            $sourceImage,
            0, 0, 0, 0,
            $newWidth,
            $newHeight,
            $originalWidth,
            $originalHeight
        );

        // Generate filename
        $filename = time() . '_' . uniqid() . '.' . $extension;
        $fullPath = $storagePath . '/' . $filename;

        // Save to temporary file first
        $tempPath = sys_get_temp_dir() . '/' . $filename;

        // Save with compression
        $quality = self::$jpegQuality;
        if ($extension === 'png') {
            imagepng($newImage, $tempPath, self::$pngQuality);
        } elseif ($extension === 'webp' && function_exists('imagewebp')) {
            imagewebp($newImage, $tempPath, $quality);
        } else {
            imagejpeg($newImage, $tempPath, $quality);
        }

        // Check file size and compress further if needed
        $fileSize = filesize($tempPath);
        $attempts = 0;
        while ($fileSize > $maxSize && $attempts < 5) {
            if ($extension === 'png') {
                imagepng($newImage, $tempPath, min(9, self::$pngQuality + $attempts + 1));
            } else {
                $quality = max(60, self::$jpegQuality - ($attempts * 5));
                if ($extension === 'webp' && function_exists('imagewebp')) {
                    imagewebp($newImage, $tempPath, $quality);
                } else {
                    imagejpeg($newImage, $tempPath, $quality);
                }
            }
            $fileSize = filesize($tempPath);
            $attempts++;
        }

        // Store the processed image
        Storage::disk('public')->put($fullPath, file_get_contents($tempPath));

        // Clean up
        imagedestroy($sourceImage);
        imagedestroy($newImage);
        @unlink($tempPath);

        return $fullPath;
    }

    /**
     * Check if image processing is available
     */
    public static function isAvailable(): bool
    {
        return extension_loaded('gd') || class_exists('\Intervention\Image\Facades\Image');
    }
}

