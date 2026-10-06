<?php

namespace App\Filament\Lunar\Product;

use App\Filament\Concerns\RedirectsToResourceIndex;
use Lunar\Admin\Filament\Resources\ProductResource\Pages\ManageProductShipping as BaseManageProductShipping;

class ManageProductShipping extends BaseManageProductShipping
{
    use RedirectsToResourceIndex;
}
