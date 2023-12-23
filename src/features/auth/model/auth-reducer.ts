import {appActions} from "../../../app/app-reducer";
import {handleServerAppError} from "../../../common/utils";
import {createSlice} from "@reduxjs/toolkit";
import {clearTodolistsAndTasks} from "../../../common/actions/common.actions";
import {authAPI, LoginDataType} from "../api/auth-api";
import {ResultCode} from "../../../common/enums/common-enums";
import {createAppAsyncThunk} from "../../../common/utils/create-app-async-thunk";
import {thunkTryCatch} from "../../../common/utils/thunkTryCatch";


const slice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn;
            })
            .addCase(initializeApp.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })

    }

})

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginDataType>(
    `${slice.name}/login`,
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI;
        return thunkTryCatch(thunkAPI, async () => {
            dispatch(appActions.setAppStatus({status: "loading"}))
            const res = await authAPI.login(arg)
            if (res.data.resultCode === ResultCode.Success) {
                dispatch(appActions.setAppStatus({status: "succeeded"}))
                return {isLoggedIn: true}
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(res.data);
            }
        })
    });

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
    `${slice.name}/logout`,
    async (_, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI;
        return thunkTryCatch(thunkAPI, async () => {
            const res = await authAPI.logout();
            if (res.data.resultCode === ResultCode.Success) {
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
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
    return thunkTryCatch(thunkAPI, async () => {
        const res = await authAPI.me();
        if (res.data.resultCode === ResultCode.Success) {
            return {isLoggedIn: true};
        } else {
            return rejectWithValue(null);
        }
    }).finally(() => {
        dispatch(appActions.setInitialized({isInitialized: true}));
    });
});

export const authReducer = slice.reducer;
export const authAction = slice.actions;
export const authThunks = {login, logout, initializeApp}