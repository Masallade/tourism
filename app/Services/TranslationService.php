<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class TranslationService
{
    private $apiUrl;
    private $apiKey;
    
    public function __construct()
    {
        // Use public LibreTranslate instance or your self-hosted one
        $this->apiUrl = config('services.translation.libretranslate_url', 'https://libretranslate.com/translate');
        $this->apiKey = config('services.translation.api_key');
    }
    
    /**
     * Translate text to target language
     */
    public function translate(string $text, string $targetLang, string $sourceLang = 'en'): string
    {
        // Don't translate if already in target language or empty
        if ($sourceLang === $targetLang || empty(trim($text))) {
            return $text;
        }
        
        // Create cache key
        $cacheKey = "translation:mymemory:{$sourceLang}:{$targetLang}:" . md5($text);
        
        // Check cache first (cache for 30 days to avoid repeated API calls)
        return Cache::remember($cacheKey, now()->addDays(30), function () use ($text, $targetLang, $sourceLang) {
            try {
                // Use MyMemory by default (free, no API key required)
                return $this->translateMyMemory($text, $targetLang, $sourceLang);
            } catch (\Exception $e) {
                Log::error('Translation failed: ' . $e->getMessage(), [
                    'text' => substr($text, 0, 100),
                    'source' => $sourceLang,
                    'target' => $targetLang
                ]);
                return $text; // Return original on failure
            }
        });
    }
    
    /**
     * Translate array of texts (batch translation)
     */
    public function translateArray(array $texts, string $targetLang, string $sourceLang = 'en'): array
    {
        $translated = [];
        foreach ($texts as $key => $text) {
            if (is_string($text) && !empty(trim($text))) {
                $translated[$key] = $this->translate($text, $targetLang, $sourceLang);
            } elseif (is_array($text)) {
                $translated[$key] = $this->translateArray($text, $targetLang, $sourceLang);
            } else {
                $translated[$key] = $text;
            }
        }
        return $translated;
    }
    
    /**
     * MyMemory Translation API (Free, no API key required, 10,000 words/day limit)
     */
    private function translateMyMemory(string $text, string $targetLang, string $sourceLang): string
    {
        // Add delay to avoid rate limiting (300ms between requests)
        usleep(300000); // 300ms delay
        
        try {
            $response = Http::timeout(10)
                ->retry(1, 500)
                ->get('https://api.mymemory.translated.net/get', [
                    'q' => $text,
                    'langpair' => "{$sourceLang}|{$targetLang}",
                ]);
            
            if ($response->successful()) {
                $data = $response->json();
                
                if (isset($data['responseData']['translatedText'])) {
                    $translated = $data['responseData']['translatedText'];
                    // Only return if translation is different from original
                    if ($translated !== $text && !empty(trim($translated))) {
                        return $translated;
                    }
                }
            }
        } catch (\Exception $e) {
            Log::warning('MyMemory translation failed', [
                'error' => $e->getMessage(),
                'source' => $sourceLang,
                'target' => $targetLang
            ]);
        }
        
        return $text; // Fallback to original
    }
    
    /**
     * Batch translate multiple texts (more efficient)
     */
    public function translateBatch(array $texts, string $targetLang, string $sourceLang = 'en'): array
    {
        // LibreTranslate supports batch translation by sending array
        $langMap = [
            'en' => 'en',
            'es' => 'es',
            'fr' => 'fr',
        ];
        
        $source = $langMap[$sourceLang] ?? $sourceLang;
        $target = $langMap[$targetLang] ?? $targetLang;
        
        // Create cache key for batch
        $cacheKey = "translation:batch:{$sourceLang}:{$targetLang}:" . md5(json_encode($texts));
        
        return Cache::remember($cacheKey, now()->addDays(30), function () use ($texts, $target, $source) {
            try {
                $response = Http::timeout(30)
                    ->retry(2, 100)
                    ->post($this->apiUrl, [
                        'q' => $texts, // Send array for batch
                        'source' => $source,
                        'target' => $target,
                        'format' => 'text',
                    ]);
                
                if ($response->successful()) {
                    $data = $response->json();
                    if (isset($data['translatedText'])) {
                        return is_array($data['translatedText']) 
                            ? $data['translatedText'] 
                            : [$data['translatedText']];
                    }
                }
            } catch (\Exception $e) {
                Log::error('LibreTranslate batch failed: ' . $e->getMessage());
            }
            
            // Fallback: translate individually
            return $this->translateArray($texts, $targetLang, $sourceLang);
        });
    }
}

