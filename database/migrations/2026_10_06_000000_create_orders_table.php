<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->string('status')->default('pending');
            $table->string('email');
            $table->json('shipping_address');
            $table->char('currency', 3);
            $table->unsignedInteger('subtotal');
            $table->unsignedInteger('shipping_total');
            $table->unsignedInteger('total');
            $table->timestamp('placed_at');
            $table->timestamps();
        });

        Schema::create('order_lines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('variant_id');
            $table->string('name');
            $table->string('variant_title')->nullable();
            $table->string('image', 1024)->nullable();
            $table->unsignedInteger('unit_price');
            $table->unsignedSmallInteger('quantity');
            $table->unsignedInteger('line_total');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_lines');
        Schema::dropIfExists('orders');
    }
};
