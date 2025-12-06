<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Events\NotificationFailed;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->setupCommandsSafely();
        $this->tuneModelBehavior();
        $this->enforceSecureUrls();
        $this->optimizeViteSettings();
    }
    /**
     * Prevent destructive commands in production.
     */
    private function setupCommandsSafely(): void
    {
        DB::prohibitDestructiveCommands($this->app->isProduction());
    }
    /**
     * Fine-tune Eloquent model behavior.
     */
    private function tuneModelBehavior(): void
    {
        Model::shouldBeStrict();
        Model::unguard();
    }
    /**
     * Force HTTPS in non-local environments.
     */
    private function enforceSecureUrls(): void
    {
        if (!$this->app->environment('local')) {
            URL::forceScheme('https');
        }
    }
    /**
     * Optimize Vite asset loading strategy.
     */
    private function optimizeViteSettings(): void
    {
        Vite::usePrefetchStrategy('aggressive');
    }
}
