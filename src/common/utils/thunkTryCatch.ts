import {BaseThunkAPI} from "@reduxjs/toolkit/dist/createAsyncThunk";
import {AppDispatch, AppRootStateType} from "../../app/store";
import {BaseResponseType} from "../types";
import {handleServerNetworkError} from "./handle-server-network-error";

/**
 * @template T - The type of the return value of the logic function.
 *
 * @param {BaseThunkAPI<AppRootStateType, unknown, AppDispatch, null | BaseResponseType>} thunkAPI - The thunk API object.
 * @param {() => Promise<T>} logic - The logic to be executed. This should be a function that returns a Promise.
 *
 * @returns {Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>>} - A Promise that resolves to the result of the logic function
 * if it was successful, or rejects with a value of null if an error occurred.
 *
 * @see {@link https://redux-toolkit.js.org/api/createAsyncThunk|Redux Toolkit: createAsyncThunk}
 */
export const thunkTryCatch = async <T>(
    thunkAPI: BaseThunkAPI<AppRootStateType, unknown, AppDispatch, null | BaseResponseType>,
    logic: () => Promise<T>
): Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>> => {
    const {dispatch, rejectWithValue} = thunkAPI;
    try {
        return await logic();
    } catch (e) {
        handleServerNetworkError(e, dispatch);
        return rejectWithValue(null);
    }
};