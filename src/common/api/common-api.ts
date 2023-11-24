import axios from "axios";

export const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '5d521f2b-77eb-4890-a6da-9366e5cc7e68'
    }
})