import {AppRootStateType} from "../../../../app/store";

export const isLoggedInTodolistsListSelector = ((state:AppRootStateType) => state.authReducer.isLoggedIn)
export  const todolistsSelector = ((state:AppRootStateType) => state.todolists)
export const tasksSelector = ((state:AppRootStateType) => state.tasks)
