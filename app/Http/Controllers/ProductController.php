<?php

namespace App\Http\Controllers;

use App\Support\ProductCatalog;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Demo product page backed by a JSON fixture until products come from Lunar.
     * The same fixture is the page's client-side fallback.
     */
    public function show(ProductCatalog $catalog, string $slug): Response
    {
        $product = $catalog->find($slug);

        abort_if($product === null, 404);

        return Inertia::render('ProductDetail', [
            'product' => $product,
        ]);
    }
}
