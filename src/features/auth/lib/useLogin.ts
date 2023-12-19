import {useActions} from "../../../common/hooks/useActions";
import {authThunks} from "../model/auth-reducer";
import {useFormik} from "formik";
import {useAppSelector} from "../../../app/store";
import {isLoggedInLoginSelector} from "../model/auth-selector";

type FormikErrorType = {
    email?: string
    password?: string
    rememberMe?: boolean
}

export const useLogin = () =>{
    const isLoggedIn = useAppSelector<boolean>(isLoggedInLoginSelector)
    const {login: loginThunk} = useActions(authThunks)
    const formik = useFormik({
        initialValues: {
            email: "free@samuraijs.com",
            password: "free",
            rememberMe: false
        },
        validate: (values) => {
            const errors: FormikErrorType = {}
            if (!values.email) {
                errors.email = "Required"
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address'
            }
            if (!values.password) {
                errors.password = "Required"
            } else if (values.password.length < 3) {
                errors.password = "Less then 3 symbols"
            }
            return errors
        },
        onSubmit: (values) => {
            loginThunk(values)
        },
    })
    return {formik, isLoggedIn}
}