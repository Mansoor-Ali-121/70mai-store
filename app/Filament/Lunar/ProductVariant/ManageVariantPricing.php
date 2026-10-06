<?php

namespace App\Filament\Lunar\ProductVariant;

use App\Filament\Concerns\RedirectsToResourceIndex;
use Lunar\Admin\Filament\Resources\ProductResource;
use Lunar\Admin\Filament\Resources\ProductVariantResource\Pages\ManageVariantPricing as BaseManageVariantPricing;

class ManageVariantPricing extends BaseManageVariantPricing
{
    use RedirectsToResourceIndex;

    /** Variant pages return to the product list. */
    protected static function redirectResource(): string
    {
        return ProductResource::class;
    }
}
