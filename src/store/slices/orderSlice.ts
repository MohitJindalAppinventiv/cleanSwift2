// // import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// // import { axiosInstance } from '@/api/axios/axiosInstance';
// // import { Order, Pagination } from '../../components/dashboard/orders/types';

// // interface OrdersState {
// //   orders: Order[];
// //   pagination: Pagination | null;
// //   isLoading: boolean;
// //   error: string | null;
// // }

// // interface FetchOrdersParams {
// //   page: number;
// //   limit: number;
// //   status?: string;
// //   search?: string;
// // }

// // interface ApiResponse {
// //   data: {
// //     orders: Order[];
// //     pagination: Pagination;
// //   };
// // }

// // const initialState: OrdersState = {
// //   orders: [],
// //   pagination: null,
// //   isLoading: false,
// //   error: null,
// // };

// // // Async thunk for fetching orders
// // export const fetchOrders = createAsyncThunk<
// //   ApiResponse,
// //   FetchOrdersParams,
// //   { rejectValue: string }
// // >(
// //   'orders/fetchOrders',
// //   async ({ page, limit, status, search }, { rejectWithValue }) => {
// //     try {
// //       const response = await axiosInstance.get('/getAllOrders', {
// //         params: {
// //           page,
// //           limit,
// //           status: status !== 'all' ? status : undefined,
// //           search: search?.trim() !== '' ? search : undefined,
// //         },
// //       });

// //       return response.data;
// //     } catch (error) {
// //       return rejectWithValue('Failed to fetch orders. Please try again later.');
// //     }
// //   }
// // );

// // const orderSlice = createSlice({
// //   name: 'orders',
// //   initialState,
// //   reducers: {
// //     resetOrdersState: (state) => {
// //       state.orders = [];
// //       state.pagination = null;
// //       state.isLoading = false;
// //       state.error = null;
// //     },
// //   },
// //   extraReducers: (builder) => {
// //     builder
// //       .addCase(fetchOrders.pending, (state) => {
// //         state.isLoading = true;
// //         state.error = null;
// //       })
// //       .addCase(fetchOrders.fulfilled, (state, action) => {
// //         state.isLoading = false;
// //         state.orders = action.payload.data.orders;
// //         state.pagination = action.payload.data.pagination;
// //       })
// //       .addCase(fetchOrders.rejected, (state, action) => {
// //         state.isLoading = false;
// //         state.error = action.payload || 'An unexpected error occurred';
// //       });
// //   },
// // });

// // export const { resetOrdersState } = orderSlice.actions;
// // export default orderSlice.reducer;

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { axiosInstance } from "@/api/axios/axiosInstance";
// import { Order, Pagination } from "../../components/dashboard/orders/types";

// interface OrdersState {
//   orders: Order[];
//   pagination: Pagination | null;
//   selectedOrder: Order | null;
//   isLoading: boolean;
//   error: string | null;
// }

// interface FetchOrdersParams {
//   page?: number;
//   limit?: number;
//   status?: string;
//   search?: string;
//   startDate?: string;
//   endDate?: string;
// }

// interface ApiResponse {
//   data: {
//     orders: Order[];
//     pagination: Pagination;
//   };
// }

// const initialState: OrdersState = {
//   orders: [],
//   pagination: null,
//   selectedOrder: null,
//   isLoading: false,
//   error: null,
// };

// // Async thunk for fetching orders
// export const fetchOrders = createAsyncThunk<
//   any,
//   FetchOrdersParams,
//   { rejectValue: string }
// >(
//   "orders/fetchOrders",
//   async (
//     { page, limit, status, search, startDate, endDate },
//     { rejectWithValue }
//   ) => {
//     try {
//       const params: Record<string, any> = {
//         page,
//         limit,
//       };

//       // Only add parameters if they have meaningful values
//       if (status && status !== "all") {
//         params.status = status;
//       }

//       if (search && search.trim() !== "") {
//         params.search = search.trim();
//       }

//       if (startDate) {
//         params.startDate = startDate; // format: YYYY-MM-DD
//       }

//       if (endDate) {
//         params.endDate = endDate; // format: YYYY-MM-DD
//       }

//       const response = await axiosInstance.get("/getAllOrders", {
//         params,
//       });

//       return response.data;
//     } catch (error) {
//       return rejectWithValue("Failed to fetch orders. Please try again later.");
//     }
//   }
// );

// // Async thunk for fetching order by ID (Admin view)
// export const getOrderByIdAdmin = createAsyncThunk<
//   Order,
//   string,
//   { rejectValue: string }
// >("orders/getOrderByIdAdmin", async (orderId, { rejectWithValue }) => {
//   try {
//     if (!orderId) {
//       return rejectWithValue("Order ID is required");
//     }

//     const response = await axiosInstance.get("/getOrderByIdAdmin", {
//       params: { orderId },
//     });

//     if (response.data.success) {
//       return response.data.data as Order;
//     } else {
//       return rejectWithValue(response.data.message || "Failed to fetch order");
//     }
//   } catch (error: any) {
//     return rejectWithValue(
//       error?.response?.data?.message || "Failed to fetch order details."
//     );
//   }
// });

// // Async thunk for updating order status
// export const updateOrderStatus = createAsyncThunk<
//   { orderId: string; status: string },
//   { orderId: string; status: string },
//   { rejectValue: string }
// >(
//   "orders/updateOrderStatus",
//   async ({ orderId, status }, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.post("/updateOrderStatus", {
//         orderId,
//         status,
//       });

//       if (response.data.success) {
//         return { orderId, status };
//       } else {
//         return rejectWithValue(
//           response.data.message || "Failed to update status"
//         );
//       }
//     } catch (error: any) {
//       return rejectWithValue(
//         error?.response?.data?.message || "Failed to update status"
//       );
//     }
//   }
// );

// const orderSlice = createSlice({
//   name: "orders",
//   initialState,
//   reducers: {
//     resetOrdersState: (state) => {
//       state.orders = [];
//       state.pagination = null;
//       state.selectedOrder = null;
//       state.isLoading = false;
//       state.error = null;
//     },
//     clearSelectedOrder: (state) => {
//       state.selectedOrder = null;
//     },
//   },
//   extraReducers: (builder) => {
//     // fetchOrders
//     builder
//       .addCase(fetchOrders.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(fetchOrders.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.orders = action.payload.data.orders;
//         state.pagination = action.payload.data.pagination;
//       })
//       .addCase(fetchOrders.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload || "An unexpected error occurred 1";
//       });

//     // getOrderByIdAdmin
//     builder
//       .addCase(getOrderByIdAdmin.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//         state.selectedOrder = null;
//       })
//       .addCase(getOrderByIdAdmin.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.selectedOrder = action.payload;
//       })
//       .addCase(getOrderByIdAdmin.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload || "An unexpected error occurred";
//         state.selectedOrder = null;
//       });

//     // updateOrderStatus
//     builder
//       .addCase(updateOrderStatus.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(updateOrderStatus.fulfilled, (state, action) => {
//         state.isLoading = false;

//         // Update order in state.orders
//         const index = state.orders.findIndex(
//           (order) => order.id === action.payload.orderId
//         );
//         if (index !== -1) {
//           state.orders[index].status = action.payload.status;
//         }

//         // Also update selectedOrder if it matches
//         if (
//           state.selectedOrder &&
//           state.selectedOrder.id === action.payload.orderId
//         ) {
//           state.selectedOrder.status = action.payload.status;
//         }
//       })
//       .addCase(updateOrderStatus.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload || "Failed to update status";
//       });
//   },
// });

// export const { resetOrdersState, clearSelectedOrder } = orderSlice.actions;
// export default orderSlice.reducer;



import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/api/axios/axiosInstance";
import { Order, Pagination } from "../../components/dashboard/orders/types";
import { OrderStatus } from "@/components/dashboard/orders/OrderStatusBadge";

interface Analytics {
  totalProcessingOrder: number;
  totalDeliveredOrder: number;
  totalCancelledOrder: number;
  totalOrders: number;
  totalUsers: number;
}

interface OrdersState {
  orders: Order[];
  pagination: Pagination | null;
  analytics: Analytics | null;
  selectedOrder: Order | null;
  isLoading: boolean;
  error: string | null;
}

interface FetchOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  paymentMethod?: string;
  includeAnalytics?: boolean;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    orders: Order[];
    pagination: Pagination;
    analytics?: Analytics;
  };
  cached?: boolean;
}

const initialState: OrdersState = {
  orders: [],
  pagination: null,
  analytics: null,
  selectedOrder: null,
  isLoading: false,
  error: null,
};

// Async thunk for fetching orders
export const fetchOrders = createAsyncThunk<
  ApiResponse,
  FetchOrdersParams,
  { rejectValue: string }
>(
  "orders/fetchOrders",
  async (
    { 
      page = 1, 
      limit = 10, 
      status, 
      search, 
      startDate, 
      endDate, 
      paymentMethod,
      includeAnalytics = true 
    },
    { rejectWithValue }
  ) => {
    try {
      const params: Record<string, any> = {
        page,
        limit,
        includeAnalytics,
      };

      // Only add parameters if they have meaningful values
      if (status && status !== "all") {
        params.status = status;
      }

      if (search && search.trim() !== "") {
        params.search = search.trim();
      }

      if (startDate) {
        params.startDate = startDate; // format: YYYY-MM-DD
      }

      if (endDate) {
        params.endDate = endDate; // format: YYYY-MM-DD
      }

      if (paymentMethod && paymentMethod !== "all") {
        params.paymentMethod = paymentMethod;
      }

      const response = await axiosInstance.get("/getAllOrders", {
        params,
      });

      console.log("order response",response);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch orders. Please try again later."
      );
    }
  }
);

// Async thunk for fetching order by ID (Admin view)
export const getOrderByIdAdmin = createAsyncThunk<
  Order,
  string,
  { rejectValue: string }
>("orders/getOrderByIdAdmin", async (orderId, { rejectWithValue }) => {
  try {
    if (!orderId) {
      return rejectWithValue("Order ID is required");
    }

    const response = await axiosInstance.get("/getOrderByIdAdmin", {
      params: { orderId },
    });

    if (response.data.success) {
      return response.data.data as Order;
    } else {
      return rejectWithValue(response.data.message || "Failed to fetch order");
    }
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || "Failed to fetch order details."
    );
  }
});

// Async thunk for updating order status
// export const updateOrderStatus = createAsyncThunk<
//   { orderId: string; status: string },
//   { orderId: string; status: string },
//   { rejectValue: string }
// >(
//   "orders/updateOrderStatus",
//   async ({ orderId, status }, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.post("/updateOrderStatus", {
//         orderId,
//         status,
//       });

//       if (response.data.success) {
//         return { orderId, status };
//       } else {
//         return rejectWithValue(
//           response.data.message || "Failed to update status"
//         );
//       }
//     } catch (error: any) {
//       return rejectWithValue(
//         error?.response?.data?.message || "Failed to update status"
//       );
//     }
//   }
// );

export const updateOrderStatus = createAsyncThunk<
  { orderId: string; status: OrderStatus },  // ✅ use OrderStatus here
  { orderId: string; status: OrderStatus },  // ✅ and here
  { rejectValue: string }
>(
  "orders/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/updateOrderStatus", {
        orderId,
        status,
      });

      if (response.data.success) {
        return { orderId, status };
      } else {
        return rejectWithValue(
          response.data.message || "Failed to update status"
        );
      }
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to update status"
      );
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    resetOrdersState: (state) => {
      state.orders = [];
      state.pagination = null;
      state.analytics = null;
      state.selectedOrder = null;
      state.isLoading = false;
      state.error = null;
    },
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchOrders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.data.orders || [];
        state.pagination = action.payload.data.pagination || null;
        state.analytics = action.payload.data.analytics || null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "An unexpected error occurred";
        state.orders = [];
        state.pagination = null;
      });

    // getOrderByIdAdmin
    builder
      .addCase(getOrderByIdAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.selectedOrder = null;
      })
      .addCase(getOrderByIdAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(getOrderByIdAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "An unexpected error occurred";
        state.selectedOrder = null;
      });

    // updateOrderStatus
    builder
      .addCase(updateOrderStatus.pending, (state) => {
        // Don't set loading for status updates to avoid blocking UI
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        // Update order in state.orders
        const index = state.orders.findIndex(
          (order) => order.id === action.payload.orderId
        );
        if (index !== -1) {
          state.orders[index].status = action.payload.status;
        }

        // Also update selectedOrder if it matches
        if (
          state.selectedOrder &&
          state.selectedOrder.id === action.payload.orderId
        ) {
          state.selectedOrder.status = action.payload.status;
        }

        // Update analytics based on status change
        if (state.analytics) {
          const { status } = action.payload;
          // Note: This is a simplified update - you might need to fetch fresh analytics
          // or implement more sophisticated client-side tracking
          if (status === 'processing') {
            state.analytics.totalProcessingOrder += 1;
          } else if (status === 'delivered') {
            state.analytics.totalDeliveredOrder += 1;
          } else if (status === 'cancelled') {
            state.analytics.totalCancelledOrder += 1;
          }
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.payload || "Failed to update status";
      });
  },
});

export const { resetOrdersState, clearSelectedOrder, clearError } = orderSlice.actions;
export default orderSlice.reducer;