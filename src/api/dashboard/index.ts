import { axiosInstance } from "@/api/axios/axiosInstance";
import { DashboardStatsResponse } from "@/types/dashboard";

export const dashboardApi = {
  getDashboardStats: async (): Promise<DashboardStatsResponse> => {
    try {
      const response = await axiosInstance.get('/getDashboardStats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
};