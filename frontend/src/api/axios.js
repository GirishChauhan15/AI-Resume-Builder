import config from "@/config";
import axios from "axios";

const URL = config?.backEndUrl;

export default axios.create({
    baseURL: URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials:true
})

export const axiosPrivate = axios.create({
    baseURL: URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials:true
})


