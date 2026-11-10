export const ACCEPTED_MIME_TYPES = ["image/jpeg", "image/png"] as const;
export const ACCEPTED_EXTENSIONS = [".jpg", ".jpeg", ".png"] as const;
export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const MIN_FILE_SIZE_BYTES = 1024;

export type FileValidationResult = { ok: true } | { ok: false; error: string };

export function validateImageFile(file: Pick<File, "name" | "type" | "size">): FileValidationResult {
  const name = file.name.toLowerCase();
  const hasValidExtension = ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
  const hasValidType = (ACCEPTED_MIME_TYPES as readonly string[]).includes(file.type);

  if (!hasValidExtension || !hasValidType) {
    return {
      ok: false,
      error: "Unsupported file format. Please upload a JPG, JPEG or PNG image.",
    };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      ok: false,
      error: `This file is too large (${formatFileSize(file.size)}). The maximum size is ${MAX_FILE_SIZE_MB} MB.`,
    };
  }
  if (file.size < MIN_FILE_SIZE_BYTES) {
    return {
      ok: false,
      error: "This file appears to be empty or corrupted. Please choose a different image.",
    };
  }
  return { ok: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function fileFormatLabel(type: string): "JPG" | "PNG" {
  return type === "image/png" ? "PNG" : "JPG";
}
