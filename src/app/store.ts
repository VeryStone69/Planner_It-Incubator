import {tasksReducer} from '../features/TodolistsList/tasks-reducer';
import {todolistsReducer} from '../features/TodolistsList/todolists-reducer';
import {AnyAction,combineReducers} from 'redux'
import {ThunkAction, ThunkDispatch} from 'redux-thunk'
import {TypedUseSelectorHook,useSelector} from "react-redux";
import {appReducer} from "./app-reducer";
import {authReducer} from "../features/auth/auth-reducer";
import {configureStore} from "@reduxjs/toolkit";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    authReducer: authReducer
})
export const store = configureStore({reducer:rootReducer})
export type AppRootStateType = ReturnType<typeof store.getState>

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AnyAction>

export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AnyAction>
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector


// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
