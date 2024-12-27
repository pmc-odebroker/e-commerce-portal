import axios from "axios";
import { PATH } from "./PATH";

const axiosConfig = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosConfig.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosConfig.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const { response } = error;

        if (response && (response.status === 401 || response.status === 403)) {
            localStorage.removeItem("ACCESS_TOKEN");
            
            window.location.href = PATH.AUTH_VENDOR_LOGIN; 
        }

        return Promise.reject(error);
    }
);

export default axiosConfig;
