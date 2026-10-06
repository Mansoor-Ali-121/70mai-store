import { useMemo, useState } from 'react';

/**
 * Tracks the selected value for each product option and resolves the matching variant.
 * Variants carry `options` in the same order as `product.options`.
 */
export function useVariantSelection(variants = []) {
    const [selected, setSelected] = useState(() => (variants.find((v) => v.available) ?? variants[0])?.options ?? []);

    const variant = useMemo(
        () => variants.find((v) => v.options.every((value, i) => value === selected[i])) ?? null,
        [variants, selected],
    );

    const selectOption = (optionIndex, value) =>
        setSelected((current) => current.map((v, i) => (i === optionIndex ? value : v)));

    const selectVariant = (variantId) => {
        const match = variants.find((v) => v.id === variantId);
        if (match) {
            setSelected(match.options);
        }
    };

    // A value is purchasable if some in-stock variant has it alongside the other current selections.
    const isValueAvailable = (optionIndex, value) =>
        variants.some(
            (v) => v.available && v.options[optionIndex] === value && v.options.every((o, i) => i === optionIndex || o === selected[i]),
        );

    return { selected, variant, selectOption, selectVariant, isValueAvailable };
}
