<?php

namespace App\Http\Controllers;

use App\Storefront\Catalog;
use App\Storefront\ProductPresenter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Lunar\Models\Product;

class CollectionController extends Controller
{
    public function show(Catalog $catalog, ProductPresenter $presenter, string $slug): Response
    {
        $collection = $catalog->findCollection($slug);

        abort_if($collection === null, 404);

        return Inertia::render('ProductListing', [
            'heading' => $collection->translateAttribute('name'),
            'products' => $catalog->productsIn($collection)->map(fn (Product $product) => $presenter->card($product))->values(),
        ]);
    }

    public function search(Request $request, Catalog $catalog, ProductPresenter $presenter): Response
    {
        $query = trim((string) $request->validate(['q' => ['nullable', 'string', 'max:100']])['q'] ?? '');

        return Inertia::render('ProductListing', [
            'heading' => $query === '' ? 'Search' : "Results for “{$query}”",
            'query' => $query,
            'products' => $query === ''
                ? []
                : $catalog->search($query)->map(fn (Product $product) => $presenter->card($product))->values(),
        ]);
    }
}
