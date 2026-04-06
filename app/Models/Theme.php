<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Theme extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'name_en',
        'name_fr',
        'name_es',
        'image_url',
    ];

    public function serviceProviders()
    {
        return $this->belongsToMany(ServiceProvider::class, 'provider_theme');
    }

    /**
     * Get the name based on current locale
     */
    public function getNameAttribute($value)
    {
        $locale = app()->getLocale();
        
        // If locale is not in translations, fallback to English
        $translationKey = 'name_' . $locale;
        if (in_array($locale, ['en', 'fr', 'es']) && isset($this->attributes[$translationKey]) && !empty($this->attributes[$translationKey])) {
            return $this->attributes[$translationKey];
        }
        
        // Fallback to English, then original name
        return $this->attributes['name_en'] ?? $value ?? '';
    }
    
    /**
     * Get the attributes that should be included in the model's array/JSON representation
     */
    public function toArray()
    {
        $array = parent::toArray();
        
        // Ensure name is translated
        $locale = app()->getLocale();
        $translationKey = 'name_' . $locale;
        if (in_array($locale, ['en', 'fr', 'es']) && isset($this->attributes[$translationKey]) && !empty($this->attributes[$translationKey])) {
            $array['name'] = $this->attributes[$translationKey];
        } elseif (isset($this->attributes['name_en']) && !empty($this->attributes['name_en'])) {
            $array['name'] = $this->attributes['name_en'];
        }
        
        return $array;
    }

    /**
     * Get name in specific language
     */
    public function getNameIn($locale = 'en')
    {
        $translationKey = 'name_' . $locale;
        if (in_array($locale, ['en', 'fr', 'es']) && isset($this->attributes[$translationKey])) {
            return $this->attributes[$translationKey];
        }
        return $this->attributes['name_en'] ?? $this->attributes['name'] ?? '';
    }
}
