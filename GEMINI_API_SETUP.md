# 🤖 Gemini AI Setup Guide for EcoTravel

This guide will help you integrate Google's Gemini AI into your EcoTravel application.

## 📋 Prerequisites

- A Google account
- PHP 8.0+ with cURL extension enabled

## 🔑 Step 1: Get Your Gemini API Key

1. **Visit Google AI Studio**
   - Go to: https://makersuite.google.com/app/apikey
   - Or: https://aistudio.google.com/app/apikey

2. **Sign in with your Google Account**

3. **Create API Key**
   - Click on "Create API Key" button
   - Select "Create API key in new project" (recommended)
   - Copy your API key (it looks like: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)

4. **Important Security Notes:**
   - ⚠️ Never commit your API key to version control
   - ⚠️ Never expose it in frontend code
   - ⚠️ Keep it secret and secure

## ⚙️ Step 2: Add API Key to Your .env File

1. Open your `.env` file in the root directory of your project:
   ```bash
   /Applications/XAMPP/xamppfiles/htdocs/tourism/.env
   ```

2. Add the following line at the bottom of your `.env` file:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. Replace `your_actual_api_key_here` with the API key you copied from Google AI Studio

   Example:
   ```env
   GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

## 🔄 Step 3: Clear Laravel Cache

After adding the API key, clear Laravel's configuration cache:

```bash
cd /Applications/XAMPP/xamppfiles/htdocs/tourism
php artisan config:clear
php artisan cache:clear
```

## ✅ Step 4: Test the AI Assistant

1. Start your XAMPP server (Apache + MySQL)

2. Build your frontend assets:
   ```bash
   npm run dev
   ```
   Or for production:
   ```bash
   npm run build
   ```

3. Visit your application:
   ```
   http://localhost/tourism
   ```

4. Click on the "AI Assistance" button in the header

5. Try asking a question like:
   - "What are the best eco-friendly destinations?"
   - "How can I travel sustainably?"
   - "Recommend some green accommodations"

## 🎯 What's Included

### Backend (Already Configured)
- ✅ `AIAssistantController.php` - Handles Gemini API integration
- ✅ API Route: `POST /api/ai-chat`
- ✅ System prompt for eco-travel context
- ✅ Error handling and fallbacks
- ✅ Security settings for safe content

### Frontend (Already Configured)
- ✅ Beautiful chat interface
- ✅ Real-time messaging
- ✅ Quick question buttons
- ✅ Fallback to simulated responses if API fails
- ✅ Typing indicators and animations

## 🆓 Gemini API Pricing

- **Free Tier**: 60 requests per minute
- **Perfect for development and small applications**
- No credit card required for free tier

For more information: https://ai.google.dev/pricing

## 🔧 Troubleshooting

### Issue: "AI service is not configured"
**Solution:** Make sure `GEMINI_API_KEY` is added to your `.env` file and run `php artisan config:clear`

### Issue: API returns errors
**Solution:** 
1. Verify your API key is correct
2. Check that your API key is enabled in Google AI Studio
3. Ensure you haven't exceeded the free tier rate limits (60 req/min)

### Issue: Chat uses simulated responses
**Solution:** This is the fallback behavior when:
- API key is not configured
- API request fails
- Network issues occur

Check your browser console (F12) for error messages.

## 📝 Custom System Prompt

The AI is configured with a custom eco-travel system prompt in `AIAssistantController.php`. You can customize it to:
- Add specific information about your services
- Include pricing details
- Mention specific destinations you offer
- Add brand personality

Edit the `$systemPrompt` variable in:
```php
app/Http/Controllers/AIAssistantController.php
```

## 🚀 Production Considerations

1. **Rate Limiting**: Consider implementing rate limiting for the `/api/ai-chat` endpoint
2. **Caching**: Cache common responses to reduce API calls
3. **Monitoring**: Track API usage and errors
4. **Upgrade**: Consider upgrading to a paid plan for higher limits if needed

## 📚 Additional Resources

- [Gemini API Documentation](https://ai.google.dev/docs)
- [Google AI Studio](https://aistudio.google.com)
- [Gemini API Pricing](https://ai.google.dev/pricing)

---

Need help? The AI Assistant is ready to serve your eco-travel customers! 🌍✨



