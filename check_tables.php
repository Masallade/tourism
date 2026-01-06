<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "Database: " . config('database.connections.mysql.database') . "\n\n";
echo "All Tables:\n";
echo str_repeat("-", 50) . "\n";

$tables = DB::select('SHOW TABLES');
foreach($tables as $table) {
    foreach($table as $key => $value) {
        echo "✓ " . $value . "\n";
    }
}

echo "\n" . str_repeat("-", 50) . "\n";
echo "Checking subscription-related tables:\n";
echo str_repeat("-", 50) . "\n";

// Check if our tables exist
$requiredTables = ['subscriptions', 'service_provider_subscriptions', 'payments'];
foreach($requiredTables as $tableName) {
    $exists = DB::select("SHOW TABLES LIKE '$tableName'");
    if (count($exists) > 0) {
        echo "✓ $tableName - EXISTS\n";
        
        // Get column count
        $columns = DB::select("SHOW COLUMNS FROM $tableName");
        echo "  Columns: " . count($columns) . "\n";
        
        // Get row count
        $count = DB::table($tableName)->count();
        echo "  Rows: $count\n\n";
    } else {
        echo "✗ $tableName - NOT FOUND\n\n";
    }
}







