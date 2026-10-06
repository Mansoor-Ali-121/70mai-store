<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Lunar\FieldTypes\Text;
use Lunar\FieldTypes\TranslatedText;
use Lunar\Models\Collection;
use Lunar\Models\CollectionGroup;
use Lunar\Models\Language;
use Lunar\Models\Product;
use Lunar\Models\Url;

/**
 * Homepage merchandising: the "Explore by Series" collection, whose products
 * (in collection order) become the homepage series tabs. Runs once; after
 * that the collection is managed in the Lunar admin.
 */
class HomepageSeeder extends Seeder
{
    /** Product slug => series tab label, in display order. */
    private const SERIES = [
        'dash-cam-4k-omni' => 'Pioneering - X Series',
        'dash-cam-a810' => 'With Screen - A Series',
        'dash-cam-m310' => 'Screenless - M Series',
        'rearview-dash-cam-s500' => 'Streaming - S Series',
    ];

    public function run(): void
    {
        if (Url::where('slug', config('store.homepage_series'))->where('element_type', Collection::morphName())->exists()) {
            $this->command?->line('  Skipping homepage series (collection already exists)');

            return;
        }

        $collection = Collection::create([
            'collection_group_id' => CollectionGroup::where('handle', 'main')->firstOrFail()->id,
            'attribute_data' => ['name' => new TranslatedText(['en' => new Text('Explore by Series')])],
        ]);
        $collection->urls()->delete();
        $collection->urls()->create([
            'slug' => config('store.homepage_series'),
            'default' => true,
            'language_id' => Language::getDefault()->id,
        ]);

        $position = 1;
        foreach (self::SERIES as $slug => $label) {
            $product = Url::where('slug', $slug)->where('element_type', Product::morphName())->first()?->element;

            if (! $product) {
                continue;
            }

            $collection->products()->attach($product->id, ['position' => $position++]);

            // Fill the tab label only where the admin hasn't set one.
            if (blank($product->translateAttribute('series'))) {
                $attributes = $product->attribute_data;
                $attributes['series'] = new Text($label);
                $product->update(['attribute_data' => $attributes]);
            }
        }
    }
}
