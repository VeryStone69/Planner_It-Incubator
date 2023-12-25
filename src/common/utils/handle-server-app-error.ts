import {appActions} from '../../app/app-reducer'
import {Dispatch} from 'redux'
import {BaseResponseType} from "../types"

/**
 * Function to handle server application errors.
 *
 * @template T - The type of the data in the BaseResponseType.
 * @param {BaseResponseType<T>} data - The data from the server response.
 * @param {Dispatch} dispatch - The Redux dispatch function to dispatch actions to the Redux store.
 * @param {boolean} [showError=true] - Optional boolean to determine whether to show an error or not. Defaults to true.
 */
// export const handleServerAppError = <T>(data: BaseResponseType<T>, dispatch: Dispatch, showError: boolean = true) => {
//     if (showError) {
//         dispatch(appActions.setAppError({error: data.messages.length ? data.messages[0] : 'Some error occurred'}))
//     }
//     dispatch(appActions.setAppStatus({status: 'failed'}))
// }

