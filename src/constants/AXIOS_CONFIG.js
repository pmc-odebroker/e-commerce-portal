import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const { response } = error;

        if (response && response.status === 401) {
            localStorage.removeItem("ACCESS_TOKEN");
        }

        throw error;
    } 
);

export default axiosClient;
