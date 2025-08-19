// // // File: components/date-range-picker.tsx
// // import * as React from "react";
// // import { addDays, format } from "date-fns";
// // import { Calendar } from "@/components/ui/calendar";
// // import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// // import { Button } from "@/components/ui/button";
// // import { CalendarIcon } from "lucide-react";
// // import { DateRange } from "react-day-picker";

// // export function CalendarDateRangePicker({
// //   value,
// //   onChange,
// // }: {
// //   value: { startDate?: Date; endDate?: Date };
// //   onChange: (value: { startDate?: Date; endDate?: Date }) => void;
// // }) {
// //   const [open, setOpen] = React.useState(false);

// //   const handleSelect = (range: DateRange | undefined) => {
// //     if (range) {
// //       onChange({ startDate: range.from, endDate: range.to });
// //     }
// //   };

// //   return (
// //     <Popover open={open} onOpenChange={setOpen}>
// //       <PopoverTrigger asChild>
// //         <Button
// //           variant="outline"
// //           className="w-[250px] justify-start text-left font-normal"
// //         >
// //           <CalendarIcon className="mr-2 h-4 w-4" />
// //           {value?.startDate && value?.endDate ? (
// //             <>
// //               {format(value.startDate, "MMM dd, yyyy")} -{" "}
// //               {format(value.endDate, "MMM dd, yyyy")}
// //             </>
// //           ) : (
// //             <span>Pick a date range</span>
// //           )}
// //         </Button>
// //       </PopoverTrigger>
// //       <PopoverContent className="w-auto p-0" align="start">
// //         <Calendar
// //           initialFocus
// //           mode="range"
// //           defaultMonth={value?.startDate ?? new Date()}
// //           selected={{
// //             from: value?.startDate,
// //             to: value?.endDate,
// //           }}
// //           onSelect={handleSelect}
// //           numberOfMonths={2}
// //         />
// //       </PopoverContent>
// //     </Popover>
// //   );
// // }



// import * as React from "react";
// import { format } from "date-fns";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Button } from "@/components/ui/button";
// import { CalendarIcon } from "lucide-react";
// import { DateRange } from "react-day-picker";

// export function CalendarDateRangePicker({
//   value,
//   onChange,
// }: {
//   value: { startDate?: Date; endDate?: Date };
//   onChange: (value: { startDate?: Date; endDate?: Date }) => void;
// }) {
//   const [open, setOpen] = React.useState(false);

//   const handleSelect = (range: DateRange | undefined) => {
//     if (range?.from && range?.to) {
//       onChange({ startDate: range.from, endDate: range.to });
//     } else {
//       // allow resetting / selecting just one side
//       onChange({ startDate: range?.from, endDate: range?.to });
//     }
//   };

//   // Convert value into proper DateRange type for react-day-picker
//   const selectedRange: DateRange | undefined =
//     value.startDate || value.endDate
//       ? { from: value.startDate, to: value.endDate }
//       : undefined;

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button
//           variant="outline"
//           className="w-[250px] justify-start text-left font-normal"
//         >
//           <CalendarIcon className="mr-2 h-4 w-4" />
//           {value?.startDate && value?.endDate ? (
//             <>
//               {format(value.startDate, "MMM dd, yyyy")} -{" "}
//               {format(value.endDate, "MMM dd, yyyy")}
//             </>
//           ) : (
//             <span>Pick a date range</span>
//           )}
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-auto p-0" align="start">
//         <Calendar
//           initialFocus
//           mode="range"
//           defaultMonth={value?.startDate ?? new Date()}
//           selected={selectedRange}
//           onSelect={handleSelect}
//           numberOfMonths={2}
//         />
//       </PopoverContent>
//     </Popover>
//   );
// }



// import * as React from "react";
// import { addDays, format, startOfDay } from "date-fns";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Button } from "@/components/ui/button";
// import { CalendarIcon } from "lucide-react";
// import { DateRange } from "react-day-picker";

// export function CalendarDateRangePicker({
//   value,
//   onChange,
// }: {
//   value: { startDate?: Date; endDate?: Date };
//   onChange: (value: { startDate?: Date; endDate?: Date }) => void;
// }) {
//   const [open, setOpen] = React.useState(false);

//   const handleSelect = (range: DateRange | undefined) => {
//     if (range) {
//       // Normalize dates to start of day to avoid timezone issues
//       const startDate = range.from ? startOfDay(range.from) : undefined;
//       const endDate = range.to ? startOfDay(range.to) : undefined;

//       // If startDate is after endDate, swap them to maintain valid range
//       if (startDate && endDate && startDate > endDate) {
//         onChange({ startDate: endDate, endDate: startDate });
//       } else {
//         onChange({ startDate, endDate });
//       }
//     }
//   };

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button
//           variant="outline"
//           className="w-[250px] justify-start text-left font-normal"
//         >
//           <CalendarIcon className="mr-2 h-4 w-4" />
//           {value?.startDate && value?.endDate ? (
//             <>
//               {format(value.startDate, "MMM dd, yyyy")} -{" "}
//               {format(value.endDate, "MMM dd, yyyy")}
//             </>
//           ) : (
//             <span>Pick a date range</span>
//           )}
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-auto p-0" align="start">
//         <Calendar
//           initialFocus
//           mode="range"
//           defaultMonth={value?.startDate ?? new Date()}
//           selected={{
//             from: value?.startDate ? startOfDay(value.startDate) : undefined,
//             to: value?.endDate ? startOfDay(value.endDate) : undefined,
//           }}
//           onSelect={handleSelect}
//           numberOfMonths={2}
//         />
//       </PopoverContent>
//     </Popover>
//   );
// }


import * as React from "react";
import { addDays, format, startOfDay } from "date-fns";
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
    if (!range) return;

    let newStart = range.from ? startOfDay(range.from) : undefined;
    let newEnd = range.to ? startOfDay(range.to) : undefined;

    // Handle partial selection (single click after full range)
    if (newStart && !newEnd && value.startDate && value.endDate) {
      // If clicking before current start, extend start backward, keep end
      if (newStart < value.startDate) {
        newEnd = startOfDay(value.endDate);
      }
      // Otherwise, treat as starting a new range (e.g., click inside or elsewhere)
    } else if (newStart && newEnd) {
      // Full range selected, swap if start > end
      if (newStart > newEnd) {
        [newStart, newEnd] = [newEnd, newStart];
      }
    }

    onChange({ startDate: newStart, endDate: newEnd });
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
            from: value?.startDate ? startOfDay(value.startDate) : undefined,
            to: value?.endDate ? startOfDay(value.endDate) : undefined,
          }}
          onSelect={handleSelect}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}