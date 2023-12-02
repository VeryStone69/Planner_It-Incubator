import {appActions} from '../../app/app-reducer'
import { Dispatch } from 'redux'
import {BaseResponseType} from "../types"

// generic function
export const handleServerAppError = <T>(data: BaseResponseType<T>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(appActions.setAppError({error:data.messages[0]}))
    } else {
        dispatch(appActions.setAppError({error:'Some error occurred'}))
    }
    dispatch(appActions.setAppStatus({status:'failed'}))
}

