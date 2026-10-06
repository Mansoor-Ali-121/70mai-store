<?php

namespace App\Filament\Lunar\ProductOption;

use App\Filament\Concerns\RedirectsToResourceIndex;
use Lunar\Admin\Filament\Resources\ProductOptionResource\Pages\CreateProductOption as BaseCreateProductOption;

class CreateProductOption extends BaseCreateProductOption
{
    use RedirectsToResourceIndex;
}
