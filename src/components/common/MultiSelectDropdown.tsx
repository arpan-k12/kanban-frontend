import React from "react";

interface MultiSelectDropdownProps {
  options: { label: string; value: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  keepOpen?: boolean;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  selected,
  onChange,
  keepOpen,
}) => {
  const handleSelect = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="border rounded bg-white shadow p-2 absolute z-10 right-0 top-10">
      {options.map((opt) => (
        <label
          key={opt.value}
          className="flex items-center gap-2 py-1 cursor-pointer"
          onClick={(e) => handleSelect(opt.value, e)}
        >
          <input type="checkbox" checked={selected.includes(opt.value)} />
          {opt.label}
        </label>
      ))}
    </div>
  );
};

export default MultiSelectDropdown;
