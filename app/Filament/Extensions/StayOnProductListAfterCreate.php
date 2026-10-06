<?php

namespace App\Filament\Extensions;

use Filament\Actions\CreateAction;
use Lunar\Admin\Filament\Resources\ProductResource;
use Lunar\Admin\Support\Extending\ListPageExtension;

/**
 * Lunar creates products in a modal on the product list and then opens the
 * edit page; return to the list instead.
 */
class StayOnProductListAfterCreate extends ListPageExtension
{
    public function headerActions(array $actions): array
    {
        foreach ($actions as $action) {
            if ($action instanceof CreateAction) {
                $action->successRedirectUrl(fn (): string => ProductResource::getUrl('index'));
            }
        }

        return $actions;
    }
}
