/** Format an amount in minor units (cents), as Lunar and most carts store prices. */
export function formatMoney(cents, currency = 'USD') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100);
}
