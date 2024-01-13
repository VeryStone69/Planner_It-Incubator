import {createSlice, isAnyOf} from "@reduxjs/toolkit";
import {clearTodolistsAndTasks} from "../../../common/actions/common.actions";
import {authAPI, LoginDataType} from "../api/auth-api";
import {ResultCode} from "../../../common/enums/common-enums";
import {createAppAsyncThunk} from "../../../common/utils";
import {securityApi} from "../api/security-api";


const slice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: false,
        captchaUrl: ""
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCaptchaUrl.fulfilled, (state, action) => {
                state.captchaUrl = action.payload
            })
            .addMatcher(
                isAnyOf(authThunks.login.fulfilled, authThunks.logout.fulfilled, authThunks.initializeApp.fulfilled),
                (state, action) => {
                    return { ...state, ...action.payload };
                }
            )

    }
})

const getCaptchaUrl = createAppAsyncThunk<string>(
    `${slice.name}/captcha`,
    async () => {
        const res = await securityApi.getCaptchaUrl()
        return res.data.url
    }
)

const login = createAppAsyncThunk<{ isLoggedIn: boolean,captchaUrl: string}, LoginDataType>(
    `${slice.name}/login`,
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI;
        const res = await authAPI.login(arg)
        if (res.data.resultCode === ResultCode.Success) {
            return {isLoggedIn: true,captchaUrl:""}
        } else if (res.data.resultCode === ResultCode.Captcha) {
            dispatch(getCaptchaUrl())
            return rejectWithValue(res.data);
        } else {
            return rejectWithValue(res.data);
        }
    });

const logout = createAppAsyncThunk<{ isLoggedIn: boolean,captchaUrl:string }, undefined>(
    `${slice.name}/logout`,
    async (_, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI;
        const res = await authAPI.logout();
        if (res.data.resultCode === ResultCode.Success) {
            dispatch(clearTodolistsAndTasks())
            return {isLoggedIn: false,captchaUrl:""}
        } else {
            return rejectWithValue(res.data);
        }
    });

const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean,captchaUrl:string }, undefined>
(`${slice.name}/initializeApp`, async (_, {rejectWithValue}) => {
    const res = await authAPI.me()
    if (res.data.resultCode === ResultCode.Success) {
        return {isLoggedIn: true,captchaUrl:""};
    } else {
        return rejectWithValue(res.data);
    }

});

export const authReducer = slice.reducer;
export const authAction = slice.actions;
export const authThunks = {login, logout, initializeApp}