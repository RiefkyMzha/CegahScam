type TextFieldRule = {
  value: unknown;
  label: string;
  maxLength: number;
  optional?: boolean;
};

export function validateTextFields(fields: TextFieldRule[]): string | null {
  for (const { value, label, maxLength, optional = false } of fields) {
    if (value == null || value === "") {
      if (optional) continue;
      return `${label} harus diisi.`;
    }

    if (typeof value !== "string") {
      return `${label} tidak valid.`;
    }

    if (!value.trim()) {
      if (optional) continue;
      return `${label} harus diisi.`;
    }

    if (value.length > maxLength) {
      return `${label} maksimal ${maxLength} karakter.`;
    }
  }

  return null;
}
