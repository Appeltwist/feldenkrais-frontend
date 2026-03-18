"use client";

import type { ChangeEvent } from "react";

import type {
  PrivateBookingPrepAnswers,
  PrivateBookingPrepField,
} from "@/lib/private-booking";

type PrivateBookingPrepFieldsProps = {
  fields: PrivateBookingPrepField[];
  locale: string;
  values: PrivateBookingPrepAnswers;
  disabled?: boolean;
  onChange: (key: string, value: unknown) => void;
};

function normalizeOptions(options: PrivateBookingPrepField["options"]) {
  if (!Array.isArray(options)) {
    return [];
  }

  return options.map((option) => String(option));
}

export default function PrivateBookingPrepFields({
  fields,
  locale,
  values,
  disabled = false,
  onChange,
}: PrivateBookingPrepFieldsProps) {
  if (fields.length === 0) {
    return null;
  }

  const isFrench = locale.toLowerCase().startsWith("fr");

  return (
    <div className="private-booking-fields">
      {fields.map((field) => {
        const value = values[field.key];
        const inputId = `private-booking-prep-${field.key}`;
        const helpId = field.help_text ? `${inputId}-help` : undefined;

        if (field.field_type === "TEXTAREA") {
          return (
            <div className="private-booking-field" key={field.key}>
              <label htmlFor={inputId}>
                {field.label}
                {field.required ? " *" : ""}
              </label>
              <textarea
                aria-describedby={helpId}
                className="private-booking-input private-booking-textarea"
                disabled={disabled}
                id={inputId}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => onChange(field.key, event.target.value)}
                placeholder={field.placeholder || undefined}
                required={field.required}
                rows={4}
                value={typeof value === "string" ? value : ""}
              />
              {field.help_text ? (
                <p className="private-booking-help" id={helpId}>
                  {field.help_text}
                </p>
              ) : null}
            </div>
          );
        }

        if (field.field_type === "SELECT") {
          const options = normalizeOptions(field.options);

          return (
            <div className="private-booking-field" key={field.key}>
              <label htmlFor={inputId}>
                {field.label}
                {field.required ? " *" : ""}
              </label>
              <select
                aria-describedby={helpId}
                className="private-booking-input"
                disabled={disabled}
                id={inputId}
                onChange={(event: ChangeEvent<HTMLSelectElement>) => onChange(field.key, event.target.value)}
                required={field.required}
                value={typeof value === "string" ? value : ""}
              >
                <option value="">
                  {field.placeholder || (isFrench ? "Choisir une option" : "Choose an option")}
                </option>
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {field.help_text ? (
                <p className="private-booking-help" id={helpId}>
                  {field.help_text}
                </p>
              ) : null}
            </div>
          );
        }

        if (field.field_type === "CHECKBOX") {
          return (
            <label className="private-booking-checkbox" htmlFor={inputId} key={field.key}>
              <input
                checked={Boolean(value)}
                disabled={disabled}
                id={inputId}
                onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(field.key, event.target.checked)}
                required={field.required}
                type="checkbox"
              />
              <span>
                {field.label}
                {field.required ? " *" : ""}
              </span>
              {field.help_text ? <small>{field.help_text}</small> : null}
            </label>
          );
        }

        return (
          <div className="private-booking-field" key={field.key}>
            <label htmlFor={inputId}>
              {field.label}
              {field.required ? " *" : ""}
            </label>
            <input
              aria-describedby={helpId}
              className="private-booking-input"
              disabled={disabled}
              id={inputId}
              onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(field.key, event.target.value)}
              placeholder={field.placeholder || undefined}
              required={field.required}
              type="text"
              value={typeof value === "string" ? value : ""}
            />
            {field.help_text ? (
              <p className="private-booking-help" id={helpId}>
                {field.help_text}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
