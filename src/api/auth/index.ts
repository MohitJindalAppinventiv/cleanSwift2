import { axiosInstance } from "../axios/axiosInstance";
import API from "../endpoints/endpoint";

export const adminLogin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const res = await axiosInstance.post(
      `${API.LOGIN()}`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(res);
    return res.data;
  } catch (error: any) {
    console.log(error);
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Login failed. Please try again.");
  }
};


