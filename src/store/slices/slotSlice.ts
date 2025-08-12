import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { axiosInstance } from "@/api/axios/axiosInstance";

export interface Slot {
  id: string;
  type: "pickup" | "delivery";
  date: string;
  startTime: string;
  endTime: string;
  maxOrders: number;
  currentOrders: number;
  active: boolean;
}

export interface DateRange {
  startDate?: Date;
  endDate?: Date;
}

export interface FetchSlotsParams {
  type?: string;
  dateRange: DateRange;
}

export interface SlotsState {
  slotsByDate: Record<string, Slot[]>;
  loading: boolean;
  error: string | null;
  lastFetchParams: FetchSlotsParams | null;
}

const formatDate = (date: Date, formatStr: string) =>
  formatStr === "yyyy-MM-dd"
    ? date.toISOString().split("T")[0]
    : date.toLocaleDateString();

const initialState: SlotsState = {
  slotsByDate: {},
  loading: false,
  error: null,
  lastFetchParams: null,
};

export const addSlot = createAsyncThunk(
  "slots/addSlot",
  async (
    {
      type,
      weekDay,
      propagateWeeks,
      timeRanges,
    }: {
      type: "pickup" | "delivery";
      weekDay: number;
      propagateWeeks: number;
      timeRanges: { startTime: string; endTime: string; maxOrders: number }[];
    },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      await axiosInstance.post("/adminAddSlots", {
        type,
        weekDay,
        propagateWeeks,
        timeRanges,
      });

      // Refetch slots if we have previous params
      const state = getState() as { slots: SlotsState };
      if (state.slots.lastFetchParams) {
        dispatch(fetchSlots(state.slots.lastFetchParams));
      }

      return true;
    } catch (error: any) {
      console.error("Error adding slots", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create slots"
      );
    }
  }
);

// Async thunks
export const fetchSlots = createAsyncThunk(
  "slots/fetchSlots",
  async ({ type, dateRange }: FetchSlotsParams, { rejectWithValue }) => {
    try {
      const params: Record<string, any> = {};

      if (dateRange.startDate) {
        params.startDate = formatDate(dateRange.startDate, "yyyy-MM-dd");
      }
      if (dateRange.endDate) {
        params.endDate = formatDate(dateRange.endDate, "yyyy-MM-dd");
      }
      if (type && type !== "all") {
        params.type = type;
      }

      const response = await axiosInstance.get("/adminListSlots", { params });
      return {
        slotsByDate: response.data.slotsByDate,
        fetchParams: { type, dateRange },
      };
    } catch (error: any) {
      console.error("Error fetching slots", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch slots"
      );
    }
  }
);

export const deleteSlot = createAsyncThunk(
  "slots/deleteSlot",
  async (slotId: string, { rejectWithValue, getState, dispatch }) => {
    try {
      await axiosInstance.delete("/adminDeleteSlot", {
        params: { slotId },
      });

      // Refetch slots after successful deletion
      const state = getState() as { slots: SlotsState };
      if (state.slots.lastFetchParams) {
        dispatch(fetchSlots(state.slots.lastFetchParams));
      }

      return slotId;
    } catch (error: any) {
      console.error("Error deleting slot", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete slot"
      );
    }
  }
);

export const toggleSlot = createAsyncThunk(
  "slots/toggleSlot",
  async (slotId: string, { rejectWithValue, getState, dispatch }) => {
    try {
      await axiosInstance.post(
        "/adminToggleSlot",
        {},
        {
          params: { slotId },
        }
      );

      // Refetch slots after successful toggle
      const state = getState() as { slots: SlotsState };
      if (state.slots.lastFetchParams) {
        dispatch(fetchSlots(state.slots.lastFetchParams));
      }

      return slotId;
    } catch (error: any) {
      console.error("Error toggling slot", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle slot"
      );
    }
  }
);

export const updateSlot = createAsyncThunk(
  "slots/updateSlot",
  async (
    { slotId, updateData }: { slotId: string; updateData: Partial<Slot> },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      await axiosInstance.put("/adminUpdateSlot", updateData, {
        params: { slotId },
      });

      const state = getState() as { slots: SlotsState };
      if (state.slots.lastFetchParams) {
        dispatch(fetchSlots(state.slots.lastFetchParams));
      }

      return { slotId, updateData };
    } catch (error: any) {
      console.error("Error updating slot", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update slot"
      );
    }
  }
);

// Slice
const slotsSlice = createSlice({
  name: "slots",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSlots: (state) => {
      state.slotsByDate = {};
      state.lastFetchParams = null;
    },
    optimisticToggleSlot: (state, action: PayloadAction<string>) => {
      const slotId = action.payload;
      Object.keys(state.slotsByDate).forEach((date) => {
        const slotIndex = state.slotsByDate[date].findIndex(
          (slot) => slot.id === slotId
        );
        if (slotIndex !== -1) {
          state.slotsByDate[date][slotIndex].active =
            !state.slotsByDate[date][slotIndex].active;
        }
      });
    },
    // Optimistic update for slot deletion (optional)
    optimisticDeleteSlot: (state, action: PayloadAction<string>) => {
      const slotId = action.payload;
      Object.keys(state.slotsByDate).forEach((date) => {
        state.slotsByDate[date] = state.slotsByDate[date].filter(
          (slot) => slot.id !== slotId
        );
        // Remove date key if no slots remaining
        if (state.slotsByDate[date].length === 0) {
          delete state.slotsByDate[date];
        }
      });
    },
  },
  extraReducers: (builder) => {
    // Fetch slots
    builder
      .addCase(fetchSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSlots.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.slotsByDate = action.payload.slotsByDate;
        state.lastFetchParams = action.payload.fetchParams;
      })
      .addCase(fetchSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete slot
    builder
      .addCase(deleteSlot.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteSlot.fulfilled, (state) => {
        state.error = null;
        // Note: slots are refetched in the thunk, so no need to update state here
      })
      .addCase(deleteSlot.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Toggle slot
    builder
      .addCase(toggleSlot.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleSlot.fulfilled, (state) => {
        state.error = null;
        // Note: slots are refetched in the thunk, so no need to update state here
      })
      .addCase(toggleSlot.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Update slot
    builder
      .addCase(updateSlot.pending, (state) => {
        state.error = null;
      })
      .addCase(updateSlot.fulfilled, (state) => {
        state.error = null;
        // Note: slots are refetched in the thunk, so no need to update state here
      })
      .addCase(updateSlot.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    builder
      .addCase(addSlot.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(addSlot.fulfilled, (state) => {
        state.error = null;
        state.loading = false;
      })
      .addCase(addSlot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Actions
export const {
  clearError,
  clearSlots,
  optimisticToggleSlot,
  optimisticDeleteSlot,
} = slotsSlice.actions;

// Selectors
export const selectSlots = (state: { slots: SlotsState }) =>
  state.slots.slotsByDate;
export const selectSlotsLoading = (state: { slots: SlotsState }) =>
  state.slots.loading;
export const selectSlotsError = (state: { slots: SlotsState }) =>
  state.slots.error;
export const selectLastFetchParams = (state: { slots: SlotsState }) =>
  state.slots.lastFetchParams;

// Additional selectors
export const selectSlotsByType = (
  state: { slots: SlotsState },
  type: "pickup" | "delivery"
) => {
  const slotsByDate: Record<string, Slot[]> = {};
  Object.entries(state.slots.slotsByDate).forEach(([date, slots]) => {
    const filteredSlots = slots.filter((slot) => slot.type === type);
    if (filteredSlots.length > 0) {
      slotsByDate[date] = filteredSlots;
    }
  });
  return slotsByDate;
};

export const selectTotalSlots = (state: { slots: SlotsState }) => {
  return Object.values(state.slots.slotsByDate).reduce(
    (total, slots) => total + slots.length,
    0
  );
};

export const selectActiveSlots = (state: { slots: SlotsState }) => {
  const activeSlotsByDate: Record<string, Slot[]> = {};
  Object.entries(state.slots.slotsByDate).forEach(([date, slots]) => {
    const activeSlots = slots.filter((slot) => slot.active);
    if (activeSlots.length > 0) {
      activeSlotsByDate[date] = activeSlots;
    }
  });
  return activeSlotsByDate;
};

export const selectSlotById = (
  state: { slots: SlotsState },
  slotId: string
) => {
  for (const slots of Object.values(state.slots.slotsByDate)) {
    const slot = slots.find((s) => s.id === slotId);
    if (slot) return slot;
  }
  return null;
};

// Export reducer
export default slotsSlice.reducer;
