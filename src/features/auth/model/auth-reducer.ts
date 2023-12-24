import {handleServerAppError} from "../../../common/utils";
import {createSlice, isAnyOf} from "@reduxjs/toolkit";
import {clearTodolistsAndTasks} from "../../../common/actions/common.actions";
import {authAPI, LoginDataType} from "../api/auth-api";
import {ResultCode} from "../../../common/enums/common-enums";
import {createAppAsyncThunk} from "../../../common/utils";
import {thunkTryCatch} from "../../../common/utils";


const slice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addMatcher(
                isAnyOf(authThunks.login.fulfilled,authThunks.logout.fulfilled,authThunks.initializeApp.fulfilled),
                (state, action) => {
                    state.isLoggedIn = action.payload.isLoggedIn
                }
            )
    }

})

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginDataType>(
    `${slice.name}/login`,
    async (arg, {rejectWithValue}) => {
            const res = await authAPI.login(arg)
            if (res.data.resultCode === ResultCode.Success) {
                return {isLoggedIn: true}
            } else {
                return rejectWithValue(res.data);
            }
    });

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
    `${slice.name}/logout`,
    async (_, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI;
        return thunkTryCatch(thunkAPI, async () => {
            const res = await authAPI.logout();
            if (res.data.resultCode === ResultCode.Success) {
                dispatch(clearTodolistsAndTasks())
                return {isLoggedIn: false}
            } else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null);
            }
        })
    });

const initializeApp = createAppAsyncThunk<{
    isLoggedIn: boolean
}, undefined>(`${slice.name}/initializeApp`, async (_, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI;
        const res = await authAPI.me()
        if (res.data.resultCode === ResultCode.Success) {
            return {isLoggedIn: true};
        } else {
            return rejectWithValue(res.data);
        }

});

export const authReducer = slice.reducer;
export const authAction = slice.actions;
export const authThunks = {login, logout, initializeApp}