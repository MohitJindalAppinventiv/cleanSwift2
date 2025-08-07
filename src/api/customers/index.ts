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
    const res = await axiosInstance.get("/getAllUser", 
        {
      params: { page, limit, search, status },
   }
);
    console.log(res);

    return res.data.data;
  } catch (error: any) {
    console.error("Error fetching users:", error);

    // Optional: You can throw a specific error to handle it in your UI
    throw new Error(
      error?.response?.data?.message ||
      "Failed to fetch users. Please try again later."
    );
  }
};
