// src/redux/slices/couponSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { axiosInstance } from "@/api/axios/axiosInstance";
import API from "@/api/endpoints/endpoint";
import { toast } from "sonner";

interface FirestoreTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

export interface Coupon {
  id: string;
  couponCode: string;
  couponName: string;
  maxDiscount: number;
  minValue: number;
  validFrom: FirestoreTimestamp;
  validTill: FirestoreTimestamp;
  discountPercentage: number;
  isActive: boolean;
  currentUsage?: number;
}

interface CouponState {
  coupons: Coupon[];
  loading: boolean;
  error: string | null;
  deletingId: string | null;
}

const initialState: CouponState = {
  coupons: [],
  loading: false,
  error: null,
  deletingId: null,
};

export const fetchCoupons = createAsyncThunk(
  "coupons/fetchCoupons",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get(API.GET_ALL_COUPONS());
      return response.data.data as Coupon[];
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };

      toast.error("Failed to load coupons");
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteCoupon = createAsyncThunk(
  "coupons/deleteCoupon",
  async (couponId: string, thunkAPI) => {
    try {
      await axiosInstance.delete(API.DELETE_COUPON(), {
        params: { couponId },
      });
      toast.success("Coupon deleted");
      return couponId;
    } catch (err) {
      toast.error("Failed to delete coupon");
      const error = err as { response?: { data?: { message?: string } } };

      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

const couponSlice = createSlice({
  name: "coupons",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCoupons.fulfilled,
        (state, action: PayloadAction<Coupon[]>) => {
          state.loading = false;
          state.coupons = action.payload;
        }
      )
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteCoupon.pending, (state, action) => {
        state.deletingId = action.meta.arg;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.deletingId = null;
        state.coupons = state.coupons.filter(
          (coupon) => coupon.id !== action.payload
        );
      })
      .addCase(deleteCoupon.rejected, (state) => {
        state.deletingId = null;
      });
  },
});

export default couponSlice.reducer;
