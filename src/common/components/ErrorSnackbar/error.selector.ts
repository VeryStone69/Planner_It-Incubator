import {AppRootStateType} from "../../../app/store";

export const errorSelector = ((state: AppRootStateType) => state.app.error)