import {instance} from "../../../common/api";

export const securityApi = {
    getCaptchaUrl(){
        return instance.get<{url:string}>("security/get-captcha-url")
    }
}