"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export type DropdownOption = {
  value: string;
  label: string;
};

type DropdownSelectProps = {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel: string;
};

export default function DropdownSelect({
  value,
  options,
  onChange,
  placeholder = "Selecciona una opción",
  ariaLabel
}: DropdownSelectProps) {
  const [open, setOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div ref={selectRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((current) => !current)}
        className="flex h-[42px] w-full items-center justify-between rounded-[10px] border border-[#e8ece8] bg-white px-3 text-left text-[13px] text-[#3D2D2E] outline-none transition hover:border-[#a5bba7] focus:border-[#83d58e]"
      >
        {selectedOption?.label ?? placeholder}
        <ChevronDown size={16} className={`text-[#8e8384] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div role="listbox" aria-label={`${ariaLabel} disponibles`} className="absolute left-0 right-0 top-full z-30 mt-2 rounded-xl border border-[#e8ece8] bg-white p-1.5 shadow-[0_10px_30px_rgba(45,65,45,0.12)]">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={value === option.value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[13px] transition ${value === option.value ? "bg-[#ADEBB3]/40 font-semibold text-[#3D2D2E]" : "text-[#665b5c] hover:bg-[#e4eee4]"}`}
            >
              {option.label}
              {value === option.value && <Check size={15} className="text-[#398247]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
