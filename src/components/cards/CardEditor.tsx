import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
  initialData: Record<string, string>;
  onSave: (data: Record<string, string>) => void;
  onCancel: () => void;
  type?: "default" | "decision";
}

const CardEditor: React.FC<Props> = ({
  initialData,
  onSave,
  onCancel,
  type = "default",
}) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-2">
      {type === "decision" ? (
        <>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, decision: "pass" })}
              className={`px-3 py-1 rounded text-xs ${
                formData.decision === "pass"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              ✅ Pass
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, decision: "fail" })}
              className={`px-3 py-1 rounded text-xs ${
                formData.decision === "fail"
                  ? "bg-red-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              ❌ Fail
            </button>
          </div>

          <input
            name="reason"
            value={formData.reason || ""}
            onChange={handleChange}
            placeholder="Reason (optional)"
            className="w-full border rounded p-1 text-sm"
          />
        </>
      ) : (
        Object.keys(formData).map((key) =>
          key.toLowerCase().includes("date") ||
          key.toLowerCase().includes("until") ? (
            <DatePicker
              key={key}
              selected={formData[key] ? new Date(formData[key]) : null}
              onChange={(date: Date | null) =>
                setFormData({
                  ...formData,
                  [key]: date ? date.toISOString() : "",
                })
              }
              className="w-full border rounded p-1 text-sm"
              placeholderText={key}
              dateFormat="yyyy-MM-dd"
            />
          ) : (
            <input
              key={key}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              placeholder={key}
              className="w-full border rounded p-1 text-sm"
            />
          )
        )
      )}

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
