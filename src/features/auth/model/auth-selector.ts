import {AppRootStateType} from "../../../app/store";

export const isLoggedInLoginSelector = ((state:AppRootStateType) => state.authReducer.isLoggedIn)
