<?php

namespace App\Providers;

use App\Filament\Extensions\RedirectToIndexAfterSave;
use App\Filament\Extensions\RedirectToProductListAfterUpdate;
use App\Filament\Extensions\StayOnProductListAfterCreate;
use App\Storefront\Shipping\StandardShipping;
use Filament\Panel;
use Illuminate\Support\ServiceProvider;
use Lunar\Admin\Filament\Resources\BrandResource;
use Lunar\Admin\Filament\Resources\ProductOptionResource;
use Lunar\Admin\Filament\Resources\ProductResource;
use Lunar\Admin\Filament\Resources\ProductResource\Pages\EditProduct;
use Lunar\Admin\Filament\Resources\ProductResource\Pages\ListProducts;
use Lunar\Admin\Filament\Resources\ProductTypeResource;
use Lunar\Admin\Filament\Resources\ProductVariantResource;
use Lunar\Admin\Support\Facades\LunarPanel;
use Lunar\Base\ShippingModifiers;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Lunar's admin (products, variants, collections, orders, customers, brands,
        // settings) is a complete Filament panel; serve it at /admin instead of /lunar.
        LunarPanel::panel(fn (Panel $panel) => $panel->path('admin'))
            ->extensions([
                // Return to the list after creating/saving products and their related records.
                ProductResource::class => RedirectToIndexAfterSave::class,
                ProductVariantResource::class => RedirectToIndexAfterSave::class,
                BrandResource::class => RedirectToIndexAfterSave::class,
                ProductTypeResource::class => RedirectToIndexAfterSave::class,
                ProductOptionResource::class => RedirectToIndexAfterSave::class,
                EditProduct::class => RedirectToProductListAfterUpdate::class,
                ListProducts::class => StayOnProductListAfterCreate::class,
            ])
            ->register();
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(ShippingModifiers $shippingModifiers): void
    {
        $shippingModifiers->add(StandardShipping::class);
    }
}
