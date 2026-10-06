<?php

namespace App\Filament\Lunar\Brand;

use App\Filament\Concerns\RedirectsToResourceIndex;
use Lunar\Admin\Filament\Resources\BrandResource\Pages\EditBrand as BaseEditBrand;

class EditBrand extends BaseEditBrand
{
    use RedirectsToResourceIndex;
}
