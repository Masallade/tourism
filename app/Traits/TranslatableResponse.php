<?php

namespace App\Traits;

use App\Services\TranslationService;
use Illuminate\Support\Facades\App;

trait TranslatableResponse
{
    /**
     * Translate model attributes based on current locale
     */
    protected function translateModel($model, array $translatableFields = []): array
    {
        $locale = App::getLocale();
        
        // If English, return as-is (assuming English is source language)
        if ($locale === 'en') {
            return $model->toArray();
        }
        
        $translationService = app(TranslationService::class);
        $data = $model->toArray();
        
        // Translate specified fields
        foreach ($translatableFields as $field) {
            if (isset($data[$field]) && !empty($data[$field])) {
                $data[$field] = $translationService->translate(
                    $data[$field],
                    $locale,
                    'en' // Assuming database content is in English
                );
            }
        }
        
        return $data;
    }
    
    /**
     * Translate collection of models
     */
    protected function translateCollection($collection, array $translatableFields = []): array
    {
        $locale = App::getLocale();
        
        if ($locale === 'en') {
            return $collection->toArray();
        }
        
        $translationService = app(TranslationService::class);
        
        return $collection->map(function ($model) use ($translatableFields, $translationService, $locale) {
            $data = $model->toArray();
            
            foreach ($translatableFields as $field) {
                if (isset($data[$field]) && !empty($data[$field])) {
                    $data[$field] = $translationService->translate(
                        $data[$field],
                        $locale,
                        'en'
                    );
                }
            }
            
            return $data;
        })->toArray();
    }
}
