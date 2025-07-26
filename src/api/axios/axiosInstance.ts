import axios from 'axios';


const apiUrl=import.meta.env.VITE_API_URL;

export const axiosInstance=axios.create({
    baseURL:`${apiUrl}`
});


axiosInstance.interceptors.request.use(
    (config)=>{
        const authToken = localStorage.getItem("authToken");
        const sessionToken = localStorage.getItem("sessionToken")

        if(authToken){
            config.headers.Authorization = `Bearer ${authToken}`;
            config.headers[`X-Session-Token`]= `${sessionToken}`;
        }

        return config;
    },
    (err)=>Promise.reject(err)
)

// axiosInstance.interceptors.response.use(
//     response=>response,
//     error=>{
//         if(error.response && error.response.status===401){
//             localStorage.removeItem("authToken");
//             window.location.href='/login';
//         }
//         return Promise.reject(error);
//     }
// )




// Axios response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 (Unauthorized) and not already retried
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark as retried

      try {
        // 1. Call refresh token API
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await axios.post(`${apiUrl}/refreshToken`, { refreshToken });

        // 2. Update new tokens
        const { authToken } = res.data;
        localStorage.setItem("authToken", authToken);

        // 3. Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${authToken}`;
        return axiosInstance(originalRequest);

      } catch (err) {
        // Refresh failed! Force logout
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // Redirect to login
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);