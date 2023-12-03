import {createAsyncThunk} from "@reduxjs/toolkit";
import {AppDispatch, AppRootStateType} from "../../app/store";
import {BaseResponseType} from "../types";

/**
 * This function creates an asynchronous thunk with specified types.
 * It's a part of Redux Toolkit and is used to handle asynchronous logic in your action creators.
 * The types provided specify the shape of the `state`, `dispatch` and `rejectValue` within the thunk.
 *
 * @function
 * @name createAppAsyncThunk
 * @returns {Function} A Redux thunk action creator.
 *
 * @see {@link https://redux-toolkit.js.org/usage/usage-with-typescript#defining-a-pre-typed-createasyncthunk Toolkit: createAsyncThunk}
 */
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: AppRootStateType;
    dispatch: AppDispatch;
    rejectValue: BaseResponseType | null;
}>();
