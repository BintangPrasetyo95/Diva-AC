import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';
import React, { useState } from 'react';

export interface Option {
    value: string | number;
    label: string;
}

interface Props {
    options: Option[];
    value: string | number;
    onChange: (value: any) => void;
    placeholder?: string;
    className?: string;
}

export function SearchableSelect({
    options,
    value,
    onChange,
    placeholder = 'Select an option...',
    className = '',
}: Props) {
    const [query, setQuery] = useState('');

    const filteredOptions =
        query === ''
            ? options
            : options.filter((option) =>
                  (option.label || '').toLowerCase().includes(query.toLowerCase())
              );

    const selectedOption = options.find(
        (opt) => String(opt.value) === String(value)
    );

    return (
        <Combobox
            value={selectedOption || null}
            onChange={(opt: Option | null) => {
                onChange(opt ? opt.value : '');
                setQuery('');
            }}
            onClose={() => setQuery('')}
        >
            <div className="relative w-full">
                <div className="relative w-full">
                    <ComboboxInput
                        className={`w-full rounded-xl border border-[#1b1b18]/20 bg-transparent px-4 py-2 text-[#1b1b18] placeholder:text-[#1b1b18]/30 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none dark:border-white/20 dark:text-white dark:placeholder:text-white/30 ${className}`}
                        displayValue={(opt: Option) => opt?.label || ''}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={placeholder}
                    />
                    <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronDown
                            className="size-4 text-[#1b1b18]/50 dark:text-white/50"
                            aria-hidden="true"
                        />
                    </ComboboxButton>
                </div>

                <ComboboxOptions 
                    transition
                    className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-[#1b1b18]/10 bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in dark:border-white/10 dark:bg-[#121212] sm:text-sm"
                >
                    {filteredOptions.length === 0 && query !== '' ? (
                        <div className="relative cursor-default select-none px-4 py-2 text-[#1b1b18]/70 dark:text-white/70">
                            Nothing found.
                        </div>
                    ) : (
                        filteredOptions.map((option) => (
                            <ComboboxOption
                                key={option.value}
                                className={({ focus }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                        focus
                                            ? 'bg-red-600/10 text-red-600'
                                            : 'text-[#1b1b18] dark:text-white'
                                    }`
                                }
                                value={option}
                            >
                                {({ selected, focus }) => (
                                    <>
                                        <span
                                            className={`block truncate ${
                                                selected
                                                    ? 'font-bold'
                                                    : 'font-normal'
                                            }`}
                                        >
                                            {option.label}
                                        </span>
                                        {selected ? (
                                            <span
                                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                    focus
                                                        ? 'text-red-600'
                                                        : 'text-red-600'
                                                }`}
                                            >
                                                <Check
                                                    className="size-4"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        ) : null}
                                    </>
                                )}
                            </ComboboxOption>
                        ))
                    )}
                </ComboboxOptions>
            </div>
        </Combobox>
    );
}
