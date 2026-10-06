<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'reference',
        'status',
        'email',
        'shipping_address',
        'currency',
        'subtotal',
        'shipping_total',
        'total',
        'placed_at',
    ];

    protected function casts(): array
    {
        return [
            'shipping_address' => 'array',
            'placed_at' => 'datetime',
        ];
    }

    public function lines(): HasMany
    {
        return $this->hasMany(OrderLine::class);
    }
}
