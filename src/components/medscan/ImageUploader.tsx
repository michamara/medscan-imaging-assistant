import { useCallback, useId, useRef, useState, type DragEvent } from "react";
import { AlertCircle, ImageUp, Lock, RefreshCw, Trash2, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MAX_FILE_SIZE_MB, formatFileSize, validateImageFile } from "@/lib/file-validation";

export interface SelectedImage {
  file: File;
  url: string;
  width: number;
  height: number;
}

function loadImage(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error("decode"));
    img.src = url;
  });
}

export function ImageUploader({
  value,
  onSelect,
  onRemove,
  uploadLabel,
  variant = "light",
  disabled,
}: {
  value: SelectedImage | null;
  onSelect: (image: SelectedImage) => void;
  onRemove: () => void;
  uploadLabel: string;
  variant?: "light" | "dark";
  disabled?: boolean;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reading, setReading] = useState(false);

  const handleFile = useCallback(
    async (file: File | undefined) => {
      if (!file) return;
      const result = validateImageFile(file);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setReading(true);
      const url = URL.createObjectURL(file);
      try {
        const { width, height } = await loadImage(url);
        setError(null);
        onSelect({ file, url, width, height });
      } catch {
        URL.revokeObjectURL(url);
        setError("We couldn't read this image. The file may be damaged — please try another JPG or PNG.");
      } finally {
        setReading(false);
      }
    },
    [onSelect],
  );

  const openPicker = () => inputRef.current?.click();

  const onDrop = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    const files = e.dataTransfer.files;
    if (files.length > 1) {
      setError("Please drop one image at a time.");
      return;
    }
    void handleFile(files[0]);
  };

  const dragHandlers = {
    onDragOver: (e: DragEvent<HTMLElement>) => {
      e.preventDefault();
      if (!disabled) setDragging(true);
    },
    onDragLeave: (e: DragEvent<HTMLElement>) => {
      e.preventDefault();
      setDragging(false);
    },
    onDrop,
  };

  return (
    <div className="space-y-3">
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          void handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {value ? (
        <div
          {...dragHandlers}
          className={cn(
            "overflow-hidden rounded-2xl border bg-card shadow-card transition-all",
            dragging && "ring-2 ring-sky ring-offset-2",
          )}
        >
          <div
            className={cn(
              "relative flex aspect-[4/3] items-center justify-center overflow-hidden",
              variant === "dark" ? "bg-navy-deep" : "bg-ecg-grid",
            )}
          >
            <img
              src={value.url}
              alt="Preview of your selected image"
              className="max-h-full max-w-full animate-fade-up object-contain"
            />
            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-primary shadow-card backdrop-blur">
              <Lock className="h-3 w-3 text-success" /> Local preview only
            </span>
          </div>
          <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-soft text-primary">
                <FileImage className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-primary">{value.file.name}</p>
                <p className="font-mono text-xs text-muted-foreground">
                  {formatFileSize(value.file.size)} · {value.width}×{value.height}px
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline-navy" size="sm" onClick={openPicker} disabled={disabled}>
                <RefreshCw /> Replace
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => {
                  setError(null);
                  onRemove();
                }}
                disabled={disabled}
              >
                <Trash2 /> Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          {...dragHandlers}
          className={cn(
            "group relative flex min-h-[320px] cursor-pointer flex-col items-center justify-center gap-5 overflow-hidden rounded-2xl border-2 border-dashed border-sky/40 bg-sky-soft/50 p-8 text-center transition-all duration-300",
            "hover:border-sky hover:bg-sky-soft",
            dragging && "scale-[1.01] border-sky bg-sky-soft shadow-glow",
            disabled && "pointer-events-none opacity-60",
          )}
        >
          <div className="absolute inset-0 bg-grid opacity-60" aria-hidden />
          <span className="relative inline-flex h-16 w-16 items-center justify-center">
            {dragging && <span className="absolute inset-0 animate-pulse-ring rounded-full bg-sky/30" />}
            <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-navy text-navy-foreground shadow-lift transition-transform duration-300 group-hover:-translate-y-1">
              <ImageUp className="h-7 w-7" />
            </span>
          </span>
          <div className="relative space-y-1.5">
            <p className="font-display text-xl font-medium text-primary">
              {reading ? "Reading image…" : dragging ? "Drop your image here" : "Drag & drop your image"}
            </p>
            <p className="text-sm text-muted-foreground">or use the button below to browse your files</p>
          </div>
          <span className="relative">
            <Button type="button" variant="hero" size="xl" onClick={openPicker} disabled={disabled || reading}>
              <ImageUp /> {uploadLabel}
            </Button>
          </span>
          <p className="relative font-mono text-[0.7rem] tracking-wide text-muted-foreground">
            JPG, JPEG or PNG · up to {MAX_FILE_SIZE_MB} MB · processed only in your browser
          </p>
        </label>
      )}

      {error && (
        <div
          role="alert"
          className="flex animate-fade-up items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
