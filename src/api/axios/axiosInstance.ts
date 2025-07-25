import axios from 'axios';


const apiUrl=import.meta.env.VITE_API_URL;

export const axiosInstance=axios.create({
    baseURL:`${apiUrl}`
});


axiosInstance.interceptors.request.use(
    (config)=>{
        const accessToken = localStorage.getItem("authToken");

        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (err)=>Promise.reject(err)
)

axiosInstance.interceptors.response.use(
    response=>response,
    error=>{
        if(error.response && error.response.status===401){
            localStorage.removeItem("authToken");
            window.location.href='/login';
        }
        return Promise.reject(error);
    }
)