import {Dispatch} from "redux";
import axios, {AxiosError} from "axios";
import {appActions} from "../../app/model/app-reducer";


/**
 * This function handles server network errors.
 * It checks if the error is an Axios error and dispatches appropriate error messages and application status.
 *
 * @param {unknown} e - The error object, expected to be of type Error or AxiosError.
 * @param {Dispatch} dispatch - The Redux dispatch function to dispatch actions to the Redux store.
 *
 * @returns {void}
 *
 * @example
 * handleServerNetworkError(error, dispatch);
 */
// export const handleServerNetworkError = (e: unknown, dispatch: Dispatch) => {
//     const err = e as Error | AxiosError<{ error: string }>;
//     if (axios.isAxiosError(err)) {
//         const error = err.message ? err.message : "Some error occurred";
//         dispatch(appActions.setAppError({ error }));
//     } else {
//         dispatch(appActions.setAppError({ error: `Native error ${err.message}` }));
//     }
//     dispatch(appActions.setAppStatus({ status: "failed" }));
// };