<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIAssistantController extends Controller
{
    /**
     * Send message to AI (OpenRouter) and get response
     */
    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        $userMessage = $request->input('message');
        $apiKey = config('services.openrouter.api_key');

        if (empty($apiKey)) {
            return response()->json([
                'error' => 'AI service is not configured. Please contact administrator.'
            ], 500);
        }

        try {
            // System prompt to guide the AI
            $systemPrompt = "You are an expert eco-travel assistant for Unison Tour, a sustainable tourism platform. 
Your role is to help travelers plan eco-friendly trips, recommend sustainable destinations, and provide green travel advice.
Keep responses friendly, informative, and focused on environmental sustainability.
If asked about destinations, mention real eco-friendly places.
If asked about accommodations, suggest eco-lodges and sustainable hotels.
Always encourage responsible tourism practices.
Keep responses concise but helpful (max 250 words).
Use emojis sparingly to make responses engaging.";

            // Get model from config (env-backed) or use default (free tier model)
            $model = config('services.openrouter.model', 'google/gemma-2-9b-it:free');
            
            Log::info('Using OpenRouter model: ' . $model);
            
            // Helper to call OpenRouter
            $callOpenRouter = function (string $useModel) use ($apiKey, $systemPrompt, $userMessage) {
                return Http::timeout(30)
                    ->withHeaders([
                        'Authorization' => 'Bearer ' . $apiKey,
                        'HTTP-Referer' => config('app.url', 'http://localhost'),
                        'X-Title' => 'Unison Tour AI Assistant',
                        'Content-Type' => 'application/json',
                    ])
                    ->post('https://openrouter.ai/api/v1/chat/completions', [
                        'model' => $useModel,
                        'messages' => [
                            [ 'role' => 'system', 'content' => $systemPrompt ],
                            [ 'role' => 'user', 'content' => $userMessage ],
                        ],
                        'temperature' => 0.7,
                        'max_tokens' => 1024,
                    ]);
            };

            // Try requested model first; if 404 (no endpoint), fall back to a list of free models
            $fallbackModels = [
                'google/gemma-2-9b-it:free',
                'mistralai/mistral-7b-instruct:free',
                'qwen/qwen2.5-7b-instruct:free',
            ];

            Log::info('Using OpenRouter model: ' . $model);
            $response = $callOpenRouter($model);

            if ($response->status() === 404) {
                Log::warning('Model unavailable, attempting fallbacks', ['model' => $model]);
                foreach ($fallbackModels as $fm) {
                    Log::info('Trying fallback model', ['model' => $fm]);
                    $try = $callOpenRouter($fm);
                    if ($try->successful()) {
                        $response = $try; $model = $fm; break;
                    }
                }
            }

            if ($response->successful()) {
                $data = $response->json();
                
                Log::info('OpenRouter API Response', ['data' => $data]);
                
                // Extract the AI response (OpenAI-compatible format)
                if (isset($data['choices'][0]['message']['content'])) {
                    $aiResponse = $data['choices'][0]['message']['content'];
                    
                    return response()->json([
                        'success' => true,
                        'message' => $aiResponse
                    ]);
                } else {
                    Log::error('Unexpected OpenRouter API response format', ['response' => $data]);
                    return response()->json([
                        'error' => 'Unexpected response from AI service'
                    ], 500);
                }
            } else {
                Log::error('OpenRouter API error', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                
                return response()->json([
                    'error' => 'AI service temporarily unavailable. Please try again later.',
                    'details' => $response->body()
                ], 500);
            }
        } catch (\Exception $e) {
            Log::error('AI Assistant error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'An error occurred while processing your request. Please try again.',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}

