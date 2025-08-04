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
// }

// const initialState: StoreLocationState = {
//   stores: [],
//   isLoading: false,
//   isSubmitting: false,
//   error: null,
//   isSuccess: false,
// };

// // GET
// export const getAreas = createAsyncThunk("store/getAreas", async (_, { rejectWithValue }) => {
//   try {
//     const response = await axiosInstance.get(API.GET_AREAS());
//     const rawData = response.data;
//     console.log("response in get areas",response);
//     console.log(rawData);

//     const transformed: Area[] = rawData.areas.map((item: any) => ({
//       id: item.id,
//       locationName: item.locationName,
//       address: item.address || "N/A",
//       range: item.range,
//       isActive: item.active,
//     }));

//     return transformed;
//   } catch (err: any) {
//     return rejectWithValue(err.response?.data?.message || "Failed to fetch areas");
//   }
// });

// // CREATE
// export const createArea = createAsyncThunk("store/createArea", async (newAreaData: any, { rejectWithValue }) => {
//   try {
//     const response = await axiosInstance.post(API.ADMIN_CREATE_AREA(), newAreaData);
//     return response.data;
//   } catch (err: any) {
//     return rejectWithValue(err.response?.data?.message || "Failed to create area");
//   }
// });

// // UPDATE
// export const updateArea = createAsyncThunk("store/updateArea", async ({ id, updatedData }: { id: string; updatedData: any }, { rejectWithValue }) => {
//   try {
//     const response = await axiosInstance.put(API.UPDATE_AREA(), updatedData, {
//           params: { areaId: id },
//         });
//         console.log(response);
//     return response.data;
//   } catch (err: any) {
//     return rejectWithValue(err.response?.data?.message || "Failed to update area");
//   }
// });

// // DELETE
// export const deleteArea = createAsyncThunk("store/deleteArea", async (id: string, { rejectWithValue }) => {
//   try {
//     await axiosInstance.delete(API.DELETE_AREA(),{
//         params:{
//             areaId:id
//         }
//     });
//     return id;
//   } catch (err: any) {
//     return rejectWithValue(err.response?.data?.message || "Failed to delete area");
//   }
// });

// // TOGGLE STATUS
// export const toggleAreaStatus = createAsyncThunk("store/toggleStatus", async (id: string, { rejectWithValue }) => {
//   try {
//     const response = await axiosInstance.put("/toggleAreaActive", {}, {
//         params: { areaId: id },
//       });
//     return response.data;
//   } catch (err: any) {
//     return rejectWithValue(err.response?.data?.message || "Failed to toggle status");
//   }
// });

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
//       state.stores = action.payload;
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

// // Actions
// export const { clearStoreStatus } = storeLocationSlice.actions;

// // Export reducer
// export default storeLocationSlice.reducer;



import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store/index";
import { axiosInstance } from "@/api/axios/axiosInstance";
import API from "@/api/endpoints/endpoint";
import { Area } from "@/pages/config/types/area";

interface StoreLocationState {
  stores: Area[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  isSuccess: boolean;
  total: number;
  page: number;
  limit: number;
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
};

// GET (with pagination support)
export const getAreas = createAsyncThunk(
  "store/getAreas",
  async (
    { page = 1, limit = 10 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(API.GET_AREAS(), {
        params: { page, limit },
      });

      const rawData = response.data;

      const transformed: Area[] = rawData.areas.map((item: any) => ({
        id: item.id,
        locationName: item.locationName,
        address: item.address || "N/A",
        range: item.range,
        isActive: item.active,
      }));

      return {
        data: transformed,
        total: rawData.total,
        page: rawData.page,
        limit: rawData.limit,
      };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch areas"
      );
    }
  }
);

// CREATE
export const createArea = createAsyncThunk(
  "store/createArea",
  async (newAreaData: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API.ADMIN_CREATE_AREA(), newAreaData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to create area");
    }
  }
);

// UPDATE
export const updateArea = createAsyncThunk(
  "store/updateArea",
  async (
    { id, updatedData }: { id: string; updatedData: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(API.UPDATE_AREA(), updatedData, {
        params: { areaId: id },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to update area");
    }
  }
);

// DELETE
export const deleteArea = createAsyncThunk(
  "store/deleteArea",
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(API.DELETE_AREA(), {
        params: {
          areaId: id,
        },
      });
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete area");
    }
  }
);

// TOGGLE STATUS
export const toggleAreaStatus = createAsyncThunk(
  "store/toggleStatus",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/toggleAreaActive", {}, {
        params: { areaId: id },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to toggle status");
    }
  }
);

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
export const selectStores = (state: RootState) => state.location.stores;
export const selectIsLoading = (state: RootState) => state.location.isLoading;
export const selectIsSubmitting = (state: RootState) => state.location.isSubmitting;
export const selectError = (state: RootState) => state.location.error;
export const selectIsSuccess = (state: RootState) => state.location.isSuccess;
export const selectTotal = (state: RootState) => state.location.total;
export const selectPage = (state: RootState) => state.location.page;
export const selectLimit = (state: RootState) => state.location.limit;

// Actions
export const { clearStoreStatus } = storeLocationSlice.actions;

// Export reducer
export default storeLocationSlice.reducer;
