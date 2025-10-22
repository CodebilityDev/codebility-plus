"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@codevs/ui/button";
import { Input } from "@codevs/ui/input";
import { Textarea } from "@codevs/ui/textarea";
import { Label } from "@codevs/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@codevs/ui/select";
import { Switch } from "@codevs/ui/switch";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

const serviceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
  duration: z.string().min(1, "Duration is required"),
  features: z.array(z.string().min(1, "Feature cannot be empty")).min(1, "At least one feature is required"),
  category: z.string().min(1, "Category is required"),
  is_active: z.boolean(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
  category: string;
  is_active: boolean;
  created_at: string;
}

interface ServiceFormProps {
  service?: Service | null;
  onSuccess: () => void;
}

const serviceCategories = [
  "Development",
  "Design",
  "Marketing", 
  "Consulting",
  "Maintenance",
  "Other"
];

export default function ServiceForm({ service, onSuccess }: ServiceFormProps) {
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(service?.category || "Development");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: service?.name || "",
      description: service?.description || "",
      price: service?.price || 0,
      duration: service?.duration || "",
      features: service?.features || [""],
      category: service?.category || "Development",
      is_active: service?.is_active ?? true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  const isActive = watch("is_active");

  const onSubmit = async (data: ServiceFormData) => {
    setLoading(true);
    
    try {
      const { createService, updateService } = await import("../actions");
      
      if (service) {
        const result = await updateService(service.id, data);
        if (result.error) {
          throw new Error(result.error);
        }
      } else {
        const result = await createService(data);
        if (result.error) {
          throw new Error(result.error);
        }
      }
      
      toast.success(service ? "Service updated successfully" : "Service created successfully");
      onSuccess();
    } catch (error) {
      console.error("Error saving service:", error);
      toast.error("Failed to save service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-foreground dark:text-gray-300">Service Name *</Label>
          <Input
            id="name"
            variant="lightgray"
            {...register("name")}
            placeholder="e.g., Web Development"
            className="rounded"
          />
          {errors.name && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="text-foreground dark:text-gray-300">Category *</Label>
          <Select
            value={selectedCategory}
            onValueChange={(value) => {
              setSelectedCategory(value);
              setValue("category", value);
            }}
          >
            <SelectTrigger className="border bg-card dark:bg-gray-800 dark:border-gray-700 text-foreground rounded">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="border bg-card dark:bg-gray-800 dark:border-gray-700">
              {serviceCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.category.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-foreground dark:text-gray-300">Description *</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Describe what this service includes..."
          rows={3}
          className="border bg-card dark:bg-gray-800 dark:border-gray-700 text-foreground min-h-[120px] rounded"
        />
        {errors.description && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="price" className="text-foreground dark:text-gray-300">Price (USD) *</Label>
          <Input
            id="price"
            variant="lightgray"
            type="number"
            min="0"
            step="0.01"
            {...register("price", { valueAsNumber: true })}
            placeholder="5000"
            className="rounded"
          />
          {errors.price && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.price.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration" className="text-foreground dark:text-gray-300">Duration *</Label>
          <Input
            id="duration"
            variant="lightgray"
            {...register("duration")}
            placeholder="e.g., 4-6 weeks"
            className="rounded"
          />
          {errors.duration && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.duration.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-foreground dark:text-gray-300">Features *</Label>
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                variant="lightgray"
                {...register(`features.${index}`)}
                placeholder="Enter a feature"
                className="rounded flex-1"
              />
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          {errors.features && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.features.message || "Please fill all feature fields"}
            </p>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append("")}
            className="border border-gray-300 bg-accent hover:bg-gray-300 dark:border-gray-700 dark:bg-gray-800 text-foreground dark:hover:bg-gray-700 rounded"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Feature
          </Button>
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
          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded"
        >
          {loading ? "Saving..." : service ? "Update Service" : "Create Service"}
        </Button>
      </div>
    </form>
  );
}