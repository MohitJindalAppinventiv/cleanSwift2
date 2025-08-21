import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const axiosInstance = axios.create({
  baseURL: `${apiUrl}`,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem("authToken");
    const sessionToken = localStorage.getItem("sessionToken");

    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
      config.headers[`x-session-token`] = `${sessionToken}`;
    }

    return config;
  },
  (err) => Promise.reject(err)
);

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

// // Axios response interceptor
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // If 401 (Unauthorized) and not already retried
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true; // Mark as retried

//       try {
//         // 1. Call refresh token API
//         const refreshToken = localStorage.getItem("refreshToken");
//         console.log("refresh token",refreshToken);
//         const res = await axiosInstance.post(`/refreshToken`, {
//           refreshToken,
//         });

//         console.log("refresh token",res);

//         // 2. Update new tokens
//         const { id_token : authToken } = res.data;
//         localStorage.setItem("authToken", authToken);

//         // 3. Retry original request with new token
//         originalRequest.headers.Authorization = `Bearer ${authToken}`;
//         return axiosInstance(originalRequest);
//       } catch (err) {
//         // Refresh failed! Force logout
//         localStorage.removeItem("authToken");
//         localStorage.removeItem("refreshToken");
//         // window.location.href = "/login"; // Redirect to login
//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(error);
//   }
// );




// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const refreshToken = localStorage.getItem("refreshToken");
//         const res = await axiosInstance.post("/refreshToken", {
//           refreshToken,
//         });

//         const { id_token: authToken } = res.data;
//         localStorage.setItem("authToken", authToken);

//         // Retry original request
//         originalRequest.headers.Authorization = `Bearer ${authToken}`;
//         return axiosInstance(originalRequest);
//       } catch (err) {
//         localStorage.removeItem("authToken");
//         localStorage.removeItem("refreshToken");
//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(error);
//   }
// );



// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const refreshToken = localStorage.getItem("refreshToken");
//         if (!refreshToken) {
//           handleLogout();
//           return Promise.reject(error);
//         }

//         const res = await axiosInstance.post("/refreshToken", { refreshToken });

//         const { id_token: authToken } = res.data;
//         localStorage.setItem("authToken", authToken);

//         // retry original request with new token
//         originalRequest.headers.Authorization = `Bearer ${authToken}`;
//         return axiosInstance(originalRequest);
//       } catch (err) {
//         handleLogout();
//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// function handleLogout() {
//   localStorage.removeItem("authToken");
//   localStorage.removeItem("refreshToken");
//   // redirect user to login page
//   window.location.href = "/login";
// }



axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // if unauthorized
    if (error.response?.status === 401) {
      // if already retried once -> logout
      if (originalRequest._retry) {
        handleLogout();
        return Promise.reject(error);
      }

      // first retry attempt
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          handleLogout();
          return Promise.reject(error);
        }

        const res = await axiosInstance.post("/refreshToken", { refreshToken });

        const { id_token: authToken } = res.data;
        localStorage.setItem("authToken", authToken);

        // retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${authToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        handleLogout();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

function handleLogout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login"; // redirect to login
}
