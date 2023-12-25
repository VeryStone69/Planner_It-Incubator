import {tasksReducer} from '../features/TodolistsList/model/tasks-reducer';
import {todolistsReducer} from '../features/TodolistsList/model/todolists-reducer';
import {TypedUseSelectorHook,useSelector} from "react-redux";
import {appReducer} from "./model/app-reducer";
import {authReducer} from "../features/auth/model/auth-reducer";
import {configureStore} from "@reduxjs/toolkit";

export const store = configureStore({reducer:{
        tasks: tasksReducer,
        todolists: todolistsReducer,
        app: appReducer,
        authReducer: authReducer
    }})
export type AppRootStateType = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

// @ts-ignore
window.store = store;
