
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Area } from "../../types/area";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";

interface AreaFormProps {
  area?: Area;
  onSave: (area: Partial<Area>) => void;
  onCancel: () => void;
}

export function AreaForm({ area, onSave, onCancel }: AreaFormProps) {
  const [formData, setFormData] = React.useState<Partial<Area>>(
    area || {
      name: "",
      city: "",
      postalCodes: [],
      isActive: true,
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePostalCodesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const postalCodesArray = e.target.value.split(",").map(code => code.trim());
    setFormData((prev) => ({ ...prev, postalCodes: postalCodesArray }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Area Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter area name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter city name"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="postalCodes">Postal Codes (comma separated)</Label>
        <Textarea
          id="postalCodes"
          name="postalCodes"
          value={formData.postalCodes?.join(", ")}
          onChange={handlePostalCodesChange}
          placeholder="e.g. 10001, 10002, 10003"
          rows={3}
          required
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, isActive: checked }))
          }
        />
        <Label htmlFor="isActive">Active</Label>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {area ? "Update Area" : "Add Area"}
        </Button>
      </div>
    </form>
  );
}
