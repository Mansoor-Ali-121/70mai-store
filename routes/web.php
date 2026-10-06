<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\CollectionController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

// Storefront pages. Every page reads products, prices and media from Lunar.
Route::get('/', HomeController::class)->name('home');

Route::get('/products/{slug}', [ProductController::class, 'show'])
    ->where('slug', '[a-z0-9-]+')
    ->name('products.show');

Route::get('/collections/{slug}', [CollectionController::class, 'show'])
    ->where('slug', '[a-z0-9-]+')
    ->name('collections.show');

Route::get('/search', [CollectionController::class, 'search'])->name('search');

Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart/items', [CartController::class, 'store'])->name('cart.items.store');
Route::patch('/cart/lines/{line}', [CartController::class, 'update'])->whereNumber('line')->name('cart.lines.update');
Route::delete('/cart/lines/{line}', [CartController::class, 'destroy'])->whereNumber('line')->name('cart.lines.destroy');

Route::get('/checkout', [CheckoutController::class, 'show'])->name('checkout.show');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
// Not `{order}`: Lunar binds that parameter name to its own Order model.
Route::get('/checkout/confirmation/{reference}', [CheckoutController::class, 'confirmation'])->name('checkout.confirmation');
