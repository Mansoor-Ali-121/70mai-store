<?php

namespace App\Storefront;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Str;
use Lunar\Models\Collection;
use Lunar\Models\Product;
use Lunar\Models\ProductVariant;
use Lunar\Models\Url;

/**
 * Read access to published Lunar products and collections for the storefront.
 */
class Catalog
{
    private const PRODUCT_RELATIONS = [
        'urls',
        'images',
        'brand',
        'productOptions.values',
        'variants.prices',
        'variants.values',
        'variants.images',
        'associations.target.urls',
        'associations.target.images',
        'associations.target.variants.prices',
        'associations.target.variants.values',
    ];

    /** What product cards need. */
    public const CARD_RELATIONS = ['urls', 'images', 'variants.prices'];

    public function findBySlug(string $slug): ?Product
    {
        $productId = $this->elementIdForSlug($slug, Product::morphName());

        return $productId === null ? null : $this->published()
            ->with(self::PRODUCT_RELATIONS)
            ->find($productId);
    }

    public function findVariant(int $variantId): ?ProductVariant
    {
        return ProductVariant::query()
            ->whereHas('product', fn ($query) => $query->where('status', 'published'))
            ->with(['prices', 'product'])
            ->find($variantId);
    }

    public function findCollection(string $slug): ?Collection
    {
        $collectionId = $this->elementIdForSlug($slug, Collection::morphName());

        return $collectionId === null ? null : Collection::with('urls')->find($collectionId);
    }

    /**
     * Published products in a collection, in the order set in the Lunar admin.
     *
     * @return EloquentCollection<int, Product>
     */
    public function productsIn(Collection $collection, array $relations = self::CARD_RELATIONS): EloquentCollection
    {
        return $collection->products()
            ->where('status', 'published')
            ->with($relations)
            ->get();
    }

    /**
     * Published products whose attributes (name, description, …) or variant SKUs contain the term.
     *
     * @return EloquentCollection<int, Product>
     */
    public function search(string $term): EloquentCollection
    {
        $like = '%'.str_replace(['\\', '%', '_'], ['\\\\', '\\%', '\\_'], Str::lower($term)).'%';

        $needle = Str::lower($term);

        return $this->published()
            ->where(fn (Builder $query) => $query
                ->whereRaw('LOWER(CAST(attribute_data AS CHAR)) LIKE ?', [$like])
                ->orWhereHas('variants', fn (Builder $variants) => $variants->whereRaw('LOWER(sku) LIKE ?', [$like])))
            ->with(self::CARD_RELATIONS)
            ->orderBy('id')
            ->get()
            // Name matches first, then matches in descriptions/SKUs ("compatible with S500").
            ->sortBy(fn (Product $product) => Str::contains(Str::lower($product->translateAttribute('name')), $needle) ? 0 : 1)
            ->values();
    }

    /**
     * @return Builder<Product>
     */
    private function published(): Builder
    {
        return Product::query()->where('status', 'published');
    }

    private function elementIdForSlug(string $slug, string $morphName): ?int
    {
        return Url::where('slug', $slug)->where('element_type', $morphName)->value('element_id');
    }
}
