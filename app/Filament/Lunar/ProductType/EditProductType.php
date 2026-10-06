<?php

namespace App\Filament\Lunar\ProductType;

use App\Filament\Concerns\RedirectsToResourceIndex;
use Lunar\Admin\Filament\Resources\ProductTypeResource\Pages\EditProductType as BaseEditProductType;

class EditProductType extends BaseEditProductType
{
    use RedirectsToResourceIndex;
}
