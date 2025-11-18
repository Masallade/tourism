# Service Provider Password Reset Script

Yeh script sab ServiceProvider passwords ko ek simple password (123123123) par reset kar deta hai, taake aap quickly services add kar saken aur login kar saken.

## 🚀 Usage Methods

### Method 1: Standalone PHP Script (Recommended for Quick Use)

```bash
php reset-service-provider-passwords.php
```

Yeh script:
- Sab service providers ko list karega
- Confirmation lega
- Sab passwords ko `123123123` par reset kar dega
- Success/error report dega

### Method 2: Artisan Command (Recommended for Production)

```bash
php artisan service-providers:reset-passwords
```

**Options:**
- `--password=YOUR_PASSWORD` - Custom password set karne ke liye (default: 123123123)
- `--force` - Confirmation prompt skip karne ke liye

**Examples:**
```bash
# Default password (123123123) ke saath
php artisan service-providers:reset-passwords

# Custom password ke saath
php artisan service-providers:reset-passwords --password=mypassword123

# Confirmation ke bina (force)
php artisan service-providers:reset-passwords --force
```

## 🔒 Security Notes

1. **Backend Functionality Safe Hai**: 
   - Script Laravel ke `Hash::make()` use karta hai, jo existing authentication system ke saath compatible hai
   - Existing login functionality bilkul same rahegi
   - Password hashing Laravel ke standard method se hota hai

2. **Database Transaction**:
   - Sab updates ek transaction mein hote hain
   - Agar koi error aaye, to sab changes rollback ho jayenge
   - Data integrity maintain rahegi

3. **Logging**:
   - Script detailed output deta hai
   - Har provider ka status dikhata hai
   - Errors properly handle hote hain

## 📋 What This Script Does

1. ✅ Sab ServiceProvider records fetch karta hai
2. ✅ Unka list dikhata hai (name, email, approval status)
3. ✅ Confirmation leta hai (unless `--force` use kiya ho)
4. ✅ Sab passwords ko specified password par reset karta hai (properly hashed)
5. ✅ Success report deta hai

## ⚠️ Important Notes

- **Testing Ke Liye**: Yeh script testing/development ke liye hai
- **Production**: Production mein use karne se pehle security review karein
- **Backup**: Important data ka backup le lein pehle
- **Password**: Default password `123123123` hai, aap `--password` option se change kar sakte hain

## 🔐 After Running

Sab service providers ab is password se login kar sakte hain:
- **Password**: `123123123` (ya jo bhi aapne set kiya ho)

Email se login karein (jo bhi service provider ka email ho).

## 🛠️ Troubleshooting

**Error: "No service providers found"**
- Database check karein, koi service provider exist karta hai ya nahi

**Error: "Transaction rolled back"**
- Database connection check karein
- Permissions verify karein
- Error message check karein

**Login nahi ho raha?**
- Password sahi hai ya nahi verify karein
- Service provider approved hai ya nahi check karein
- Email case-sensitive nahi hai (lowercase automatically handle hota hai)

## 📝 Example Output

```
========================================
Service Provider Password Reset
========================================

Found 5 service provider(s) in the database.

Service Providers to be updated:
--------------------------------
1. ABC Tours (abc@example.com) - ✅ Approved
2. XYZ Travels (xyz@example.com) - ✅ Approved
3. Best Tours (best@example.com) - ⏳ Pending

⚠️  WARNING: This will reset passwords for ALL service providers!
New password for all providers: 123123123

Press Enter to continue or Ctrl+C to cancel...

🔄 Resetting passwords...

✅ [1/3] Password reset for: ABC Tours (abc@example.com)
✅ [2/3] Password reset for: XYZ Travels (xyz@example.com)
✅ [3/3] Password reset for: Best Tours (best@example.com)

========================================
✅ SUCCESS!
========================================
Updated 3 out of 3 service provider(s).

📝 Login Credentials:
   Password for ALL providers: 123123123

🔐 You can now login with any service provider email using this password.
```

