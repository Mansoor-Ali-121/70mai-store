<?php

namespace App\Storefront;

use Lunar\Base\Enums\ProductAssociation as ProductAssociationType;
use Lunar\Facades\Pricing;
use Lunar\Models\Currency;
use Lunar\Models\Product;
use Lunar\Models\ProductVariant;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * Shapes Lunar products into the props the React product page expects.
 */
class ProductPresenter
{
    public function __construct(private ProductContent $content) {}

    public function present(Product $product): array
    {
        $slug = ($product->urls->firstWhere('default', true) ?? $product->urls->first())?->slug;
        $images = $product->images->sortBy('order_column')->values();
        $imageIndex = $images->pluck('id')->flip();
        $options = $product->productOptions;
        $description = DescriptionHighlights::parse($product->translateAttribute('description'));

        return [
            'id' => $product->id,
            'slug' => $slug,
            'name' => $product->translateAttribute('name'),
            'short_name' => $product->translateAttribute('short_name') ?: $product->translateAttribute('name'),
            'brand' => $product->brand?->name,
            'tagline' => $product->translateAttribute('tagline'),
            'notice' => $product->translateAttribute('notice'),
            'promo' => $product->translateAttribute('promo'),
            'currency' => Currency::getDefault()->code,
            'installments' => config('store.installments'),
            'options' => $options->map(fn ($option) => [
                'name' => $option->translate('name'),
                'type' => ($option->meta['display'] ?? null) === 'swatch' ? 'swatch' : 'button',
                'values' => $option->values->map(fn ($value) => array_filter([
                    'label' => $value->translate('name'),
                    'swatch' => $value->meta['swatch'] ?? null,
                ]))->values(),
            ])->values(),
            'variants' => $product->variants->map(fn (ProductVariant $variant) => [
                'id' => $variant->id,
                'sku' => $variant->sku,
                // Option values in the same order as `options`.
                'options' => $options->map(
                    fn ($option) => $variant->values->firstWhere('product_option_id', $option->id)?->translate('name')
                )->values(),
                ...$this->prices($variant),
                'available' => self::isAvailable($variant),
                'max_quantity' => self::maxQuantity($variant),
                'image' => ($media = $variant->images->first()) ? ($imageIndex[$media->id] ?? null) : null,
            ])->values(),
            'images' => $images->map(fn (Media $media, $index) => [
                'src' => self::mediaUrl($media),
                'thumb' => self::mediaUrl($media, 'small'),
                'alt' => $product->translateAttribute('name').($index > 0 ? ', image '.($index + 1) : ''),
            ])->values(),
            'highlights' => $description['highlights'],
            'description_paragraphs' => $description['paragraphs'],
            'bundle' => $product->associations
                ->where('type', ProductAssociationType::CROSS_SELL->value)
                ->map(fn ($association) => $association->target)
                ->filter(fn ($target) => $target?->status === 'published')
                ->map(fn (Product $target) => $this->presentAddOn($target))
                ->values(),
            'shipping' => $this->content->shippingPolicy(),
            ...$this->content->for($slug),
        ];
    }

    /**
     * Compact shape for product cards, homepage tabs and menus. Price is the
     * cheapest variant ("From $x" when variants differ).
     */
    public function card(Product $product): array
    {
        $variants = $product->variants->map(fn (ProductVariant $variant) => [
            'id' => $variant->id,
            'available' => self::isAvailable($variant),
                'max_quantity' => self::maxQuantity($variant),
            ...$this->prices($variant),
        ]);
        // "From" price: cheapest variant you can buy (or cheapest overall if all are sold out).
        $purchasable = $variants->where('available', true);
        $cheapest = ($purchasable->isNotEmpty() ? $purchasable : $variants)->sortBy('price')->first();
        $image = $product->images->sortBy('order_column')->first();
        $slug = ($product->urls->firstWhere('default', true) ?? $product->urls->first())?->slug;

        return [
            'id' => $product->id,
            'slug' => $slug,
            'url' => "/products/{$slug}",
            'name' => $product->translateAttribute('name'),
            'short_name' => $product->translateAttribute('short_name') ?: $product->translateAttribute('name'),
            'series' => $product->translateAttribute('series'),
            'tagline' => $product->translateAttribute('tagline'),
            'image' => $image ? self::mediaUrl($image, 'large') : null,
            'price' => $cheapest['price'] ?? null,
            'compare_at_price' => $cheapest['compare_at_price'] ?? null,
            'price_varies' => $variants->pluck('price')->unique()->count() > 1,
            'available' => $variants->contains('available', true),
        ];
    }

    /**
     * Compact shape for "More Selections" add-ons.
     */
    private function presentAddOn(Product $product): array
    {
        return [
            'id' => $product->id,
            'slug' => $product->urls->first()?->slug,
            'name' => $product->translateAttribute('name'),
            'image' => ($media = $product->images->sortBy('order_column')->first()) ? self::mediaUrl($media, 'small') : null,
            'variants' => $product->variants->map(fn (ProductVariant $variant) => [
                'id' => $variant->id,
                'title' => self::variantTitle($variant),
                ...$this->prices($variant),
                'available' => self::isAvailable($variant),
                'max_quantity' => self::maxQuantity($variant),
            ])->values(),
        ];
    }

    /**
     * Base price via Lunar's pricing manager (respects customer groups and price pipelines).
     *
     * @return array{price: int, compare_at_price: int|null}
     */
    private function prices(ProductVariant $variant): array
    {
        $matched = Pricing::for($variant)->qty(1)->get()->matched;
        $price = $matched->price->value;
        $compare = $matched->compare_price?->value;

        return ['price' => $price, 'compare_at_price' => $compare > $price ? $compare : null];
    }

    /**
     * Most units of a variant one cart line may hold: its Lunar stock (plus
     * backorder where allowed), capped at the store's per-line maximum.
     */
    public static function maxQuantity(ProductVariant $variant): int
    {
        $limit = match ($variant->purchasable) {
            'always' => StoreCart::MAX_QUANTITY,
            'in_stock_or_on_backorder' => $variant->stock + $variant->backorder,
            default => $variant->stock,
        };

        return max(0, min($limit, StoreCart::MAX_QUANTITY));
    }

    public static function isAvailable(ProductVariant $variant): bool
    {
        return match ($variant->purchasable) {
            'always' => true,
            'in_stock_or_on_backorder' => $variant->stock + $variant->backorder > 0,
            default => $variant->stock > 0,
        };
    }

    /**
     * "Front Cam / Black" style label from the variant's option values, or null for single-variant products.
     */
    public static function variantTitle(ProductVariant $variant): ?string
    {
        $values = $variant->values->sortBy(fn ($value) => $value->product_option_id)->map(fn ($value) => $value->translate('name'));

        return $values->isEmpty() ? null : $values->implode(' / ');
    }

    /**
     * Root-relative URL so images work on any host/port, regardless of APP_URL.
     * Falls back to the original file until resized conversions have been generated.
     */
    public static function mediaUrl(Media $media, ?string $conversion = null): string
    {
        $url = $conversion && $media->hasGeneratedConversion($conversion) ? $media->getUrl($conversion) : $media->getUrl();

        return parse_url($url, PHP_URL_PATH) ?: $url;
    }
}
