import React, { useState } from "react";

interface Props {
  initialData: Record<string, string>;
  onSave: (data: Record<string, string>) => void;
  onCancel: () => void;
}

const CardEditor: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-2">
      {Object.keys(formData).map((key) => (
        <input
          key={key}
          name={key}
          value={formData[key]}
          onChange={handleChange}
          placeholder={key}
          className="w-full border rounded p-1 text-sm"
        />
      ))}
      <div className="flex gap-2 mt-2">
        <button
          type="button"
          onClick={() => onSave(formData)}
          className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 px-2 py-1 rounded text-xs"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CardEditor;
