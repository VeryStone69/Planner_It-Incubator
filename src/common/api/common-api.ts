import axios from "axios";

export const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '05ded78c-1af5-47a8-9e58-4fefeb749215',
        // Authorization: 'Bearer 8c9566a0-c81e-47f7-9f0c-8d0024d5b916' old version
        Authorization: 'Bearer 5a3771d8-afb1-436b-864c-5c47553d9820'
    }
})

