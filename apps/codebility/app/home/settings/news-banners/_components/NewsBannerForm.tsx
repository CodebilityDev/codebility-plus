"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@codevs/ui/button";
import { Input } from "@codevs/ui/input";
import { Textarea } from "@codevs/ui/textarea";
import { Label } from "@codevs/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@codevs/ui/select";
import { Switch } from "@codevs/ui/switch";
import { createClientClientComponent } from "@/utils/supabase/client";
import { toast } from "sonner";
import BannerImageUpload from "./BannerImageUpload";

const bannerSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  message: z.string().min(1, "Message is required"),
  type: z.enum(["info", "warning", "success", "error", "announcement"]),
  image_url: z.string().optional(),
  priority: z.number().min(1).max(100),
  is_active: z.boolean(),
  start_date: z.string(),
  end_date: z.string().optional(),
});

type BannerFormData = z.infer<typeof bannerSchema>;

interface NewsBanner {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error" | "announcement";
  image_url?: string;
  is_active: boolean;
  priority: number;
  start_date: string;
  end_date?: string;
}

interface NewsBannerFormProps {
  banner?: NewsBanner | null;
  onSuccess: () => void;
}

export default function NewsBannerForm({ banner, onSuccess }: NewsBannerFormProps) {
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string>(banner?.type || "info");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: banner?.title || "",
      message: banner?.message || "",
      type: banner?.type || "info",
      image_url: banner?.image_url || "",
      priority: banner?.priority || 1,
      is_active: banner?.is_active ?? true,
      start_date: banner?.start_date ? new Date(banner.start_date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
      end_date: banner?.end_date ? new Date(banner.end_date).toISOString().slice(0, 16) : "",
    },
  });

  const isActive = watch("is_active");

  const onSubmit = async (data: BannerFormData) => {
    setLoading(true);
    const supabase = createClientClientComponent();

    try {
      const bannerData = {
        title: data.title,
        message: data.message,
        type: data.type,
        image_url: data.image_url || null,
        priority: data.priority,
        is_active: data.is_active,
        start_date: new Date(data.start_date).toISOString(),
        end_date: data.end_date ? new Date(data.end_date).toISOString() : null,
        updated_at: new Date().toISOString(),
      };

      let result;
      if (banner) {
        // Update existing banner
        result = await supabase
          .from("news_banners")
          .update(bannerData)
          .eq("id", banner.id);
      } else {
        // Create new banner
        const { data: user } = await supabase.auth.getUser();
        result = await supabase
          .from("news_banners")
          .insert({
            ...bannerData,
            created_by: user.user?.id,
          });
      }

      if (result.error) {
        throw result.error;
      }

      toast.success(banner ? "Banner updated successfully" : "Banner created successfully");
      onSuccess();
    } catch (error) {
      console.error("Error saving banner:", error);
      toast.error("Failed to save banner");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTimeLocal = (date: string) => {
    if (!date) return "";
    return new Date(date).toISOString().slice(0, 16);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-foreground dark:text-gray-300">Title *</Label>
          <Input
            id="title"
            variant="lightgray"
            {...register("title")}
            placeholder="Enter banner title"
            className="rounded"
          />
          {errors.title && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type" className="text-foreground dark:text-gray-300">Type *</Label>
          <Select
            value={selectedType}
            onValueChange={(value) => {
              setSelectedType(value);
              setValue("type", value as any);
            }}
          >
            <SelectTrigger className="border bg-card dark:bg-gray-800 dark:border-gray-700 text-foreground rounded">
              <SelectValue placeholder="Select banner type" />
            </SelectTrigger>
            <SelectContent className="border bg-card dark:bg-gray-800 dark:border-gray-700">
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="announcement">Announcement</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.type.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-foreground dark:text-gray-300">Message *</Label>
        <Textarea
          id="message"
          {...register("message")}
          placeholder="Enter banner message"
          rows={3}
          className="border bg-card dark:bg-gray-800 dark:border-gray-700 text-foreground min-h-[120px] rounded"
        />
        {errors.message && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.message.message}</p>
        )}
      </div>

      {/* Banner Image Upload */}
      <BannerImageUpload
        value={watch("image_url") || ""}
        onChange={(imageUrl) => setValue("image_url", imageUrl || "")}
        disabled={loading}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="priority" className="text-foreground dark:text-gray-300">Priority</Label>
          <Input
            id="priority"
            variant="lightgray"
            type="number"
            min="1"
            max="100"
            {...register("priority", { valueAsNumber: true })}
            placeholder="1"
            className="rounded"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">Higher number = higher priority</p>
          {errors.priority && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.priority.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="start_date" className="text-foreground dark:text-gray-300">Start Date</Label>
          <Input
            id="start_date"
            variant="lightgray"
            type="datetime-local"
            {...register("start_date")}
            className="rounded"
          />
          {errors.start_date && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.start_date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_date" className="text-foreground dark:text-gray-300">End Date (Optional)</Label>
          <Input
            id="end_date"
            variant="lightgray"
            type="datetime-local"
            {...register("end_date")}
            className="rounded"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">Leave empty for no expiration</p>
          {errors.end_date && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.end_date.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={isActive}
          onCheckedChange={(checked) => setValue("is_active", checked)}
          className="data-[state=checked]:bg-customViolet-100 dark:[&>span]:bg-foreground [&>span]:bg-muted-foreground"
        />
        <Label htmlFor="is_active" className="text-foreground dark:text-gray-300">Active</Label>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button 
          type="submit" 
          disabled={loading}
          variant="purple"
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded"
        >
          {loading ? "Saving..." : banner ? "Update Banner" : "Create Banner"}
        </Button>
      </div>
    </form>
  );
}