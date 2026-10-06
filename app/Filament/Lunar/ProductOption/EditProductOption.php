<?php

namespace App\Filament\Lunar\ProductOption;

use App\Filament\Concerns\RedirectsToResourceIndex;
use Lunar\Admin\Filament\Resources\ProductOptionResource\Pages\EditProductOption as BaseEditProductOption;

class EditProductOption extends BaseEditProductOption
{
    use RedirectsToResourceIndex;
}
