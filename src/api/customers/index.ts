// import { axiosInstance } from "../axios/axiosInstance";

// export const getAllUsers = async ({
//   page = 1,
//   limit = 20,
//   search = "",
//   status = "all",
// }: {
//   page?: number;
//   limit?: number;
//   search?: string;
//   status?: "all" | "active" | "inactive";
// }) => {
//   const res = await axiosInstance.get("/getAllUser",
//     {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("firebase-token")}`,
//       "x-session-token": localStorage.getItem("session-token"),
//     },
//     params: { page, limit, search, status },
//  }
// );

//   return res.data.data;
// };

import { axiosInstance } from "../axios/axiosInstance";
import { isAxiosError } from "axios";
export const getAllUsers = async ({
  page = 1,
  limit = 20,
  search = "",
  status = "all",
}: {
  page?: number;
  limit?: number;
  search?: string;
  status?: "all" | "active" | "inactive";
}) => {
  try {
    const res = await axiosInstance.get("/getAllUser", {
      params: { page, limit, search, status },
    });
    // console.log(res);

    return res.data.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }

    throw new Error("Failed to fetch users. Please try again later.");
  }
};
