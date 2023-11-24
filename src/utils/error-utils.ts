import {appActions} from '../app/app-reducer'
import { Dispatch } from 'redux'
import { ResponseType } from '../api/todolists-api'
import axios, {AxiosError} from "axios";

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(appActions.setAppError({error:data.messages[0]}))
    } else {
        dispatch(appActions.setAppError({error:'Some error occurred'}))
    }
    dispatch(appActions.setAppStatus({status:'failed'}))
}

export const handleServerNetworkError = (e: unknown, dispatch: Dispatch) => {
    const err = e as Error | AxiosError<{ error: string }>;
    if (axios.isAxiosError(err)) {
        const error = err.message ? err.message : "Some error occurred";
        dispatch(appActions.setAppError({ error }));
    } else {
        dispatch(appActions.setAppError({ error: `Native error ${err.message}` }));
    }
    dispatch(appActions.setAppStatus({ status: "failed" }));
};

