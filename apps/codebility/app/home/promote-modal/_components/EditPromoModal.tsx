"use client";

import { useState } from "react";
import * as Icons from "lucide-react";
import { FeatureModal, ModalFeature } from "../type";
import { upsertActiveModal } from "../actions";
import IconPicker from "./IconPicker";
import { Upload, X } from "lucide-react";
import { uploadModalImage } from "../actions";

interface EditPromoModalProps {
  data: FeatureModal | null;
}

export default function EditPromoModal({ data }: EditPromoModalProps) {
  const [form, setForm] = useState<Partial<FeatureModal>>({
    id: data?.id,
    badge: data?.badge ?? "",
    headline: data?.headline ?? "",
    subheadline: data?.subheadline ?? "",
    cta_label: data?.cta_label ?? "",
    cta_href: data?.cta_href ?? "",
    dismiss_label: data?.dismiss_label ?? "Maybe later",
    features: data?.features ?? [],
    is_active: data?.is_active ?? true,
    image_url: data?.image_url ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);


  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];
  if (!file) return;

  setUploading(true);
  const formData = new FormData();
  formData.append("file", file);

  const { url, error } = await uploadModalImage(formData);
  setUploading(false);

  if (url) handleChange("image_url", url);
  else alert(error ?? "Upload failed.");
}

  function handleChange(field: keyof FeatureModal, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleFeatureChange(
    index: number,
    field: keyof ModalFeature,
    value: string
  ) {
    const updated = (form.features ?? []).map((f, i) =>
      i === index ? { ...f, [field]: value } : f
    ) as ModalFeature[];
    handleChange("features", updated);
  }

  function addFeature() {
    handleChange("features", [
      ...(form.features ?? []),
      { icon: "", title: "", description: "" } satisfies ModalFeature,
    ]);
  }

  function removeFeature(index: number) {
    handleChange(
      "features",
      (form.features ?? []).filter((_, i) => i !== index)
    );
  }

  async function handleSubmit() {
    setSaving(true);
    setMessage(null);
    const { error } = await upsertActiveModal(form);
    setSaving(false);
    setMessage(error ?? "Changes saved successfully.");
  }

  return (
    <div className="space-y-6">
      {/* ── Two-column grid ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* ── LEFT COLUMN: Content fields ── */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Modal Content
            </h2>
            {/* Active toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {form.is_active ? "Visible" : "Hidden"}
              </span>
              <button
                onClick={() => handleChange("is_active", !form.is_active)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  form.is_active
                    ? "bg-violet-600"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    form.is_active ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {(
              [
                { field: "badge", label: "Badge" },
                { field: "headline", label: "Headline" },
                { field: "subheadline", label: "Subheadline" },
              ] as const
            ).map(({ field, label }) => (
              <div key={field} className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {label}
                </label>
                {field === "subheadline" ? (
                  <textarea
                    rows={3}
                    value={(form[field] as string) ?? ""}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white resize-none"
                  />
                ) : (
                  <input
                    value={(form[field] as string) ?? ""}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                )}
              </div>
            ))}
          </div>

          <hr className="my-5 border-gray-200 dark:border-gray-700" />

          {/* CTA + Dismiss */}
          <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
            Call to Action
          </h3>
          <div className="space-y-4">
            {(
              [
                { field: "cta_label", label: "Button Label" },
                { field: "cta_href", label: "Button URL" },
                { field: "dismiss_label", label: "Dismiss Text" },
              ] as const
            ).map(({ field, label }) => (
              <div key={field} className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {label}
                </label>
                <input
                  value={(form[field] as string) ?? ""}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            ))}
          </div>
          
          {/* Image upload */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Image
            </label>

            {/* Preview */}
            {form.image_url && (
              <div className="relative h-36 w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                <img
                  src={form.image_url}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={() => handleChange("image_url", "")}
                  className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                >
                  <Icons.X className="h-3 w-3" />
                </button>
              </div>
            )}

            {/* Upload input */}
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-violet-400 py-3 text-sm text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors">
              <Icons.Upload className="h-4 w-4" />
              {uploading ? "Uploading..." : form.image_url ? "Replace Image" : "Upload Image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={handleImageUpload}
              />
            </label>
            <p className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
              <Icons.Info className="h-3 w-3 shrink-0" />
              Recommended size: <span className="font-medium text-gray-500 dark:text-gray-400">600 × 800px</span> (portrait) · JPG, PNG, WEBP
            </p>    
          </div>
        </div>
        
        {/* ── RIGHT COLUMN: Features + Preview ── */}
        <div className="flex flex-col gap-6">

          {/* Features editor */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <h2 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
              Features
            </h2>
            <div className="space-y-4">
              {form.features?.map((f, i) => (
                <div
                  key={i}
                  className="relative rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
                >
                  <button
                    onClick={() => removeFeature(i)}
                    className="absolute right-3 top-3 text-xs text-red-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    <div className="flex flex-col gap-1 col-span-4">
                      <label className="text-xs text-gray-500 dark:text-gray-400">
                        Icon
                      </label>
                      <IconPicker
                        value={f.icon}
                        onChange={(name) => handleFeatureChange(i, "icon", name)}
                      />
                    </div>
                    <div className="col-span-4 flex flex-col gap-1">
                      <label className="text-xs text-gray-500 dark:text-gray-400">
                        Title
                      </label>
                      <input
                        value={f.title}
                        onChange={(e) =>
                          handleFeatureChange(i, "title", e.target.value)
                        }
                        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500 dark:text-gray-400">
                      Description
                    </label>
                    <input
                      value={f.description}
                      onChange={(e) =>
                        handleFeatureChange(i, "description", e.target.value)
                      }
                      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={addFeature}
              className="mt-3 w-full rounded-xl border border-dashed border-violet-400 px-4 py-2 text-sm text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
            >
              + Add Feature
            </button>
          </div>

          {/* Live preview */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <h2 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
              Preview
            </h2>
            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="flex min-h-[280px]">

                {/* Image panel */}
                <div className="relative w-[40%] shrink-0">
                  {form.image_url ? (
                    <img
                      src={form.image_url}
                      alt="Preview"
                      className="absolute inset-0 h-full w-full object-cover object-top"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                      <Icons.Image className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                    </div>
                  )}
                  {/* Vertical gradient strip */}
                  <div className="absolute top-0 right-0 bottom-0 w-1 bg-gradient-to-b from-violet-500 via-blue-500 to-cyan-400" />
                </div>

                {/* Content panel */}
                <div className="flex flex-col flex-1 bg-white dark:bg-gray-900 px-4 py-4">
                  {form.badge && (
                    <span className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                      ✨ {form.badge}
                    </span>
                  )}
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {form.headline || (
                      <span className="text-gray-300 dark:text-gray-600">Headline...</span>
                    )}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {form.subheadline || (
                      <span className="text-gray-300 dark:text-gray-600">Subheadline...</span>
                    )}
                  </p>

                  {(form.features ?? []).length > 0 && (
                    <ul className="mt-2 space-y-1 flex-1">
                      {form.features?.map((f, i) => {
                        const Icon = f.icon
                          ? (Icons[f.icon as keyof typeof Icons] as Icons.LucideIcon)
                          : null;
                        return (
                          <li key={i} className="flex items-center gap-2 rounded-lg bg-gray-50 px-2 py-1.5 dark:bg-gray-800">
                            {Icon && <Icon className="h-3 w-3 shrink-0 text-violet-600" />}
                            <div>
                              <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">
                                {f.title}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {f.description}
                              </p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  <div className="mt-3 flex gap-2">
                    <div className="flex-1 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-2 py-1.5 text-center text-xs font-semibold text-white">
                      {form.cta_label || "CTA Button"}
                    </div>
                    <div className="flex-1 rounded-lg px-2 py-1.5 text-center text-xs text-gray-500">
                      {form.dismiss_label || "Maybe later"}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Save bar ── */}
      <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
        {message ? (
          <p
            className={`text-sm font-medium ${
              message.includes("Failed") ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        ) : (
          <p className="text-sm text-gray-400">Unsaved changes</p>
        )}
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 transition-all"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}