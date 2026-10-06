<?php

namespace App\Storefront\Exceptions;

use RuntimeException;

/**
 * Thrown when adding to the cart would take a line past the variant's stock.
 */
class InsufficientStock extends RuntimeException
{
    public function __construct(public readonly string $productName, public readonly int $remaining)
    {
        parent::__construct($remaining > 0
            ? "Only {$remaining} more of {$productName} can be added (limited stock)."
            : "You already have all available stock of {$productName} in your cart.");
    }
}
