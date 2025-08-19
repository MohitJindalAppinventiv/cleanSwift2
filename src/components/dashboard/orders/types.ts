
// Order status types
export type OrderStatus = "new" | "processing" | "pickup" | "delivered" | "completed";

// Order service types
export type ServiceType = "wash_fold" | "dry_clean" | "express";

// Payment status types
export type PaymentStatus = "paid" | "pending" | "failed";

export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

// export interface Order {
//   id: string;
//   customer: string;
//   service: ServiceType;
//   status: OrderStatus;
//   date: string;
//   pickupDate: string;
//   pickupTime: string;
//   deliveryDate: string;
//   deliveryTime: string;
//   total: number;
//   discount: number;
//   deliveryCharge: number;
//   totalQuantity: number;
//   paymentStatus: PaymentStatus;
//   driver?: string;
//   items?: OrderItem[];
// }


interface AddressDetails{
  addressLabel:string;

}
export interface Order{
  addressDetails:AddressDetails;
  createdAt:Date;
  customerName:string;
  finalTotal:number;
  id:string;
  orderId:string;
  paymentMethod:string;
  paymentStatus:string;
  status:string;
}
export interface Pagination{
  limit:number;
  page:number;
  total:number;
  totalPages:number;
}

export const serviceLabels: Record<ServiceType, string> = {
  wash_fold: "Wash & Fold",
  dry_clean: "Dry Clean",
  express: "Express",
};

// Pagination interface
export interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customer: "Emma Johnson",
    service: "wash_fold",
    status: "completed",
    date: "2023-05-20",
    pickupDate: "2023-05-18",
    pickupTime: "10:30 AM",
    deliveryDate: "2023-05-20",
    deliveryTime: "2:45 PM",
    total: 29.99,
    discount: 5.00,
    deliveryCharge: 3.50,
    totalQuantity: 8,
    paymentStatus: "paid",
    driver: "John Smith",
    items: [
      { id: 1, name: "Shirts", quantity: 3, price: 8.99 },
      { id: 2, name: "Pants", quantity: 2, price: 12.50 },
      { id: 3, name: "Sweaters", quantity: 1, price: 15.00 }
    ]
  },
  {
    id: "ORD-002",
    customer: "John Davis",
    service: "dry_clean",
    status: "delivered",
    date: "2023-05-19",
    pickupDate: "2023-05-17",
    pickupTime: "1:15 PM",
    deliveryDate: "2023-05-19",
    deliveryTime: "4:30 PM",
    total: 49.99,
    discount: 0,
    deliveryCharge: 3.50,
    totalQuantity: 5,
    paymentStatus: "paid",
    items: [
      { id: 1, name: "Suits", quantity: 2, price: 22.99 },
      { id: 2, name: "Dresses", quantity: 1, price: 18.99 }
    ]
  },
  {
    id: "ORD-003",
    customer: "Sarah Wilson",
    service: "express",
    status: "processing",
    date: "2023-05-19",
    pickupDate: "2023-05-19",
    pickupTime: "9:00 AM",
    deliveryDate: "2023-05-20",
    deliveryTime: "5:00 PM",
    total: 39.99,
    discount: 0,
    deliveryCharge: 5.00,
    totalQuantity: 3,
    paymentStatus: "pending"
  },
  {
    id: "ORD-004",
    customer: "Michael Brown",
    service: "wash_fold",
    status: "pickup",
    date: "2023-05-18",
    pickupDate: "2023-05-18",
    pickupTime: "3:30 PM",
    deliveryDate: "2023-05-21",
    deliveryTime: "11:15 AM",
    total: 25.99,
    discount: 0,
    deliveryCharge: 3.50,
    totalQuantity: 10,
    paymentStatus: "paid"
  },
  {
    id: "ORD-005",
    customer: "Lisa Taylor",
    service: "dry_clean",
    status: "new",
    date: "2023-05-18",
    pickupDate: "2023-05-20",
    pickupTime: "10:00 AM",
    deliveryDate: "2023-05-23",
    deliveryTime: "2:00 PM",
    total: 45.99,
    discount: 10.00,
    deliveryCharge: 0,
    totalQuantity: 6,
    paymentStatus: "pending"
  },
  // Adding 20 more orders
  {
    id: "ORD-006",
    customer: "David Miller",
    service: "wash_fold",
    status: "new",
    date: "2023-05-17",
    pickupDate: "2023-05-19",
    pickupTime: "11:00 AM",
    deliveryDate: "2023-05-22",
    deliveryTime: "3:00 PM",
    total: 32.99,
    discount: 0,
    deliveryCharge: 3.50,
    totalQuantity: 7,
    paymentStatus: "pending"
  },
  {
    id: "ORD-007",
    customer: "Jennifer White",
    service: "express",
    status: "processing",
    date: "2023-05-17",
    pickupDate: "2023-05-17",
    pickupTime: "2:00 PM",
    deliveryDate: "2023-05-18",
    deliveryTime: "10:00 AM",
    total: 65.50,
    discount: 5.00,
    deliveryCharge: 7.50,
    totalQuantity: 12,
    paymentStatus: "paid"
  },
  {
    id: "ORD-008",
    customer: "Robert Green",
    service: "dry_clean",
    status: "completed",
    date: "2023-05-16",
    pickupDate: "2023-05-16",
    pickupTime: "9:30 AM",
    deliveryDate: "2023-05-18",
    deliveryTime: "1:45 PM",
    total: 42.75,
    discount: 0,
    deliveryCharge: 3.50,
    totalQuantity: 4,
    paymentStatus: "paid"
  },
  {
    id: "ORD-009",
    customer: "Patricia Adams",
    service: "wash_fold",
    status: "delivered",
    date: "2023-05-16",
    pickupDate: "2023-05-14",
    pickupTime: "4:00 PM",
    deliveryDate: "2023-05-16",
    deliveryTime: "5:30 PM",
    total: 27.50,
    discount: 0,
    deliveryCharge: 3.50,
    totalQuantity: 6,
    paymentStatus: "paid"
  },
  {
    id: "ORD-010",
    customer: "James Wilson",
    service: "express",
    status: "pickup",
    date: "2023-05-15",
    pickupDate: "2023-05-15",
    pickupTime: "10:45 AM",
    deliveryDate: "2023-05-16",
    deliveryTime: "9:00 AM",
    total: 55.99,
    discount: 10.00,
    deliveryCharge: 5.00,
    totalQuantity: 9,
    paymentStatus: "pending"
  },
  {
    id: "ORD-011",
    customer: "Linda Harris",
    service: "dry_clean",
    status: "new",
    date: "2023-05-15",
    pickupDate: "2023-05-17",
    pickupTime: "1:30 PM",
    deliveryDate: "2023-05-20",
    deliveryTime: "4:15 PM",
    total: 48.25,
    discount: 0,
    deliveryCharge: 0,
    totalQuantity: 5,
    paymentStatus: "pending"
  },
  {
    id: "ORD-012",
    customer: "William Clark",
    service: "wash_fold",
    status: "processing",
    date: "2023-05-14",
    pickupDate: "2023-05-14",
    pickupTime: "3:15 PM",
    deliveryDate: "2023-05-17",
    deliveryTime: "2:30 PM",
    total: 35.75,
    discount: 5.00,
    deliveryCharge: 3.50,
    totalQuantity: 8,
    paymentStatus: "paid"
  },
  {
    id: "ORD-013",
    customer: "Elizabeth Young",
    service: "express",
    status: "completed",
    date: "2023-05-14",
    pickupDate: "2023-05-14",
    pickupTime: "9:15 AM",
    deliveryDate: "2023-05-15",
    deliveryTime: "11:00 AM",
    total: 62.50,
    discount: 0,
    deliveryCharge: 7.50,
    totalQuantity: 10,
    paymentStatus: "paid"
  },
  {
    id: "ORD-014",
    customer: "Richard Lee",
    service: "dry_clean",
    status: "delivered",
    date: "2023-05-13",
    pickupDate: "2023-05-11",
    pickupTime: "2:45 PM",
    deliveryDate: "2023-05-13",
    deliveryTime: "6:00 PM",
    total: 51.99,
    discount: 0,
    deliveryCharge: 3.50,
    totalQuantity: 7,
    paymentStatus: "paid"
  },
  {
    id: "ORD-015",
    customer: "Susan Baker",
    service: "wash_fold",
    status: "pickup",
    date: "2023-05-13",
    pickupDate: "2023-05-13",
    pickupTime: "11:30 AM",
    deliveryDate: "2023-05-16",
    deliveryTime: "10:15 AM",
    total: 28.75,
    discount: 0,
    deliveryCharge: 3.50,
    totalQuantity: 6,
    paymentStatus: "pending"
  },
  {
    id: "ORD-016",
    customer: "Thomas Scott",
    service: "express",
    status: "new",
    date: "2023-05-12",
    pickupDate: "2023-05-14",
    pickupTime: "10:15 AM",
    deliveryDate: "2023-05-15",
    deliveryTime: "1:30 PM",
    total: 59.99,
    discount: 10.00,
    deliveryCharge: 5.00,
    totalQuantity: 11,
    paymentStatus: "pending"
  },
  {
    id: "ORD-017",
    customer: "Jessica Garcia",
    service: "dry_clean",
    status: "processing",
    date: "2023-05-12",
    pickupDate: "2023-05-12",
    pickupTime: "4:30 PM",
    deliveryDate: "2023-05-15",
    deliveryTime: "5:45 PM",
    total: 47.50,
    discount: 0,
    deliveryCharge: 3.50,
    totalQuantity: 5,
    paymentStatus: "paid"
  },
  {
    id: "ORD-018",
    customer: "Charles Martinez",
    service: "wash_fold",
    status: "completed",
    date: "2023-05-11",
    pickupDate: "2023-05-09",
    pickupTime: "9:45 AM",
    deliveryDate: "2023-05-11",
    deliveryTime: "3:15 PM",
    total: 31.25,
    discount: 0,
    deliveryCharge: 3.50,
    totalQuantity: 7,
    paymentStatus: "paid"
  },
  {
    id: "ORD-019",
    customer: "Karen Robinson",
    service: "express",
    status: "delivered",
    date: "2023-05-11",
    pickupDate: "2023-05-11",
    pickupTime: "12:00 PM",
    deliveryDate: "2023-05-12",
    deliveryTime: "11:45 AM",
    total: 68.75,
    discount: 5.00,
    deliveryCharge: 7.50,
    totalQuantity: 14,
    paymentStatus: "paid"
  },
  {
    id: "ORD-020",
    customer: "Daniel Wright",
    service: "dry_clean",
    status: "pickup",
    date: "2023-05-10",
    pickupDate: "2023-05-10",
    pickupTime: "3:00 PM",
    deliveryDate: "2023-05-13",
    deliveryTime: "4:00 PM",
    total: 53.25,
    discount: 0,
    deliveryCharge: 3.50,
    totalQuantity: 6,
    paymentStatus: "pending"
  },
  {
    id: "ORD-021",
    customer: "Nancy Thompson",
    service: "wash_fold",
    status: "new",
    date: "2023-05-10",
    pickupDate: "2023-05-12",
    pickupTime: "11:15 AM",
    deliveryDate: "2023-05-15",
    deliveryTime: "2:00 PM",
    total: 34.50,
    discount: 0,
    deliveryCharge: 3.50,
    totalQuantity: 8,
    paymentStatus: "pending"
  },
  {
    id: "ORD-022",
    customer: "Paul Lewis",
    service: "express",
    status: "processing",
    date: "2023-05-09",
    pickupDate: "2023-05-09",
    pickupTime: "10:30 AM",
    deliveryDate: "2023-05-10",
    deliveryTime: "9:30 AM",
    total: 64.25,
    discount: 0,
    deliveryCharge: 5.00,
    totalQuantity: 12,
    paymentStatus: "paid"
  },
  {
    id: "ORD-023",
    customer: "Helen Walker",
    service: "dry_clean",
    status: "completed",
    date: "2023-05-09",
    pickupDate: "2023-05-07",
    pickupTime: "2:15 PM",
    deliveryDate: "2023-05-09",
    deliveryTime: "5:30 PM",
    total: 49.75,
    discount: 10.00,
    deliveryCharge: 0,
    totalQuantity: 6,
    paymentStatus: "paid"
  },
  {
    id: "ORD-024",
    customer: "George Hall",
    service: "wash_fold",
    status: "delivered",
    date: "2023-05-08",
    pickupDate: "2023-05-06",
    pickupTime: "9:00 AM",
    deliveryDate: "2023-05-08",
    deliveryTime: "4:15 PM",
    total: 30.99,
    discount: 0,
    deliveryCharge: 3.50,
    totalQuantity: 7,
    paymentStatus: "paid"
  },
  {
    id: "ORD-025",
    customer: "Donna Allen",
    service: "express",
    status: "pickup",
    date: "2023-05-08",
    pickupDate: "2023-05-08",
    pickupTime: "1:45 PM",
    deliveryDate: "2023-05-09",
    deliveryTime: "10:45 AM",
    total: 59.99,
    discount: 5.00,
    deliveryCharge: 7.50,
    totalQuantity: 11,
    paymentStatus: "pending"
  }
];

