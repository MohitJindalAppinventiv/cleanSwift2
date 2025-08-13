// import { Skeleton } from "@/components/ui/skeleton";
// import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Table } from "lucide-react";

// export default function AreaTableSkeleton() {
//   return (
//     <div className="border rounded-lg shadow-sm mt-4 overflow-hidden">
//       <Table>
//         <TableHeader>
//           <TableRow className="bg-purple-50">
//             {[...Array(5)].map((_, i) => (
//               <TableHead key={i}>
//                 <Skeleton className="h-4 w-24" />
//               </TableHead>
//             ))}
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {[...Array(5)].map((_, rowIndex) => (
//             <TableRow key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
//               {[...Array(5)].map((_, colIndex) => (
//                 <TableCell key={colIndex}>
//                   <Skeleton className="h-4 w-full" />
//                 </TableCell>
//               ))}
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }



import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AreaTableSkeleton() {
  return (
    <div className="border rounded-lg shadow-sm mt-4 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-purple-50">
            {[...Array(5)].map((_, i) => (
              <TableHead key={i}>
                <Skeleton className="h-4 w-24" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, rowIndex) => (
            <TableRow
              key={rowIndex}
              className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              {[...Array(5)].map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
