import { CheckIcon } from '@/components/store/icons';

/**
 * One control group per product option. `type: 'swatch'` renders colour circles,
 * anything else renders labelled buttons.
 */
export default function VariantSelector({ options = [], selected = [], onSelect, isValueAvailable = () => true }) {
    return (
        <div className="space-y-6">
            {options.map((option, optionIndex) => (
                <fieldset key={option.name}>
                    <legend className="mb-3 text-[17px]">
                        {option.name}: <span className="text-muted">{selected[optionIndex]}</span>
                    </legend>

                    <div className="flex flex-wrap gap-3">
                        {option.values.map((value) => {
                            const isSelected = selected[optionIndex] === value.label;
                            const available = isValueAvailable(optionIndex, value.label);

                            if (option.type === 'swatch') {
                                return (
                                    <button
                                        key={value.label}
                                        type="button"
                                        onClick={() => onSelect(optionIndex, value.label)}
                                        aria-pressed={isSelected}
                                        aria-label={`${value.label}${available ? '' : ' (sold out)'}`}
                                        title={value.label}
                                        className={`relative flex h-11 w-11 items-center justify-center rounded-full ${
                                            isSelected ? 'ring-2 ring-primary ring-offset-2' : 'ring-1 ring-[#E2E2E2] hover:ring-[#9A9A9A]'
                                        } ${available ? '' : 'opacity-40'}`}
                                    >
                                        <span className="h-full w-full rounded-full" style={{ background: value.swatch }} />
                                        {isSelected && <CheckIcon className="absolute h-4 w-4 text-white" strokeWidth={2.5} />}
                                    </button>
                                );
                            }

                            return (
                                <button
                                    key={value.label}
                                    type="button"
                                    onClick={() => onSelect(optionIndex, value.label)}
                                    aria-pressed={isSelected}
                                    className={`min-h-[52px] border px-5 text-[17px] transition-colors ${
                                        isSelected ? 'border-primary' : 'border-[#E2E2E2] hover:border-[#9A9A9A]'
                                    } ${available ? '' : 'text-muted line-through'}`}
                                >
                                    {value.label}
                                </button>
                            );
                        })}
                    </div>
                </fieldset>
            ))}
        </div>
    );
}
