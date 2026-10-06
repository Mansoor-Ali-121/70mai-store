<?php

namespace App\Filament\Lunar\Product;

use App\Filament\Concerns\RedirectsToResourceIndex;
use Lunar\Admin\Filament\Resources\ProductResource\Pages\ManageProductInventory as BaseManageProductInventory;

class ManageProductInventory extends BaseManageProductInventory
{
    use RedirectsToResourceIndex;
}
