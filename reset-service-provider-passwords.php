<?php
/**
 * Service Provider Password Reset Script
 * 
 * This script resets all ServiceProvider passwords to a simple password (123123123)
 * for easy testing and quick service addition.
 * 
 * Usage:
 *   php reset-service-provider-passwords.php
 * 
 * Or via web browser (if route is enabled):
 *   http://your-domain.com/reset-service-provider-passwords
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\ServiceProvider;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

// Configuration
$newPassword = '123123123';
$confirmReset = true; // Set to false if you want to add confirmation prompt

echo "\n";
echo "========================================\n";
echo "Service Provider Password Reset Script\n";
echo "========================================\n";
echo "\n";

try {
    // Get all service providers
    $providers = ServiceProvider::all();
    $totalProviders = $providers->count();
    
    if ($totalProviders === 0) {
        echo "❌ No service providers found in the database.\n";
        exit(0);
    }
    
    echo "📊 Found {$totalProviders} service provider(s) in the database.\n";
    echo "\n";
    
    // Show list of providers that will be updated
    echo "Service Providers to be updated:\n";
    echo "--------------------------------\n";
    foreach ($providers as $index => $provider) {
        $status = $provider->is_approved ? '✅ Approved' : '⏳ Pending';
        echo sprintf(
            "%d. %s (%s) - %s\n",
            $index + 1,
            $provider->name,
            $provider->email,
            $status
        );
    }
    echo "\n";
    
    // Confirmation (if enabled)
    if ($confirmReset) {
        echo "⚠️  WARNING: This will reset passwords for ALL service providers!\n";
        echo "New password for all providers: {$newPassword}\n";
        echo "\n";
        echo "Press Enter to continue or Ctrl+C to cancel...\n";
        $handle = fopen("php://stdin", "r");
        $line = fgets($handle);
        fclose($handle);
    }
    
    // Start transaction for safety
    DB::beginTransaction();
    
    $updatedCount = 0;
    $errors = [];
    
    echo "\n";
    echo "🔄 Resetting passwords...\n";
    echo "\n";
    
    foreach ($providers as $provider) {
        try {
            $oldPasswordHash = $provider->password; // Store for logging
            
            // Hash the new password using Laravel's Hash facade
            $hashedPassword = Hash::make($newPassword);
            
            // Update the password
            $provider->password = $hashedPassword;
            $provider->save();
            
            $updatedCount++;
            
            echo sprintf(
                "✅ [%d/%d] Password reset for: %s (%s)\n",
                $updatedCount,
                $totalProviders,
                $provider->name,
                $provider->email
            );
            
        } catch (\Exception $e) {
            $errors[] = [
                'provider' => $provider->name . ' (' . $provider->email . ')',
                'error' => $e->getMessage()
            ];
            
            echo sprintf(
                "❌ Error updating %s (%s): %s\n",
                $provider->name,
                $provider->email,
                $e->getMessage()
            );
        }
    }
    
    // Commit transaction if no errors
    if (empty($errors)) {
        DB::commit();
        echo "\n";
        echo "========================================\n";
        echo "✅ SUCCESS!\n";
        echo "========================================\n";
        echo "Updated {$updatedCount} out of {$totalProviders} service provider(s).\n";
        echo "\n";
        echo "📝 Login Credentials:\n";
        echo "   Password for ALL providers: {$newPassword}\n";
        echo "\n";
        echo "🔐 You can now login with any service provider email using this password.\n";
        echo "\n";
    } else {
        DB::rollBack();
        echo "\n";
        echo "========================================\n";
        echo "❌ ERRORS OCCURRED\n";
        echo "========================================\n";
        echo "Updated {$updatedCount} out of {$totalProviders} service provider(s).\n";
        echo "Errors: " . count($errors) . "\n";
        echo "\n";
        foreach ($errors as $error) {
            echo "  - {$error['provider']}: {$error['error']}\n";
        }
        echo "\n";
        echo "⚠️  Transaction rolled back. No passwords were changed.\n";
        exit(1);
    }
    
} catch (\Exception $e) {
    DB::rollBack();
    echo "\n";
    echo "========================================\n";
    echo "❌ FATAL ERROR\n";
    echo "========================================\n";
    echo "Error: " . $e->getMessage() . "\n";
    echo "\n";
    echo "Stack trace:\n";
    echo $e->getTraceAsString() . "\n";
    exit(1);
}

echo "========================================\n";
echo "Script completed successfully!\n";
echo "========================================\n";
echo "\n";

