// File: components/date-range-picker.tsx
import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

export function CalendarDateRangePicker({
  value,
  onChange,
}: {
  value: { startDate?: Date; endDate?: Date };
  onChange: (value: { startDate?: Date; endDate?: Date }) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (range: DateRange | undefined) => {
    if (range) {
      onChange({ startDate: range.from, endDate: range.to });
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[250px] justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value?.startDate && value?.endDate ? (
            <>
              {format(value.startDate, "MMM dd, yyyy")} -{" "}
              {format(value.endDate, "MMM dd, yyyy")}
            </>
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={value?.startDate ?? new Date()}
          selected={{
            from: value?.startDate,
            to: value?.endDate,
          }}
          onSelect={handleSelect}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
