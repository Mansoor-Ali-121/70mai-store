<?php

namespace App\Filament\Lunar\Product;

use App\Filament\Concerns\RedirectsToResourceIndex;
use Lunar\Admin\Filament\Resources\ProductResource\Pages\ManageProductPricing as BaseManageProductPricing;

class ManageProductPricing extends BaseManageProductPricing
{
    use RedirectsToResourceIndex;
}
