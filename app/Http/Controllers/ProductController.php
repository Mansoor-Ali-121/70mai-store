<?php

namespace App\Http\Controllers;

use App\Storefront\Catalog;
use App\Storefront\ProductPresenter;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Product page backed by Lunar, queried fresh on every request so admin
     * edits (names, prices, stock, images) show up on the next page load.
     */
    public function show(Catalog $catalog, ProductPresenter $presenter, string $slug): Response
    {
        $product = $catalog->findBySlug($slug);

        abort_if($product === null, 404);

        return Inertia::render('ProductDetail', [
            'product' => $presenter->present($product),
        ]);
    }
}
