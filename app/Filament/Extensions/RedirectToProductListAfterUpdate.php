<?php

namespace App\Filament\Extensions;

use Filament\Support\Facades\FilamentView;
use Illuminate\Database\Eloquent\Model;
use Lunar\Admin\Filament\Resources\ProductResource;
use Lunar\Admin\Support\Extending\EditPageExtension;

/**
 * Returns to the product list after saving a product's basic information.
 *
 * EditProduct is extended through Lunar's hook rather than replaced like the
 * other pages, because Lunar links to it by class (e.g. from order line items).
 * Filament doesn't redirect edit pages after saving, so this redirect stands.
 */
class RedirectToProductListAfterUpdate extends EditPageExtension
{
    public function afterUpdate(Model $record, array $data): Model
    {
        $url = ProductResource::getUrl('index');
        $this->caller?->redirect($url, navigate: FilamentView::hasSpaMode($url));

        return $record;
    }
}
