# 📋 Booking Feature - Complete Analysis & Implementation Plan

## 🗄️ Current Database Structure Analysis

### Existing Tables:

1. **`users`** - Regular users (customers)
   - `id`, `name`, `email`, `password`, `role`, `phone`, `bio`
   - Used for admin and regular user accounts

2. **`service_providers`** - Service providers (businesses)
   - `id`, `country_id`, `name`, `description`, `price_range`, `website`, `email`, `phone`, `is_approved`, `image`, `documents`, `password`, `lat`, `lng`
   - Providers create services

3. **`services`** - Services/Tours offered by providers
   - `id`, `provider_id`, `service_type_id`, `country_id`, `theme_id`, `name`, `description`, `price`, `image`, `image_2`, `image_3`, `min_age`, `max_age`, `duration`, `overview`, `details`, `lat`, `lng`
   - These are the items that can be booked

4. **`countries`** - Countries
5. **`themes`** - Travel themes
6. **`service_types`** - Types of services
7. **`about_pages`** - About page content
8. **`app_settings`** - App settings

---

## 🎯 Booking Feature Requirements

### What We Need to Store:

1. **Booking Information:**
   - Customer contact details (name, email, phone)
   - Service being booked
   - Booking date & time
   - Number of travelers (adults, children)
   - Lead traveler information
   - Pickup location
   - Booking status (pending, confirmed, cancelled, completed)
   - Total price
   - Payment status (if payment UI is implemented later)

2. **Booking Flow Data:**
   - Contact details (Step 1)
   - Activity details (Step 2) - date, time, travelers, pickup location, lead traveler
   - Payment details (Step 3) - payment method, promo code (for future)

---

## 📊 Database Changes Required

### New Table: `bookings`

```sql
CREATE TABLE `bookings` (
  `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  
  -- Service & Provider Info
  `service_id` BIGINT UNSIGNED NOT NULL,
  `provider_id` BIGINT UNSIGNED NOT NULL,
  
  -- Customer Contact Info (Step 1)
  `customer_first_name` VARCHAR(255) NOT NULL,
  `customer_last_name` VARCHAR(255) NOT NULL,
  `customer_email` VARCHAR(255) NOT NULL,
  `customer_phone_country_code` VARCHAR(10) DEFAULT '+92',
  `customer_phone_number` VARCHAR(20) NOT NULL,
  `receive_sms_updates` BOOLEAN DEFAULT FALSE,
  
  -- Activity Details (Step 2)
  `booking_date` DATE NOT NULL,
  `booking_time` TIME NOT NULL,
  `adults_count` INT UNSIGNED DEFAULT 1,
  `children_count` INT UNSIGNED DEFAULT 0,
  `lead_traveler_first_name` VARCHAR(255) NOT NULL,
  `lead_traveler_last_name` VARCHAR(255) NOT NULL,
  `pickup_location` VARCHAR(500) NULL,
  `pickup_location_address` TEXT NULL,
  
  -- Pricing
  `base_price` DECIMAL(10, 2) NOT NULL,
  `adults_price` DECIMAL(10, 2) DEFAULT 0,
  `children_price` DECIMAL(10, 2) DEFAULT 0,
  `promo_code` VARCHAR(50) NULL,
  `discount_amount` DECIMAL(10, 2) DEFAULT 0,
  `total_price` DECIMAL(10, 2) NOT NULL,
  
  -- Payment Info (for future)
  `payment_method` VARCHAR(50) NULL, -- 'card', 'paypal', 'googlePay', etc.
  `payment_timing` VARCHAR(50) NULL, -- 'payNow', 'reserveNow'
  `payment_status` VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'refunded'
  `payment_transaction_id` VARCHAR(255) NULL,
  
  -- Booking Status
  `status` VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled', 'completed'
  `booking_reference` VARCHAR(50) UNIQUE NULL, -- Auto-generated: BK-20250115-001
  
  -- Additional Notes
  `special_requests` TEXT NULL,
  `cancellation_reason` TEXT NULL,
  `cancelled_at` TIMESTAMP NULL,
  
  -- Timestamps
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  
  -- Foreign Keys
  FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`provider_id`) REFERENCES `service_providers`(`id`) ON DELETE CASCADE,
  
  -- Indexes
  INDEX `idx_service_id` (`service_id`),
  INDEX `idx_provider_id` (`provider_id`),
  INDEX `idx_customer_email` (`customer_email`),
  INDEX `idx_booking_date` (`booking_date`),
  INDEX `idx_status` (`status`),
  INDEX `idx_booking_reference` (`booking_reference`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Optional: `booking_pickup_locations` (if pickup locations are dynamic)

```sql
CREATE TABLE `booking_pickup_locations` (
  `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  `service_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `address` TEXT NULL,
  `lat` DECIMAL(10, 7) NULL,
  `lng` DECIMAL(10, 7) NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  
  FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE CASCADE,
  INDEX `idx_service_id` (`service_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 🔄 Booking Flow Implementation Logic

### Step-by-Step Flow:

#### **Step 1: Contact Details**
- User fills: First Name, Last Name, Email, Phone Number
- Optional: SMS updates checkbox
- **Validation:** All fields required, email format, phone format
- **Action:** Store in state, enable Step 2

#### **Step 2: Activity Details**
- User fills: Date, Time, Number of Adults/Children, Lead Traveler Name, Pickup Location
- **Auto-fill:** Lead traveler name from Step 1
- **Validation:** Date must be future, all fields required
- **Calculation:** 
  - Base price from service
  - Adults price = base_price × adults_count
  - Children price = (base_price × 0.7) × children_count (70% discount)
  - Total = adults_price + children_price
- **Action:** Store in state, enable Step 3

#### **Step 3: Payment Details**
- User selects: Payment timing (Pay Now / Reserve Now)
- User selects: Payment method (Card, PayPal, etc.)
- Optional: Promo code
- **Validation:** Payment method required
- **Action:** Submit booking

---

## 🚀 Implementation Steps

### **Phase 1: Database Setup**

1. **Create Migration: `create_bookings_table`**
   ```bash
   php artisan make:migration create_bookings_table
   ```

2. **Create Migration: `create_booking_pickup_locations_table`** (Optional)
   ```bash
   php artisan make:migration create_booking_pickup_locations_table
   ```

3. **Run Migrations**
   ```bash
   php artisan migrate
   ```

---

### **Phase 2: Model Creation**

1. **Create `Booking` Model**
   ```bash
   php artisan make:model Booking
   ```

2. **Add Relationships:**
   - `Booking` belongs to `Service`
   - `Booking` belongs to `ServiceProvider`
   - `Service` has many `Bookings`
   - `ServiceProvider` has many `Bookings`

3. **Add Fillable Fields & Casts**

---

### **Phase 3: API Endpoints**

#### **Create Booking Controller**
```bash
php artisan make:controller BookingController
```

#### **Required Endpoints:**

1. **POST `/api/bookings`** - Create new booking
   - Validate all booking data
   - Generate booking reference
   - Calculate total price
   - Save to database
   - Send confirmation email (optional)
   - Return booking details

2. **GET `/api/bookings/{id}`** - Get booking details
   - Return booking with service and provider info
   - Include booking reference

3. **GET `/api/bookings`** - List bookings (for admin/provider)
   - Filter by status, date, provider, etc.
   - Pagination

4. **PATCH `/api/bookings/{id}/status`** - Update booking status
   - Change status (pending → confirmed, etc.)
   - Admin/Provider only

5. **GET `/api/services/{id}/pickup-locations`** - Get pickup locations for service
   - Return available pickup locations
   - Or return default locations if not using separate table

---

### **Phase 4: Frontend Integration**

#### **Update BookingFlow Component:**

1. **Step 1 (Contact Details):**
   - Already implemented ✅
   - Store: firstName, lastName, email, phoneNumber, phoneCountryCode, receiveSMS

2. **Step 2 (Activity Details):**
   - Already implemented ✅
   - Store: date, time, travelers (adults, children), leadTravelerFirstName, leadTravelerLastName, pickupLocation
   - Calculate price based on travelers

3. **Step 3 (Payment Details):**
   - Already implemented ✅
   - Store: paymentTiming, paymentMethod, promoCode
   - **Submit Booking** button

#### **Add Booking Submission:**

1. **Create `handleSubmitBooking` function:**
   - Collect all form data
   - Calculate final price
   - Call API: `POST /api/bookings`
   - Show success message
   - Redirect to booking confirmation page

2. **Booking Confirmation Page:**
   - Show booking reference
   - Show booking details
   - Download receipt option
   - Email confirmation sent message

---

### **Phase 5: Price Calculation Logic**

#### **In BookingController:**

```php
private function calculateBookingPrice($service, $adults, $children) {
    $basePrice = $service->price ?? 0;
    
    $adultsPrice = $basePrice * $adults;
    $childrenPrice = ($basePrice * 0.7) * $children; // 30% discount for children
    
    $subtotal = $adultsPrice + $childrenPrice;
    
    // Apply promo code discount if valid (future)
    $discount = 0;
    $total = $subtotal - $discount;
    
    return [
        'base_price' => $basePrice,
        'adults_price' => $adultsPrice,
        'children_price' => $childrenPrice,
        'subtotal' => $subtotal,
        'discount' => $discount,
        'total' => $total
    ];
}
```

---

### **Phase 6: Booking Reference Generation**

#### **In Booking Model:**

```php
protected static function boot()
{
    parent::boot();
    
    static::creating(function ($booking) {
        if (empty($booking->booking_reference)) {
            $booking->booking_reference = self::generateBookingReference();
        }
    });
}

private static function generateBookingReference()
{
    $date = date('Ymd');
    $lastBooking = self::whereDate('created_at', today())
        ->orderBy('id', 'desc')
        ->first();
    
    $sequence = $lastBooking ? (int)substr($lastBooking->booking_reference, -3) + 1 : 1;
    $sequence = str_pad($sequence, 3, '0', STR_PAD_LEFT);
    
    return 'BK-' . $date . '-' . $sequence;
}
```

---

## 📝 Data Flow Diagram

```
User clicks "Book Now"
    ↓
Navigate to /booking/:serviceId
    ↓
BookingFlow Component loads
    ↓
Step 1: Fill Contact Details
    ↓
Step 2: Fill Activity Details (calculate price)
    ↓
Step 3: Select Payment Method
    ↓
Click "Pay Now" / "Reserve Now"
    ↓
POST /api/bookings
    ↓
Backend validates & saves booking
    ↓
Generate booking reference
    ↓
Return booking data
    ↓
Show confirmation page
    ↓
Send confirmation email (optional)
```

---

## 🔐 Validation Rules

### **Backend Validation (Laravel):**

```php
$request->validate([
    // Service
    'service_id' => 'required|exists:services,id',
    
    // Contact Details
    'customer_first_name' => 'required|string|max:255',
    'customer_last_name' => 'required|string|max:255',
    'customer_email' => 'required|email|max:255',
    'customer_phone_number' => 'required|string|max:20',
    'customer_phone_country_code' => 'nullable|string|max:10',
    'receive_sms_updates' => 'boolean',
    
    // Activity Details
    'booking_date' => 'required|date|after:today',
    'booking_time' => 'required|date_format:H:i',
    'adults_count' => 'required|integer|min:1|max:50',
    'children_count' => 'required|integer|min:0|max:50',
    'lead_traveler_first_name' => 'required|string|max:255',
    'lead_traveler_last_name' => 'required|string|max:255',
    'pickup_location' => 'nullable|string|max:500',
    
    // Payment
    'payment_method' => 'nullable|string|in:card,paypal,googlePay,paypalLater',
    'payment_timing' => 'nullable|string|in:payNow,reserveNow',
    'promo_code' => 'nullable|string|max:50',
    
    // Pricing (calculated on frontend, validated on backend)
    'total_price' => 'required|numeric|min:0',
]);
```

---

## 📧 Email Notifications (Future)

### **Emails to Send:**

1. **Booking Confirmation (Customer):**
   - Booking reference
   - Service details
   - Date, time, travelers
   - Total price
   - Provider contact info

2. **New Booking Notification (Provider):**
   - Customer details
   - Booking details
   - Booking reference

3. **Booking Status Update:**
   - When status changes (confirmed, cancelled, etc.)

---

## 🎨 UI/UX Considerations

### **Already Implemented:**
- ✅ Multi-step form (3 steps)
- ✅ Collapsible accordion steps
- ✅ Form validation
- ✅ Price calculation display
- ✅ Summary panel
- ✅ Responsive design

### **To Add:**
- Booking confirmation page
- Booking reference display
- Booking history (for logged-in users)
- Admin/Provider booking management dashboard

---

## 🔄 Status Workflow

```
pending (default)
    ↓
confirmed (admin/provider confirms)
    ↓
completed (after service is delivered)
    
OR

pending
    ↓
cancelled (by customer or provider)
```

---

## 📊 Admin/Provider Dashboard Features

### **For Providers:**
- View all bookings for their services
- Filter by date, status
- Update booking status
- View customer details
- Export bookings

### **For Admin:**
- View all bookings
- Filter by provider, service, status, date
- Update booking status
- Cancel bookings
- View analytics

---

## 🚨 Important Notes

1. **Payment Integration:** 
   - Payment UI is already in place
   - Actual payment processing will be added later
   - For now, just save payment method selection

2. **Pickup Locations:**
   - Can be hardcoded in frontend for now
   - Or stored in database table for dynamic management

3. **Booking Reference:**
   - Auto-generated unique identifier
   - Format: `BK-YYYYMMDD-001`
   - Used for tracking and customer communication

4. **Price Calculation:**
   - Base price from service
   - Adults: Full price
   - Children: 70% of base price (adjustable)

5. **Validation:**
   - Frontend validation for UX
   - Backend validation for security
   - Both are important

---

## ✅ Implementation Checklist

- [ ] Create bookings table migration
- [ ] Create Booking model
- [ ] Add relationships (Service, ServiceProvider)
- [ ] Create BookingController
- [ ] Implement POST /api/bookings endpoint
- [ ] Implement GET /api/bookings/{id} endpoint
- [ ] Add booking reference generation
- [ ] Add price calculation logic
- [ ] Update BookingFlow to submit booking
- [ ] Create booking confirmation page
- [ ] Add validation (frontend & backend)
- [ ] Test booking flow end-to-end
- [ ] Add booking management (admin/provider)
- [ ] Add email notifications (optional)

---

## 🎯 Summary

**What We're Building:**
- A complete booking system that stores customer bookings
- Multi-step booking form (already implemented in UI)
- Booking management for providers and admins
- Booking reference system for tracking
- Price calculation based on travelers

**What We're NOT Building (Yet):**
- Actual payment processing (UI stays, no real payment)
- Email notifications (can be added later)
- Advanced analytics (can be added later)

**Database Changes:**
- 1 new table: `bookings`
- 1 optional table: `booking_pickup_locations`

**Files to Create:**
- Migration: `create_bookings_table.php`
- Model: `Booking.php`
- Controller: `BookingController.php`
- Route: Add to `routes/api.php`

**Files to Update:**
- `BookingFlow.jsx` - Add submit functionality
- `Service.php` - Add bookings relationship
- `ServiceProvider.php` - Add bookings relationship
- Create booking confirmation page component

---

**Ready for implementation when you give the go-ahead!** 🚀



