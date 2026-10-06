import { CheckIcon } from '@/components/store/icons';
import { formatMoney } from '@/lib/money';
import QuantitySelector from './QuantitySelector';

function Price({ price, compareAtPrice, currency }) {
    return (
        <p className="flex items-baseline gap-2 text-lg">
            {compareAtPrice > price && <s className="text-base text-muted">{formatMoney(compareAtPrice, currency)}</s>}
            {formatMoney(price, currency)}
        </p>
    );
}

function SelectionCard({ selected, image, name, onToggle, children }) {
    return (
        <li
            className={`flex gap-3 rounded-lg border p-3 transition-colors sm:gap-4 sm:p-4 ${
                selected ? 'border-mai' : 'border-[#E2E2E2]'
            }`}
        >
            {onToggle ? (
                <button
                    type="button"
                    onClick={onToggle}
                    aria-pressed={selected}
                    aria-label={`${selected ? 'Remove' : 'Add'} ${name}`}
                    className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                        selected ? 'border-mai bg-mai text-white' : 'border-[#BDBDBD] bg-white'
                    }`}
                >
                    {selected && <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} />}
                </button>
            ) : (
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-mai text-white">
                    <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
            )}
            <img src={image} alt="" loading="lazy" className="h-16 w-16 shrink-0 border sm:h-[90px] sm:w-[90px] border-[#F0F0F0] object-contain" />
            <div className="min-w-0 flex-1 space-y-2">{children}</div>
        </li>
    );
}

const SELECT_CLASSES =
    'w-full rounded-none border border-[#D9D9D9] bg-white py-2 pl-3 pr-8 text-[15px] focus:border-primary focus:ring-0';

/**
 * "More Selections": the main product (always included) plus optional add-ons.
 * `selections` maps add-on product id → { selected, variantId, quantity }.
 */
export default function BundleSelections({ product, variant, onVariantChange, quantity, onQuantityChange, selections, onSelectionChange }) {
    const currency = product.currency;
    const addOns = product.bundle ?? [];

    return (
        <section aria-labelledby="bundle-heading">
            <h2 id="bundle-heading" className="mb-4 text-[22px] italic">
                More Selections:
            </h2>
            <ul className="max-h-[440px] space-y-4 overflow-y-auto pr-2">
                <SelectionCard selected image={product.images?.[variant?.image ?? 0]?.thumb} name={product.name}>
                    <div className="flex flex-col items-start gap-2 sm:flex-row sm:justify-between sm:gap-3">
                        <p className="text-[15px] leading-snug">{product.name}</p>
                        <QuantitySelector value={quantity} onChange={onQuantityChange} size="sm" />
                    </div>
                    {variant && <Price price={variant.price} compareAtPrice={variant.compare_at_price} currency={currency} />}
                    <select
                        value={variant?.id ?? ''}
                        onChange={(event) => onVariantChange(Number(event.target.value))}
                        aria-label={`${product.name} variant`}
                        className={SELECT_CLASSES}
                    >
                        {product.variants.map((v) => (
                            <option key={v.id} value={v.id} disabled={!v.available}>
                                {v.options.join(' / ')}
                                {v.available ? '' : ' (sold out)'}
                            </option>
                        ))}
                    </select>
                </SelectionCard>

                {addOns.map((addOn) => {
                    const state = selections[addOn.id];
                    const addOnVariant = addOn.variants.find((v) => v.id === state.variantId) ?? addOn.variants[0];
                    const update = (changes) => onSelectionChange(addOn.id, { ...state, ...changes });

                    return (
                        <SelectionCard
                            key={addOn.id}
                            selected={state.selected}
                            image={addOn.image}
                            name={addOn.name}
                            onToggle={() => update({ selected: !state.selected })}
                        >
                            <div className="flex flex-col items-start gap-2 sm:flex-row sm:justify-between sm:gap-3">
                                <p className="text-[15px] leading-snug">{addOn.name}</p>
                                <QuantitySelector
                                    value={state.quantity}
                                    onChange={(value) => update({ quantity: value })}
                                    size="sm"
                                    label={`${addOn.name} quantity`}
                                />
                            </div>
                            <Price price={addOnVariant.price} compareAtPrice={addOnVariant.compare_at_price} currency={currency} />
                            {addOn.variants.length > 1 && (
                                <select
                                    value={state.variantId}
                                    onChange={(event) => update({ variantId: Number(event.target.value) })}
                                    aria-label={`${addOn.name} option`}
                                    className={SELECT_CLASSES}
                                >
                                    {addOn.variants.map((v) => (
                                        <option key={v.id} value={v.id} disabled={!v.available}>
                                            {v.title}
                                            {v.available ? '' : ' (sold out)'}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </SelectionCard>
                    );
                })}
            </ul>
        </section>
    );
}
