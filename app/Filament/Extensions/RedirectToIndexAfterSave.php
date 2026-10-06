<?php

namespace App\Filament\Extensions;

use App\Filament\Lunar;
use Filament\Resources\Pages\PageRegistration;
use Lunar\Admin\Filament\Resources\BrandResource\Pages as BrandPages;
use Lunar\Admin\Filament\Resources\ProductOptionResource\Pages as ProductOptionPages;
use Lunar\Admin\Filament\Resources\ProductResource\Pages as ProductPages;
use Lunar\Admin\Filament\Resources\ProductTypeResource\Pages as ProductTypePages;
use Lunar\Admin\Filament\Resources\ProductVariantResource\Pages as ProductVariantPages;
use Lunar\Admin\Support\Extending\ResourceExtension;

/**
 * Swaps Lunar's create/edit pages for subclasses that return to the list after
 * saving (see RedirectsToResourceIndex). Register it on each resource it covers.
 */
class RedirectToIndexAfterSave extends ResourceExtension
{
    /**
     * Lunar page => [replacement, route path as defined by Lunar].
     * EditProduct isn't listed: Lunar links to it by class, so it's handled by
     * RedirectToProductListAfterUpdate instead.
     */
    private const PAGES = [
        ProductPages\ManageProductIdentifiers::class => [Lunar\Product\ManageProductIdentifiers::class, '/{record}/identifiers'],
        ProductPages\ManageProductPricing::class => [Lunar\Product\ManageProductPricing::class, '/{record}/pricing'],
        ProductPages\ManageProductInventory::class => [Lunar\Product\ManageProductInventory::class, '/{record}/inventory'],
        ProductPages\ManageProductShipping::class => [Lunar\Product\ManageProductShipping::class, '/{record}/shipping'],

        ProductVariantPages\ManageVariantPricing::class => [Lunar\ProductVariant\ManageVariantPricing::class, '/{record}/pricing'],
        ProductVariantPages\ManageVariantIdentifiers::class => [Lunar\ProductVariant\ManageVariantIdentifiers::class, '/{record}/identifiers'],
        ProductVariantPages\ManageVariantInventory::class => [Lunar\ProductVariant\ManageVariantInventory::class, '/{record}/inventory'],
        ProductVariantPages\ManageVariantShipping::class => [Lunar\ProductVariant\ManageVariantShipping::class, '/{record}/shipping'],

        BrandPages\CreateBrand::class => [Lunar\Brand\CreateBrand::class, '/create'],
        BrandPages\EditBrand::class => [Lunar\Brand\EditBrand::class, '/{record}/edit'],

        ProductTypePages\CreateProductType::class => [Lunar\ProductType\CreateProductType::class, '/create'],
        ProductTypePages\EditProductType::class => [Lunar\ProductType\EditProductType::class, '/{record}/edit'],

        ProductOptionPages\CreateProductOption::class => [Lunar\ProductOption\CreateProductOption::class, '/create'],
        ProductOptionPages\EditProductOption::class => [Lunar\ProductOption\EditProductOption::class, '/{record}/edit'],
    ];

    /**
     * @param  array<string, PageRegistration>  $pages
     * @return array<string, PageRegistration>
     */
    public function extendPages(array $pages): array
    {
        foreach ($pages as $name => $registration) {
            if ([$replacement, $path] = self::PAGES[$registration->getPage()] ?? null) {
                $pages[$name] = $replacement::route($path);
            }
        }

        return $pages;
    }

    /**
     * Record sub-navigation (the product/variant side menu) lists page classes,
     * which must match the registered replacements.
     *
     * @param  array<int, class-string>  $pages
     * @return array<int, class-string>
     */
    public function extendSubNavigation(array $pages): array
    {
        return array_map(fn (string $page) => self::PAGES[$page][0] ?? $page, $pages);
    }
}
