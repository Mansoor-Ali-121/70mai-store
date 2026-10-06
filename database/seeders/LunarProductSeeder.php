<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Lunar\Base\Enums\ProductAssociation as ProductAssociationType;
use Lunar\FieldTypes\Text;
use Lunar\FieldTypes\TranslatedText;
use Lunar\Models\Attribute;
use Lunar\Models\Brand;
use Lunar\Models\Channel;
use Lunar\Models\Collection;
use Lunar\Models\Currency;
use Lunar\Models\CustomerGroup;
use Lunar\Models\Language;
use Lunar\Models\Product;
use Lunar\Models\ProductAssociation;
use Lunar\Models\ProductOption;
use Lunar\Models\ProductOptionValue;
use Lunar\Models\ProductType;
use Lunar\Models\ProductVariant;
use Lunar\Models\TaxClass;
use Lunar\Models\Url;
use Throwable;

/**
 * Seeds the 70mai catalogue from database/seeders/data/products.json (a snapshot
 * of the live store). Existing products (matched by URL slug) are left alone, so
 * edits made in the Lunar admin survive re-seeding.
 */
class LunarProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = File::json(database_path('seeders/data/products.json'));

        foreach ($products as $data) {
            if ($this->findProduct($data['handle'])) {
                $this->command?->line("  Skipping {$data['handle']} (already exists)");

                continue;
            }

            $product = DB::transaction(fn () => $this->createProduct($data));
            $this->command?->info("  Seeded {$data['handle']}");

            if (config('store.seed_product_images')) {
                $this->attachImages($product, $data);
            }
        }

        // Associations need every product to exist first.
        foreach ($products as $data) {
            $product = $this->findProduct($data['handle']);

            foreach ($data['cross_sells'] as $targetHandle) {
                if ($target = $this->findProduct($targetHandle)) {
                    ProductAssociation::firstOrCreate([
                        'product_parent_id' => $product->id,
                        'product_target_id' => $target->id,
                        'type' => ProductAssociationType::CROSS_SELL->value,
                    ]);
                }
            }
        }
    }

    private function createProduct(array $data): Product
    {
        $language = Language::getDefault();

        $productType = ProductType::firstOrCreate(['name' => $data['product_type']]);
        $productType->mappedAttributes()->syncWithoutDetaching(
            Attribute::where('attribute_type', Product::morphName())->pluck('id')
        );

        $product = Product::create([
            'product_type_id' => $productType->id,
            'brand_id' => Brand::firstOrCreate(['name' => $data['brand']])->id,
            'status' => 'published',
            'attribute_data' => collect([
                'name' => new TranslatedText(['en' => $data['name']]),
                'description' => new TranslatedText(['en' => $data['description']]),
                ...collect($data['attributes'])->map(fn ($value) => new Text($value)),
            ]),
        ]);

        // Replace the auto-generated slug with the handle the storefront links to.
        $product->urls()->delete();
        $product->urls()->create(['slug' => $data['handle'], 'default' => true, 'language_id' => $language->id]);

        $product->scheduleChannel(Channel::getDefault());
        $product->scheduleCustomerGroup(CustomerGroup::getDefault());

        $collectionIds = Collection::whereHas('urls', fn ($q) => $q->whereIn('slug', $data['collections']))->pluck('id');
        $product->collections()->syncWithoutDetaching($collectionIds);

        // Options and their values, keyed by option handle then value name.
        $optionValues = [];
        foreach ($data['options'] as $position => $optionData) {
            $option = ProductOption::create([
                'name' => ['en' => $optionData['name']],
                'label' => ['en' => $optionData['name']],
                'handle' => "{$data['handle']}-{$optionData['handle']}",
                'shared' => false,
                'meta' => ['display' => $optionData['display']],
            ]);
            $product->productOptions()->attach($option->id, ['position' => $position + 1]);

            foreach ($optionData['values'] as $valuePosition => $valueData) {
                $optionValues[$optionData['handle']][$valueData['name']] = ProductOptionValue::create([
                    'product_option_id' => $option->id,
                    'name' => ['en' => $valueData['name']],
                    'position' => $valuePosition + 1,
                    'meta' => isset($valueData['swatch']) ? ['swatch' => $valueData['swatch']] : null,
                ])->id;
            }
        }

        $currency = Currency::getDefault();
        $taxClass = TaxClass::getDefault();

        foreach ($data['variants'] as $variantData) {
            $variant = ProductVariant::create([
                'product_id' => $product->id,
                'tax_class_id' => $taxClass->id,
                'sku' => $variantData['sku'],
                'stock' => $variantData['stock'],
                'backorder' => 0,
                'purchasable' => 'in_stock',
                'shippable' => true,
                'unit_quantity' => 1,
                'min_quantity' => 1,
                'quantity_increment' => 1,
            ]);

            $variant->values()->attach(collect($variantData['options'])->map(
                fn ($value, $optionHandle) => $optionValues[$optionHandle][$value]
            )->values());

            $variant->prices()->create([
                'currency_id' => $currency->id,
                'customer_group_id' => null,
                'min_quantity' => 1,
                'price' => $variantData['price'],
                'compare_price' => $variantData['compare_price'],
            ]);
        }

        return $product;
    }

    /**
     * Downloads the gallery into the media library. A failed download is skipped
     * rather than aborting the seed.
     */
    private function attachImages(Product $product, array $data): void
    {
        $media = [];

        foreach ($data['images'] as $index => $url) {
            try {
                $media[$index] = $product->addMediaFromUrl($url)
                    ->withCustomProperties(['primary' => $index === 0])
                    ->toMediaCollection(config('lunar.media.collection'));
            } catch (Throwable $e) {
                $this->command?->warn("  Could not download image {$index} for {$data['handle']}: {$e->getMessage()}");
            }
        }

        $product->variants()->get()->each(function (ProductVariant $variant) use ($data, $media) {
            $index = collect($data['variants'])->firstWhere('sku', $variant->sku)['image'] ?? null;

            if ($index !== null && isset($media[$index])) {
                $variant->images()->attach($media[$index]->id, ['primary' => true, 'position' => 1]);
            }
        });
    }

    private function findProduct(string $handle): ?Product
    {
        return Url::where('slug', $handle)
            ->where('element_type', Product::morphName())
            ->first()
            ?->element;
    }
}
