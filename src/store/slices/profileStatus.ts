// src/store/slices/profileSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/api/axios/axiosInstance";
import { RootState } from "@/store";

export interface ProfileConfig {
  banner?: { isConfigured: boolean };
  area?: { isConfigured: boolean };
  service?: { isConfigured: boolean };
  [key: string]: { isConfigured: boolean } | undefined;
}

export interface ProfileStatusData {
  isComplete: boolean;
  configurations: ProfileConfig;
}

interface ProfileState {
  data: ProfileStatusData | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  data: null,
  isLoading: false,
  error: null,
};

export const getProfileCompletionStatus = createAsyncThunk<
  ProfileStatusData,
  void,
  { rejectValue: string }
>("profile/getProfileCompletionStatus", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get("/getProfileCompletionStatus");
    console.log(res);
    if (res.data?.success) {
      return res.data.data;
    } else {
      return rejectWithValue("Failed to fetch profile status");
    }
  } catch (err) {
        const error = err as { response?: { data?: { message?: string } } };

    return rejectWithValue(
      error?.response?.data?.message || "Something went wrong"
    );
  }
});

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    resetProfileStatus: (state) => {
      state.data = null;
      state.error = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfileCompletionStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProfileCompletionStatus.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(getProfileCompletionStatus.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch profile status";
        state.isLoading = false;
      });
  },
});

export const { resetProfileStatus } = profileSlice.actions;

export const selectProfile = (state: RootState) => state.profileStatus;

export default profileSlice.reducer;
