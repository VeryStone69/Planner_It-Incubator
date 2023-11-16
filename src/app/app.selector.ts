import {AppRootStateType} from "./store";

export const statusSelector = ((state:AppRootStateType) => state.app.status)
export const isLoggedInAppSelector = ((state:AppRootStateType) => state.authReducer.isLoggedIn)
export const isInitializedSelector = ((state:AppRootStateType) => state.app.isInitialized)