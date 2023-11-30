import {appActions} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../common/utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk} from "../../app/store";
import {clearTodolistsAndTasks} from "../../common/actions/common.actions";
import {authAPI, LoginDataType} from "./auth-api";
import {ResultCode} from "../../common/enums/common-enums";
import {createAppAsyncThunk} from "../../common/utils/create-app-async-thunk";


const slice = createSlice({
    name:"auth",
    initialState:{
        isLoggedIn: false
    },
    reducers:{
        setIsLoggedIn:(state, action:PayloadAction<{isLoggedIn: boolean}>)=>{
            state.isLoggedIn = action.payload.isLoggedIn
        },

    },
    extraReducers:(builder)=>{
        builder
            .addCase(login.fulfilled,(state,action)=>{
                state.isLoggedIn = action.payload.isLoggedIn
            })

    }

})

const login = createAppAsyncThunk<{isLoggedIn:boolean},LoginDataType>(
    `${slice.name}/login`,
    async (arg,thunkAPI)=>{
        const {dispatch,rejectWithValue} = thunkAPI;
        try {
            dispatch(appActions.setAppStatus({status:"loading"}))
            const res = await authAPI.login(arg)
            if (res.data.resultCode === 0) {
                dispatch(appActions.setAppStatus({status:"succeeded"}))
                return { isLoggedIn: true }
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null);
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch);
            return rejectWithValue(null);
        }
    }
)
export const initializeAppTC = (): AppThunk  => async (dispatch) => {
    dispatch(appActions.setAppStatus({status:"loading"}))
    const result = await authAPI.me()
    try {
        if (result.data.resultCode === 0) {
            dispatch(authAction.setIsLoggedIn({ isLoggedIn: true }))
            dispatch(appActions.setAppStatus({status:"succeeded"}))

        } else {
            handleServerAppError(result.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError(e as { message: string }, dispatch)
    } finally {
        dispatch(appActions.setInitialized({isInitialized:true}))
    }
}
export const logoutTC = (): AppThunk  => async (dispatch) => {
    dispatch(appActions.setAppStatus({status:"loading"}))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === ResultCode.Success) {
                dispatch(authAction.setIsLoggedIn({ isLoggedIn: false }))
                dispatch(appActions.setAppStatus({status:'succeeded'}))
                dispatch(clearTodolistsAndTasks())
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}

export const authReducer = slice.reducer;
export const authAction = slice.actions;
export const authThunks = {login}