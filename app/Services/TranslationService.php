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
        return Cache::remember($cacheKey, now()->addDays(30), function () use ($text, $targetLang, $sourceLang, $cacheKey) {
            try {
                // Use MyMemory by default (free, no API key required)
                $translated = $this->translateMyMemory($text, $targetLang, $sourceLang);
                
                // Don't cache error messages - if translation contains error text, return original and don't cache
                if (stripos($translated, 'QUERY LENGTH LIMIT EXCEEDED') !== false || 
                    stripos($translated, 'MAX ALLOWED QUERY') !== false) {
                    Log::warning('Translation returned error message, not caching', [
                        'cache_key' => $cacheKey,
                        'text_length' => mb_strlen($text)
                    ]);
                    Cache::forget($cacheKey); // Remove from cache
                    return $text; // Return original text
                }
                
                return $translated;
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
     * Note: MyMemory has a 500 character limit per query
     */
    private function translateMyMemory(string $text, string $targetLang, string $sourceLang): string
    {
        // MyMemory API has a 500 character limit, so we need to chunk long texts
        // Use 400 to be very safe (accounting for URL encoding and API overhead)
        $maxLength = 400;
        
        if (mb_strlen($text) <= $maxLength) {
            // Text is short enough, translate directly
            return $this->translateMyMemoryChunk($text, $targetLang, $sourceLang);
        }
        
        // Split text into chunks, trying to break at sentence boundaries
        $chunks = $this->splitTextIntoChunks($text, $maxLength);
        $translatedChunks = [];
        
        foreach ($chunks as $index => $chunk) {
            $translatedChunk = $this->translateMyMemoryChunk($chunk, $targetLang, $sourceLang);
            $translatedChunks[] = $translatedChunk;
            
            // Add delay between chunks to avoid rate limiting (except for last chunk)
            if ($index < count($chunks) - 1) {
                usleep(300000); // 300ms delay
            }
        }
        
        // Join chunks with a space (chunks are already trimmed, so this preserves spacing)
        return implode(' ', $translatedChunks);
    }
    
    /**
     * Translate a single chunk of text (max 500 chars)
     */
    private function translateMyMemoryChunk(string $text, string $targetLang, string $sourceLang): string
    {
        // Ensure text is not too long (safety check)
        $textLength = mb_strlen($text);
        if ($textLength > 450) {
            // If somehow we got a chunk that's too long, split it further
            Log::warning('Chunk too long, splitting further', [
                'length' => $textLength,
                'text_preview' => mb_substr($text, 0, 50)
            ]);
            // Recursively split and translate
            $chunks = $this->splitTextIntoChunks($text, 400);
            $translated = [];
            foreach ($chunks as $chunk) {
                $translated[] = $this->translateMyMemoryChunk($chunk, $targetLang, $sourceLang);
                usleep(300000); // Delay between sub-chunks
            }
            return implode(' ', $translated);
        }
        
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
                    
                    // Check if the response is an error message from MyMemory
                    if (stripos($translated, 'QUERY LENGTH LIMIT EXCEEDED') !== false || 
                        stripos($translated, 'MAX ALLOWED QUERY') !== false) {
                        Log::warning('MyMemory returned length limit error', [
                            'text_length' => $textLength,
                            'response' => $translated
                        ]);
                        // If chunk is still too long, try splitting it in half
                        if ($textLength > 200) {
                            $midPoint = (int)($textLength / 2);
                            // Try to find a space near the midpoint
                            $spacePos = mb_strpos($text, ' ', $midPoint - 50);
                            if ($spacePos === false) {
                                $spacePos = mb_strpos($text, ' ', $midPoint);
                            }
                            if ($spacePos !== false) {
                                $firstHalf = mb_substr($text, 0, $spacePos);
                                $secondHalf = mb_substr($text, $spacePos + 1);
                                $translated1 = $this->translateMyMemoryChunk($firstHalf, $targetLang, $sourceLang);
                                usleep(300000);
                                $translated2 = $this->translateMyMemoryChunk($secondHalf, $targetLang, $sourceLang);
                                return $translated1 . ' ' . $translated2;
                            }
                        }
                        // If we can't split further, return original
                        return $text;
                    }
                    
                    // Only return if translation is different from original and not empty
                    if ($translated !== $text && !empty(trim($translated))) {
                        return $translated;
                    }
                }
                
                // Check for error in response
                if (isset($data['responseStatus']) && $data['responseStatus'] !== 200) {
                    Log::warning('MyMemory API returned error status', [
                        'status' => $data['responseStatus'],
                        'response' => $data
                    ]);
                    return $text;
                }
            }
        } catch (\Exception $e) {
            Log::warning('MyMemory translation failed', [
                'error' => $e->getMessage(),
                'source' => $sourceLang,
                'target' => $targetLang,
                'text_length' => mb_strlen($text)
            ]);
        }
        
        return $text; // Fallback to original
    }
    
    /**
     * Split text into chunks, trying to break at sentence boundaries
     */
    private function splitTextIntoChunks(string $text, int $maxLength): array
    {
        $chunks = [];
        $textLength = mb_strlen($text);
        
        if ($textLength <= $maxLength) {
            return [$text];
        }
        
        $currentPos = 0;
        
        while ($currentPos < $textLength) {
            $remaining = mb_substr($text, $currentPos);
            
            if (mb_strlen($remaining) <= $maxLength) {
                // Remaining text fits in one chunk
                $chunks[] = trim($remaining);
                break;
            }
            
            // Try to find a good break point (sentence boundary)
            $chunk = mb_substr($remaining, 0, $maxLength);
            
            // Look for sentence endings (., !, ?) near the end of the chunk
            $sentenceEndings = ['. ', '! ', '? ', '.\n', '!\n', '?\n'];
            $bestBreak = -1;
            
            // Search backwards from the end of the chunk
            for ($i = mb_strlen($chunk) - 1; $i >= $maxLength * 0.7; $i--) {
                $substring = mb_substr($chunk, max(0, $i - 2), 3);
                foreach ($sentenceEndings as $ending) {
                    if (mb_strpos($substring, $ending) !== false) {
                        $bestBreak = $i + 1;
                        break 2;
                    }
                }
            }
            
            // If no sentence boundary found, try paragraph break
            if ($bestBreak === -1) {
                $paragraphBreak = mb_strrpos($chunk, "\n\n");
                if ($paragraphBreak !== false && $paragraphBreak >= $maxLength * 0.5) {
                    $bestBreak = $paragraphBreak + 2;
                }
            }
            
            // If still no good break, try single newline
            if ($bestBreak === -1) {
                $newlineBreak = mb_strrpos($chunk, "\n");
                if ($newlineBreak !== false && $newlineBreak >= $maxLength * 0.5) {
                    $bestBreak = $newlineBreak + 1;
                }
            }
            
            // If no good break point found, just cut at maxLength
            if ($bestBreak === -1) {
                $bestBreak = $maxLength;
            }
            
            $chunk = mb_substr($remaining, 0, $bestBreak);
            $chunks[] = trim($chunk);
            $currentPos += $bestBreak;
        }
        
        return $chunks;
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

