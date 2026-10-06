<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Lunar\FieldTypes\Text;
use Lunar\FieldTypes\TranslatedText;
use Lunar\Models\Attribute;
use Lunar\Models\AttributeGroup;
use Lunar\Models\Channel;
use Lunar\Models\Collection;
use Lunar\Models\CollectionGroup;
use Lunar\Models\Country;
use Lunar\Models\Currency;
use Lunar\Models\CustomerGroup;
use Lunar\Models\Language;
use Lunar\Models\Product;
use Lunar\Models\TaxClass;
use Lunar\Models\TaxZone;

/**
 * The store-wide records Lunar needs before products can be sold, mirroring
 * `lunar:install`, plus the storefront's extra product attributes.
 * Safe to run repeatedly.
 */
class LunarBaseSeeder extends Seeder
{
    /** Storefront text attributes editable in the Lunar admin, in display order. */
    private const PRODUCT_ATTRIBUTES = [
        'name' => ['Name', TranslatedText::class, true],
        'description' => ['Description', TranslatedText::class, false],
        'short_name' => ['Short name', Text::class, false],
        'series' => ['Series', Text::class, false],
        'tagline' => ['Tagline', Text::class, false],
        'notice' => ['Notice', Text::class, false],
        'promo' => ['Promotion', Text::class, false],
    ];

    public function run(): void
    {
        if (! Country::exists()) {
            $this->importCountries();
        }

        Language::firstOrCreate(['code' => 'en'], ['name' => 'English', 'default' => true]);

        Currency::firstOrCreate(['code' => 'USD'], [
            'name' => 'US Dollar',
            'exchange_rate' => 1,
            'decimal_places' => 2,
            'default' => true,
            'enabled' => true,
        ]);

        Channel::firstOrCreate(['handle' => 'webstore'], [
            'name' => 'Webstore',
            'default' => true,
            'url' => config('app.url'),
        ]);

        CustomerGroup::firstOrCreate(['handle' => 'retail'], ['name' => 'Retail', 'default' => true]);

        TaxClass::firstOrCreate(['name' => 'Default Tax Class'], ['default' => true]);

        // No tax rates are added, so tax totals are 0 until rates are configured in the admin.
        if (! TaxZone::exists()) {
            $zone = TaxZone::create([
                'name' => 'Default Tax Zone',
                'zone_type' => 'country',
                'price_display' => 'tax_exclusive',
                'default' => true,
                'active' => true,
            ]);
            $zone->countries()->createMany(Country::pluck('id')->map(fn ($id) => ['country_id' => $id]));
        }

        $this->seedProductAttributes();
        $this->seedCollections();
    }

    /**
     * Same data and mapping as `lunar:import:address-data`, but with a longer
     * timeout: that command gives up after 30s on slow connections.
     */
    private function importCountries(): void
    {
        $countries = Http::timeout(180)->retry(2, 1000)
            ->get('http://data.lunarphp.io/countries+states.json')
            ->throw()
            ->object();

        foreach ($countries as $country) {
            Country::create([
                'name' => $country->name,
                'iso3' => $country->iso3,
                'iso2' => $country->iso2,
                'phonecode' => $country->phone_code,
                'capital' => $country->capital,
                'currency' => $country->currency,
                'native' => $country->native,
                'emoji' => $country->emoji,
                'emoji_u' => $country->emojiU,
            ])->states()->createMany(
                collect($country->states)->map(fn ($state) => ['name' => $state->name, 'code' => $state->state_code])->all()
            );
        }
    }

    private function seedProductAttributes(): void
    {
        $group = AttributeGroup::firstOrCreate(
            ['handle' => 'details', 'attributable_type' => Product::morphName()],
            ['name' => ['en' => 'Details'], 'position' => 1],
        );

        $position = 1;
        foreach (self::PRODUCT_ATTRIBUTES as $handle => [$label, $type, $required]) {
            Attribute::firstOrCreate(
                ['attribute_type' => Product::morphName(), 'handle' => $handle],
                [
                    'attribute_group_id' => $group->id,
                    'position' => $position++,
                    'name' => ['en' => $label],
                    'section' => 'main',
                    'type' => $type,
                    'required' => $required,
                    'configuration' => ['richtext' => $handle === 'description'],
                    'system' => $handle === 'name',
                    'description' => ['en' => ''],
                ],
            );
        }

        $collectionGroup = AttributeGroup::firstOrCreate(
            ['handle' => 'collection_details', 'attributable_type' => Collection::morphName()],
            ['name' => ['en' => 'Details'], 'position' => 1],
        );

        Attribute::firstOrCreate(
            ['attribute_type' => Collection::morphName(), 'handle' => 'name'],
            [
                'attribute_group_id' => $collectionGroup->id,
                'position' => 1,
                'name' => ['en' => 'Name'],
                'section' => 'main',
                'type' => TranslatedText::class,
                'required' => true,
                'configuration' => ['richtext' => false],
                'system' => true,
                'description' => ['en' => ''],
            ],
        );
    }

    private function seedCollections(): void
    {
        $group = CollectionGroup::firstOrCreate(['handle' => 'main'], ['name' => 'Main']);

        foreach (['dash-cams' => 'Dash Cams', 'accessories' => 'Accessories', 'hardwire-kits' => 'Hardwire Kits'] as $slug => $name) {
            if ($group->collections()->whereHas('urls', fn ($q) => $q->where('slug', $slug))->exists()) {
                continue;
            }

            $collection = Collection::create([
                'collection_group_id' => $group->id,
                'attribute_data' => ['name' => new TranslatedText(['en' => new Text($name)])],
            ]);

            $collection->urls()->delete();
            $collection->urls()->create([
                'slug' => $slug,
                'default' => true,
                'language_id' => Language::getDefault()->id,
            ]);
        }
    }
}
