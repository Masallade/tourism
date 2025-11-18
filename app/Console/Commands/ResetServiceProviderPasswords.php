<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ServiceProvider;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class ResetServiceProviderPasswords extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'service-providers:reset-passwords 
                            {--password=123123123 : The password to set for all service providers}
                            {--force : Skip confirmation prompt}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reset all ServiceProvider passwords to a simple password for easy testing';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $newPassword = $this->option('password');
        $force = $this->option('force');

        $this->info('');
        $this->info('========================================');
        $this->info('Service Provider Password Reset');
        $this->info('========================================');
        $this->info('');

        try {
            // Get all service providers
            $providers = ServiceProvider::all();
            $totalProviders = $providers->count();

            if ($totalProviders === 0) {
                $this->error('No service providers found in the database.');
                return Command::SUCCESS;
            }

            $this->info("Found {$totalProviders} service provider(s) in the database.");
            $this->info('');

            // Show list of providers that will be updated
            $this->info('Service Providers to be updated:');
            $this->info('--------------------------------');
            
            $tableData = [];
            foreach ($providers as $provider) {
                $status = $provider->is_approved ? '✅ Approved' : '⏳ Pending';
                $tableData[] = [
                    'ID' => $provider->id,
                    'Name' => $provider->name,
                    'Email' => $provider->email,
                    'Status' => $status,
                ];
            }
            
            $this->table(['ID', 'Name', 'Email', 'Status'], $tableData);
            $this->info('');

            // Confirmation
            if (!$force) {
                $this->warn('⚠️  WARNING: This will reset passwords for ALL service providers!');
                $this->info("New password for all providers: {$newPassword}");
                $this->info('');

                if (!$this->confirm('Do you want to continue?', true)) {
                    $this->info('Operation cancelled.');
                    return Command::SUCCESS;
                }
            }

            // Start transaction for safety
            DB::beginTransaction();

            $updatedCount = 0;
            $errors = [];

            $this->info('');
            $this->info('🔄 Resetting passwords...');
            $this->info('');

            $bar = $this->output->createProgressBar($totalProviders);
            $bar->start();

            foreach ($providers as $provider) {
                try {
                    // Hash the new password using Laravel's Hash facade
                    $hashedPassword = Hash::make($newPassword);

                    // Update the password
                    $provider->password = $hashedPassword;
                    $provider->save();

                    $updatedCount++;
                    $bar->advance();

                } catch (\Exception $e) {
                    $errors[] = [
                        'provider' => $provider->name . ' (' . $provider->email . ')',
                        'error' => $e->getMessage()
                    ];
                    $bar->advance();
                }
            }

            $bar->finish();
            $this->info('');
            $this->info('');

            // Commit transaction if no errors
            if (empty($errors)) {
                DB::commit();
                $this->info('');
                $this->info('========================================');
                $this->info('✅ SUCCESS!');
                $this->info('========================================');
                $this->info("Updated {$updatedCount} out of {$totalProviders} service provider(s).");
                $this->info('');
                $this->info('📝 Login Credentials:');
                $this->info("   Password for ALL providers: {$newPassword}");
                $this->info('');
                $this->info('🔐 You can now login with any service provider email using this password.');
                $this->info('');

                return Command::SUCCESS;
            } else {
                DB::rollBack();
                $this->error('');
                $this->error('========================================');
                $this->error('❌ ERRORS OCCURRED');
                $this->error('========================================');
                $this->error("Updated {$updatedCount} out of {$totalProviders} service provider(s).");
                $this->error('Errors: ' . count($errors));
                $this->error('');

                foreach ($errors as $error) {
                    $this->error("  - {$error['provider']}: {$error['error']}");
                }

                $this->error('');
                $this->warn('⚠️  Transaction rolled back. No passwords were changed.');

                return Command::FAILURE;
            }

        } catch (\Exception $e) {
            DB::rollBack();
            $this->error('');
            $this->error('========================================');
            $this->error('❌ FATAL ERROR');
            $this->error('========================================');
            $this->error('Error: ' . $e->getMessage());
            $this->error('');

            return Command::FAILURE;
        }
    }
}

