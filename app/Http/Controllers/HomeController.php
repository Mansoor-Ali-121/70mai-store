<?php

namespace App\Http\Controllers;

use App\Storefront\Catalog;
use App\Storefront\ProductPresenter;
use Inertia\Inertia;
use Inertia\Response;
use Lunar\Models\Product;

class HomeController extends Controller
{
    public function __invoke(Catalog $catalog, ProductPresenter $presenter): Response
    {
        $series = $catalog->findCollection(config('store.homepage_series'));
        $dashCams = $catalog->findCollection('dash-cams');

        $cards = fn ($collection) => $collection
            ? $catalog->productsIn($collection)->map(fn (Product $product) => $presenter->card($product))->values()
            : collect();

        return Inertia::render('Home', [
            // "Explore by Series" tabs, in the order set on the Lunar collection.
            'series' => $cards($series),
            // Products the hero banners link to, keyed by slug.
            'products' => $cards($dashCams)->keyBy('slug'),
        ]);
    }
}
