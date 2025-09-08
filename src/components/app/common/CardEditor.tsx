import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

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
  const validationSchema =
    type === "decision"
      ? Yup.object({
          decision: Yup.string().required("Decision is required"),
          reason: Yup.string(),
        })
      : Yup.object(
          Object.keys(initialData).reduce(
            (schema, key) => ({
              ...schema,
              [key]: Yup.string().required(`${key} is required`),
            }),
            {}
          )
        );

  return (
    <Formik
      initialValues={initialData}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        onSave(values);
      }}
    >
      {({ setFieldValue, values }) => (
        <Form className="space-y-2">
          {type === "decision" ? (
            <>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFieldValue("decision", "pass")}
                  className={`px-3 py-1 rounded text-xs cursor-pointer ${
                    values.decision === "pass"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  ✅ Pass
                </button>
                <button
                  type="button"
                  onClick={() => setFieldValue("decision", "fail")}
                  className={`px-3 py-1 rounded text-xs cursor-pointer ${
                    values.decision === "fail"
                      ? "bg-red-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  ❌ Fail
                </button>
              </div>
              <ErrorMessage
                name="decision"
                component="p"
                className="text-red-500 text-xs"
              />

              <Field
                name="reason"
                placeholder="Reason"
                className="w-full border rounded p-1 text-sm"
              />
              <ErrorMessage
                name="reason"
                component="p"
                className="text-red-500 text-xs"
              />
            </>
          ) : (
            Object.keys(initialData).map((key) =>
              key.toLowerCase().includes("date") ||
              key.toLowerCase().includes("until") ? (
                <div key={key}>
                  <DatePicker
                    selected={values[key] ? new Date(values[key]) : null}
                    onChange={(date: Date | null) =>
                      setFieldValue(key, date ? date.toISOString() : "")
                    }
                    className="w-full border rounded p-1 text-sm"
                    placeholderText={key}
                    dateFormat="yyyy-MM-dd"
                    portalId="root-portal"
                  />
                  <ErrorMessage
                    name={key}
                    component="p"
                    className="text-red-500 text-xs"
                  />
                </div>
              ) : (
                <div key={key}>
                  <Field
                    name={key}
                    placeholder={key}
                    className="w-full border rounded p-1 text-sm"
                  />
                  <ErrorMessage
                    name={key}
                    component="p"
                    className="text-red-500 text-xs"
                  />
                </div>
              )
            )
          )}

          <div className="flex gap-2 mt-2">
            <button
              type="submit"
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
        </Form>
      )}
    </Formik>
  );
};

export default CardEditor;
