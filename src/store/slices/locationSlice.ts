// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { RootState } from "@/store/index";
// import { axiosInstance } from "@/api/axios/axiosInstance";
// import API from "@/api/endpoints/endpoint";
// import { Area } from "@/pages/config/types/area";

// interface StoreLocationState {
//   stores: Area[];
//   isLoading: boolean;
//   isSubmitting: boolean;
//   error: string | null;
//   isSuccess: boolean;
//   total: number;
//   page: number;
//   limit: number;
//   totalPages:number;
// }

// const initialState: StoreLocationState = {
//   stores: [],
//   isLoading: false,
//   isSubmitting: false,
//   error: null,
//   isSuccess: false,
//   total: 0,
//   page: 1,
//   limit: 10,
//   totalPages:1,
// };

// // GET (with pagination support)
// export const getAreas = createAsyncThunk(
//   "store/getAreas",
//   async (
//     { page = 1, limit = 10 }: { page?: number; limit?: number },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await axiosInstance.get(API.GET_AREAS(), {
//         params: { page, limit },
//       });
//       console.log("location response",response);

//       const rawData = response.data;

//       const transformed: Area[] = rawData.areas.map((item: Area) => ({
//         id: item.id,
//         locationName: item.locationName,
//         address: item.address || "N/A",
//         range: item.range,
//         isActive: item.isActive,
//         lat:item.lat,
//         lng:item.lng,
//       }));

//       return {
//         data: transformed,
//         total: rawData.pagination.total,
//         page: rawData.pagination.page,
//         limit: rawData.pagination.limit,
//         totalPages:rawData.pagination.totalPages,
//       };
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to fetch areas"
//       );
//     }
//   }
// );

// // CREATE
// export const createArea = createAsyncThunk(
//   "store/createArea",
//   async (newAreaData: any, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.post(API.ADMIN_CREATE_AREA(), newAreaData);
//       return response.data;
//     } catch (err: any) {
//       return rejectWithValue(err.response?.data?.message || "Failed to create area");
//     }
//   }
// );

// // UPDATE
// export const updateArea = createAsyncThunk(
//   "store/updateArea",
//   async (
//     { id, updatedData }: { id: string; updatedData: any },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await axiosInstance.put(API.UPDATE_AREA(), updatedData, {
//         params: { areaId: id },
//       });
//       return response.data;
//     } catch (err: any) {
//       return rejectWithValue(err.response?.data?.message || "Failed to update area");
//     }
//   }
// );

// // DELETE
// export const deleteArea = createAsyncThunk(
//   "store/deleteArea",
//   async (id: string, { rejectWithValue }) => {
//     try {
//       await axiosInstance.delete(API.DELETE_AREA(), {
//         params: {
//           areaId: id,
//         },
//       });
//       return id;
//     } catch (err: any) {
//       return rejectWithValue(err.response?.data?.message || "Failed to delete area");
//     }
//   }
// );

// // TOGGLE STATUS
// export const toggleAreaStatus = createAsyncThunk(
//   "store/toggleStatus",
//   async (id: string, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.put("/toggleAreaActive", {}, {
//         params: { areaId: id },
//       });
//       return response.data;
//     } catch (err: any) {
//       return rejectWithValue(err.response?.data?.message || "Failed to toggle status");
//     }
//   }
// );

// const storeLocationSlice = createSlice({
//   name: "store",
//   initialState,
//   reducers: {
//     clearStoreStatus: (state) => {
//       state.isSuccess = false;
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     // GET
//     builder.addCase(getAreas.pending, (state) => {
//       state.isLoading = true;
//       state.error = null;
//     });
//     builder.addCase(getAreas.fulfilled, (state, action) => {
//       state.isLoading = false;
//       state.stores = action.payload.data;
//       state.total = action.payload.total;
//       state.page = action.payload.page;
//       state.limit = action.payload.limit;
//       state.totalPages=action.payload.totalPages;
//     });
//     builder.addCase(getAreas.rejected, (state, action) => {
//       state.isLoading = false;
//       state.error = action.payload as string;
//     });

//     // CREATE
//     builder.addCase(createArea.pending, (state) => {
//       state.isSubmitting = true;
//       state.error = null;
//     });
//     builder.addCase(createArea.fulfilled, (state) => {
//       state.isSubmitting = false;
//       state.isSuccess = true;
//     });
//     builder.addCase(createArea.rejected, (state, action) => {
//       state.isSubmitting = false;
//       state.error = action.payload as string;
//     });

//     // UPDATE
//     builder.addCase(updateArea.pending, (state) => {
//       state.isSubmitting = true;
//       state.error = null;
//     });
//     builder.addCase(updateArea.fulfilled, (state) => {
//       state.isSubmitting = false;
//       state.isSuccess = true;
//     });
//     builder.addCase(updateArea.rejected, (state, action) => {
//       state.isSubmitting = false;
//       state.error = action.payload as string;
//     });

//     // DELETE
//     builder.addCase(deleteArea.pending, (state) => {
//       state.isSubmitting = true;
//       state.error = null;
//     });
//     builder.addCase(deleteArea.fulfilled, (state) => {
//       state.isSubmitting = false;
//       state.isSuccess = true;
//     });
//     builder.addCase(deleteArea.rejected, (state, action) => {
//       state.isSubmitting = false;
//       state.error = action.payload as string;
//     });

//     // TOGGLE STATUS
//     builder.addCase(toggleAreaStatus.pending, (state) => {
//       state.isSubmitting = true;
//       state.error = null;
//     });
//     builder.addCase(toggleAreaStatus.fulfilled, (state) => {
//       state.isSubmitting = false;
//       state.isSuccess = true;
//     });
//     builder.addCase(toggleAreaStatus.rejected, (state, action) => {
//       state.isSubmitting = false;
//       state.error = action.payload as string;
//     });
//   },
// });

// // Selectors
// export const selectStores = (state: RootState) => state.location.stores;
// export const selectIsLoading = (state: RootState) => state.location.isLoading;
// export const selectIsSubmitting = (state: RootState) => state.location.isSubmitting;
// export const selectError = (state: RootState) => state.location.error;
// export const selectIsSuccess = (state: RootState) => state.location.isSuccess;
// export const selectTotal = (state: RootState) => state.location.total;
// export const selectPage = (state: RootState) => state.location.page;
// export const selectLimit = (state: RootState) => state.location.limit;
// export const selectTotalPages=(state:RootState)=>state.location.totalPages;
// // Actions
// export const { clearStoreStatus } = storeLocationSlice.actions;

// // Export reducer
// export default storeLocationSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store/index";
import { axiosInstance } from "@/api/axios/axiosInstance";
import API from "@/api/endpoints/endpoint";
import { toast } from "sonner";

// Types based on actual API response structure
interface Coordinates {
  lat: number;
  lng: number;
}

interface ApiAreaResponse {
  id: string;
  locationName: string;
  locationNameLower: string;
  coordinates?: Coordinates;
  address?: string;
  range?: number;
  active?: boolean;
  deleted?: boolean;
}

interface ApiResponse {
  areas: ApiAreaResponse[];
  pagination: {
    hasNext: boolean;
    hasPrevious: boolean;
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };
}

// Client-side Area interface (consistent with your existing interface)
export interface Area {
  id: string;
  locationName: string;
  range: number;
  address: string;
  lat: number | null;
  lng: number | null;
  isActive: boolean;
}

interface StoreLocationState {
  stores: Area[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  isSuccess: boolean;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface PaginationParams {
  page?: number;
  limit?: number;
}

interface UpdateAreaParams {
  id: string;
  updatedData: Partial<Area>;
}

const initialState: StoreLocationState = {
  stores: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
  isSuccess: false,
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
};

// GET (with pagination support)
export const getAreas = createAsyncThunk<
  {
    data: Area[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  },
  PaginationParams,
  { rejectValue: string }
>(
  "store/getAreas",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<ApiResponse>(API.GET_AREAS(), {
        params: { page, limit },
      });
      console.log("location response", response);

      const rawData = response.data;

      const transformed: Area[] = rawData.areas.map(
        (item: ApiAreaResponse) => ({
          id: item.id,
          locationName: item.locationName,
          address: item.address || "N/A",
          range: item.range || 0,
          isActive: item.active !== undefined ? item.active : true,
          lat: item.coordinates?.lat || null,
          lng: item.coordinates?.lng || null,
        })
      );

      return {
        data: transformed,
        total: rawData.pagination.total,
        page: rawData.pagination.page,
        limit: rawData.pagination.limit,
        totalPages: rawData.pagination.totalPages,
      };
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch areas"
      );
    }
  }
);

// CREATE
export const createArea = createAsyncThunk<
  any,
  Partial<Area>,
  { rejectValue: string }
>("store/createArea", async (newAreaData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(
      API.ADMIN_CREATE_AREA(),
      newAreaData
    );
    return response.data;
  } catch (err) {
    const error = err as { response?: { data?: { error?: string } } };
    return rejectWithValue(
      error.response?.data?.error || "Failed to create area"
    );
  }
});

// UPDATE
export const updateArea = createAsyncThunk<
  any,
  UpdateAreaParams,
  { rejectValue: string }
>("store/updateArea", async ({ id, updatedData }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(API.UPDATE_AREA(), updatedData, {
      params: { areaId: id },
    });
    return response.data;
  } catch (err) {
    const error = err as { response?: { data?: { error?: string } } };
      console.log("error in locaion slice",error);
    return rejectWithValue(
      error.response?.data?.error || "Failed to update area"
    );
  }
});

// DELETE
export const deleteArea = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("store/deleteArea", async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(API.DELETE_AREA(), {
      params: {
        areaId: id,
      },
    });
    return id;
  } catch (err) {
    const error = err as { response?: { data?: { error?: string } } };
    return rejectWithValue(
      error.response?.data?.error || "Failed to delete area"
    );
  }
});

// TOGGLE STATUS
export const toggleAreaStatus = createAsyncThunk<
  any,
  string,
  { rejectValue: string }
>("store/toggleStatus", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(
      "/toggleAreaActive",
      {},
      {
        params: { areaId: id },
      }
    );
    return response.data;
  } catch (err) {
    const error = err as { response?: { data?: { error?: string } } };
    return rejectWithValue(
      error.response?.data?.error || "Failed to toggle status"
    );
  }
});

const storeLocationSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    clearStoreStatus: (state) => {
      state.isSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // GET
    builder.addCase(getAreas.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getAreas.fulfilled, (state, action) => {
      state.isLoading = false;
      state.stores = action.payload.data;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.totalPages = action.payload.totalPages;
    });
    builder.addCase(getAreas.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // CREATE
    builder.addCase(createArea.pending, (state) => {
      state.isSubmitting = true;
      state.error = null;
    });
    builder.addCase(createArea.fulfilled, (state) => {
      state.isSubmitting = false;
      state.isSuccess = true;
    });
    builder.addCase(createArea.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = action.payload as string;
    });

    // UPDATE
    builder.addCase(updateArea.pending, (state) => {
      state.isSubmitting = true;
      state.error = null;
    });
    builder.addCase(updateArea.fulfilled, (state) => {
      state.isSubmitting = false;
      state.isSuccess = true;
    });
    builder.addCase(updateArea.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = action.payload as string;
    });

    // DELETE
    builder.addCase(deleteArea.pending, (state) => {
      state.isSubmitting = true;
      state.error = null;
    });
    builder.addCase(deleteArea.fulfilled, (state) => {
      state.isSubmitting = false;
      state.isSuccess = true;
    });
    builder.addCase(deleteArea.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = action.payload as string;
    });

    // TOGGLE STATUS
    builder.addCase(toggleAreaStatus.pending, (state) => {
      state.isSubmitting = true;
      state.error = null;
    });
    builder.addCase(toggleAreaStatus.fulfilled, (state) => {
      state.isSubmitting = false;
      state.isSuccess = true;
    });
    builder.addCase(toggleAreaStatus.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = action.payload as string;
    });
  },
});

// Selectors
export const selectStores = (state: RootState): Area[] => state.location.stores;
export const selectIsLoading = (state: RootState): boolean =>
  state.location.isLoading;
export const selectIsSubmitting = (state: RootState): boolean =>
  state.location.isSubmitting;
export const selectError = (state: RootState): string | null =>
  state.location.error;
export const selectIsSuccess = (state: RootState): boolean =>
  state.location.isSuccess;
export const selectTotal = (state: RootState): number => state.location.total;
export const selectPage = (state: RootState): number => state.location.page;
export const selectLimit = (state: RootState): number => state.location.limit;
export const selectTotalPages = (state: RootState): number =>
  state.location.totalPages;

// Actions
export const { clearStoreStatus } = storeLocationSlice.actions;

// Export reducer
export default storeLocationSlice.reducer;
