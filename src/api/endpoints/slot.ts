// File: api/endpoints/slot.ts
import { axiosInstance } from "@/api/axios/axiosInstance";

const API = {
  listSlots: async (params: {
    type?: "pickup" | "delivery";
    startDate?: string;
    endDate?: string;
  }) => {
    return axiosInstance.get("/adminListSlots", { params });
  },

  addSlots: async (payload: {
    type: "pickup" | "delivery";
    weekDay: number;
    propagateWeeks: number;
    timeRanges: { startTime: string; endTime: string; maxOrders: number }[];
  }) => {
    return axiosInstance.post("/adminAddSlots", payload);
  },

  updateSlot: async (payload: {
    slotId: string;
    startTime?: string;
    endTime?: string;
    maxOrders?: number;
    active?: boolean;
  }) => {
    return axiosInstance.post("/adminUpdateSlot", payload);
  },

  inactivateSlot: async (slotId: string) => {
    return axiosInstance.post("/adminInactivateSlot", { slotId });
  },

  deleteSlot: async (slotId: string) => {
    return axiosInstance.post("/adminDeleteSlot", { slotId });
  },
};

export default API;
