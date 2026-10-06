<?php

namespace App\Filament\Lunar\ProductType;

use App\Filament\Concerns\RedirectsToResourceIndex;
use Lunar\Admin\Filament\Resources\ProductTypeResource\Pages\CreateProductType as BaseCreateProductType;

class CreateProductType extends BaseCreateProductType
{
    use RedirectsToResourceIndex;
}
