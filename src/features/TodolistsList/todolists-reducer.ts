
import {appActions, RequestStatusType} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../common/utils";
import {AppThunk} from "../../app/store";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTodolistsAndTasks} from "../../common/actions/common.actions";
import {ResultCode} from "../../common/enums/common-enums";
import {todolistsAPI, TodolistType} from "./todolists-api";
import {createAppAsyncThunk} from "../../common/utils/create-app-async-thunk";





const slice = createSlice({
    name: "todolists",
    initialState: [] as TodolistDomainType[],
    reducers: {
        addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
            state.unshift({...action.payload.todolist, filter: "all", entityStatus: "idle"})
        },
        changeTodolistTitle: (state, action: PayloadAction<{ id: string, title: string }>) => {
            const index = state.findIndex(todo => todo.id === action.payload.id);
            if (index !== -1) state[index].title = action.payload.title;
        },
        changeTodolistFilter: (state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) => {
            const index = state.findIndex(todo => todo.id === action.payload.id);
            if (index !== -1) state[index].filter = action.payload.filter;
        },
        changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string, status: RequestStatusType }>) => {
            const index = state.findIndex(todo => todo.id === action.payload.id);
            if (index !== -1) state[index].entityStatus = action.payload.status;
        }
    },
    extraReducers:builder => {
        builder
            .addCase(removeTodolist.fulfilled,(state, action)=>{
                const index = state.findIndex(todo => todo.id === action.payload.id)
                if (index !== -1) state.splice(index, 1)
            })
            .addCase(fetchTodolists.fulfilled,(state, action)=>{
                return action.payload.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }));
            })

            .addCase(clearTodolistsAndTasks,()=>{
                return [];
            })
    }

})

const fetchTodolists = createAppAsyncThunk<{todolists:TodolistType[]},void>(
    "todo/fetchTodolists",
    async (_,thunkAPI)=>{
        const {dispatch, rejectWithValue} = thunkAPI;
        try {
            dispatch(appActions.setAppStatus({ status: "loading" }))
            const res = await todolistsAPI.getTodolists();
            dispatch(appActions.setAppStatus({ status: "succeeded" }));
            return {todolists:res.data}
        } catch (e) {
            handleServerNetworkError(e, dispatch);
            return rejectWithValue(null);
        }
    }

)

const removeTodolist = createAppAsyncThunk<{id:string},string>(
    "todo/removeTodolist",
    async (id:string,thunkAPI)=>{
        const {dispatch,rejectWithValue} = thunkAPI;
        try {
            dispatch(appActions.setAppStatus({ status: "loading" }))
            dispatch(todolistsActions.changeTodolistEntityStatus({id, status:"loading"}))
            const res = await todolistsAPI.deleteTodolist(id)
            if (res.data.resultCode === ResultCode.Success) {
                dispatch(appActions.setAppStatus({ status: "succeeded" }));
                return {id};
            } else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null);
            }
        } catch (e){
            handleServerNetworkError(e, dispatch);
            return rejectWithValue(null);
        }
    }
)

export const addTodolistTC = (title: string): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({status: "loading"}))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                if (res.data.resultCode === ResultCode.Success) {
                    dispatch(todolistsActions.addTodolist({todolist:res.data.data.item}))
                    dispatch(appActions.setAppStatus({status: "succeeded"}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch)
            })
    }
}
export const changeTodolistTitleTC = (id: string, title: string): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({status: "loading"}))
        todolistsAPI.updateTodolist(id, title)
            .then((res) => {
                if (res.data.resultCode === ResultCode.Success) {
                    dispatch(todolistsActions.changeTodolistTitle({id, title}))
                    dispatch(appActions.setAppStatus({status: "succeeded"}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }

            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch)
            })
    }
}

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions
export const todolistsThunks = {removeTodolist,fetchTodolists}

// types
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
