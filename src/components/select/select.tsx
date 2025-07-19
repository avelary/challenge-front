'use client';

import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDown, Check } from "lucide-react";

type Option = {
  value: string;
  label: string;
};

type SelectProps = {
  label?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
};

export const Select = ({ label, options, value, onChange }: SelectProps) => {
  const selected = options.find((opt) => opt.value === value) || {
    label: "Selecione...",
    value: "",
  };

  return (
    <div className="flex flex-col pt-4 gap-[.4rem] w-[10rem]">
      {label && <label className="text-[.7rem] font-[600]">{label}</label>}
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button className="relative w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <span className="block truncate">{selected.label}</span>
            <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
              <ChevronDown size={16} />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black/10 focus:outline-none">
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  value={option.value}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-3 pr-10 ${
                      active ? "bg-blue-100 text-blue-900" : "text-black"
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-semibold" : "font-normal"
                        }`}
                      >
                        {option.label}
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 right-2 flex items-center">
                          <Check size={14} />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};
