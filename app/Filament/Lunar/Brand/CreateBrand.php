<?php

namespace App\Filament\Lunar\Brand;

use App\Filament\Concerns\RedirectsToResourceIndex;
use Lunar\Admin\Filament\Resources\BrandResource\Pages\CreateBrand as BaseCreateBrand;

class CreateBrand extends BaseCreateBrand
{
    use RedirectsToResourceIndex;
}
