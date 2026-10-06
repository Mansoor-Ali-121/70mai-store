<?php

namespace App\Filament\Lunar\Product;

use App\Filament\Concerns\RedirectsToResourceIndex;
use Lunar\Admin\Filament\Resources\ProductResource\Pages\ManageProductIdentifiers as BaseManageProductIdentifiers;

class ManageProductIdentifiers extends BaseManageProductIdentifiers
{
    use RedirectsToResourceIndex;
}
