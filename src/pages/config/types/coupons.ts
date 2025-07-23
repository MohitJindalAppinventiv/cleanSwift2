
export interface Coupon {
  id: string;
  code: string;
  discountPercentage?: number;
  discountAmount?: number;
  validFrom: Date;
  validUntil: Date;
  minOrderValue?: number;
  maxUsage?: number;
  currentUsage: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CouponFormData = Omit<Coupon, "id" | "currentUsage" | "createdAt" | "updatedAt"> & {
  id?: string;
};
