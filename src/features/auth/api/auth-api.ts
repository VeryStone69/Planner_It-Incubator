import {instance} from "../../../common/api";
import {BaseResponseType} from "../../../common/types";
import {AxiosResponse} from "axios";
import {AuthResponseType} from "../../TodolistsList/api/todolists/todolists-api.types";

export const authAPI = {
    login(loginData: LoginDataType) {
        return instance.post<BaseResponseType<{ userId: number }>, AxiosResponse<BaseResponseType<{
            userId: number
        }>>, LoginDataType>("auth/login", loginData)
    },
    me() {
        return instance.get<BaseResponseType<AuthResponseType>, AxiosResponse<BaseResponseType<AuthResponseType>>>("auth/me")
    },
    logout() {
        return instance.delete<BaseResponseType>("auth/login")
    }
}

export type LoginDataType = {
    email: string
    password: string
    rememberMe: boolean
    captcha: string | null;
}