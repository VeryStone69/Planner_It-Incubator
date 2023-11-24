import {instance} from "../../common/api";
import {ResponseType} from "../../common/types/common-types";
import {AxiosResponse} from "axios";
import {AuthResponseType} from "../TodolistsList/todolists-api";

export const authAPI = {
    login(loginData: LoginDataType) {
        return instance.post<ResponseType<{ userId: number }>, AxiosResponse<ResponseType<{
            userId: number
        }>>, LoginDataType>("auth/login", loginData)
    },
    me() {
        return instance.get<ResponseType<AuthResponseType>, AxiosResponse<ResponseType<AuthResponseType>>>("auth/me")
    },
    logout() {
        return instance.delete<ResponseType>("auth/login")
    }
}

export type LoginDataType = {
    email: string
    password: string
    rememberMe: boolean
    captcha?: string;
}