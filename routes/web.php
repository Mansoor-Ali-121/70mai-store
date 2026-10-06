<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/products/{slug}', [ProductController::class, 'show'])
    ->where('slug', '[a-z0-9-]+')
    ->name('products.show');

Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart/items', [CartController::class, 'store'])->name('cart.items.store');
Route::patch('/cart/items/{variant}', [CartController::class, 'update'])->whereNumber('variant')->name('cart.items.update');
Route::delete('/cart/items/{variant}', [CartController::class, 'destroy'])->whereNumber('variant')->name('cart.items.destroy');

Route::get('/checkout', [CheckoutController::class, 'show'])->name('checkout.show');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
// Not `{order}`: Lunar binds that parameter name to its own Order model.
Route::get('/checkout/confirmation/{reference}', [CheckoutController::class, 'confirmation'])->name('checkout.confirmation');
