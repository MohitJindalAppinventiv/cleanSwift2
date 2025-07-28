import { axiosInstance } from "../axios/axiosInstance";
import API from "../endpoints/endpoint";


{/* Login API */}
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


{/* Forgot Password API */}
// export const forgotPassword = async ({email}:{email:string})=>{
//     try {
//         const res = await axiosInstance.post(`${API.FORGOT()}`,{email},
//     {
//         headers:{
//             "Content-Type":"application/json",
//         },
//     });

//     console.log("response data",res.data);
//     return res.data;
//     } catch (error) {
//         console.log("error in index.ts",error);
//     }
// }


export const forgotPassword = async ({ email }: { email: string }) => {
  try {
    const res = await axiosInstance.post(`${API.RESET_PASSWORD()}`, { email });
    console.log("response data", res.data);
    return res.data;
  } catch (error: any) {
    console.log("Error in forgotPassword API", error);
    throw error?.response?.data || error.message;
  }
};


export const logoutAPI = async ()=>{
    try {
        const res = await axiosInstance.post(
      `${API.LOGOUT()}`,{},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
        console.log(res);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

