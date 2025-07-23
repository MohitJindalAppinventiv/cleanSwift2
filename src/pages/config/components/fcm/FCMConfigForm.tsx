
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FCMConfig } from "../../types/fcm";

const formSchema = z.object({
  serverKey: z.string().min(1, "Server Key is required"),
  isEnabled: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface FCMConfigFormProps {
  defaultValues?: Partial<FCMConfig>;
  onSave: (data: FCMConfig) => void;
  isLoading?: boolean;
}

export const FCMConfigForm: React.FC<FCMConfigFormProps> = ({
  defaultValues,
  onSave,
  isLoading = false,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serverKey: defaultValues?.serverKey || "",
      isEnabled: defaultValues?.isEnabled !== undefined ? defaultValues.isEnabled : true,
    },
  });

  const onSubmit = (values: FormValues) => {
    onSave({
      serverKey: values.serverKey,
      isEnabled: values.isEnabled,
      lastUpdated: new Date().toISOString(),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="serverKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>FCM Server Key</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your FCM Server Key" 
                    {...field} 
                    type="password"
                  />
                </FormControl>
                <FormDescription>
                  The server key is used to authenticate requests to the Firebase Cloud Messaging API.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="isEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Enable FCM</FormLabel>
                  <FormDescription>
                    Toggle to enable or disable Firebase Cloud Messaging notifications.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save and Update"}
        </Button>
      </form>
    </Form>
  );
};
