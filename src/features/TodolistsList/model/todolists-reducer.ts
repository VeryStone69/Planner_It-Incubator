import {appActions, RequestStatusType} from "../../../app/app-reducer";
import {handleServerAppError} from "../../../common/utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTodolistsAndTasks} from "../../../common/actions/common.actions";
import {ResultCode} from "../../../common/enums/common-enums";
import {todolistsAPI} from "../api/todolists/todolists-api";
import {createAppAsyncThunk} from "../../../common/utils";
import {UpdateTodolistTitleArgType} from "../../../common/types";
import {thunkTryCatch} from "../../../common/utils";
import {TodolistType} from "../api/todolists/todolists-api.types";


const slice = createSlice({
    name: "todolists",
    initialState: [] as TodolistDomainType[],
    reducers: {
        changeTodolistFilter: (state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) => {
            const index = state.findIndex(todo => todo.id === action.payload.id);
            if (index !== -1) state[index].filter = action.payload.filter;
        },
        changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string, status: RequestStatusType }>) => {
            const index = state.findIndex(todo => todo.id === action.payload.id);
            if (index !== -1) state[index].entityStatus = action.payload.status;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(removeTodolist.fulfilled, (state, action) => {
                const index = state.findIndex(todo => todo.id === action.payload.id)
                if (index !== -1) state.splice(index, 1)
            })
            .addCase(fetchTodolists.fulfilled, (state, action) => {
                return action.payload.todolists.map((tl) => ({...tl, filter: "all", entityStatus: "idle"}));
            })
            .addCase(addTodolist.fulfilled, (state, action) => {
                state.unshift({...action.payload.todolist, filter: "all", entityStatus: "idle"})
            })
            .addCase(changeTodolistTitle.fulfilled, (state, action) => {
                const index = state.findIndex(todo => todo.id === action.payload.id);
                if (index !== -1) state[index].title = action.payload.title;
            })
            .addCase(clearTodolistsAndTasks, () => {
                return [];
            })
    }

})


const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }, void>(
    `${slice.name}/fetchTodolists`,
    async (_, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI;
        return thunkTryCatch(thunkAPI, async () => {
            dispatch(appActions.setAppStatus({status: "loading"}))
            const res = await todolistsAPI.getTodolists();
            dispatch(appActions.setAppStatus({status: "succeeded"}));
            return {todolists: res.data}
        })
    });


const removeTodolist = createAppAsyncThunk<{ id: string }, string>(
    `${slice.name}/removeTodolist`,
    async (id: string, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI;
        return thunkTryCatch(thunkAPI, async () => {
            dispatch(appActions.setAppStatus({status: "loading"}))
            dispatch(todolistsActions.changeTodolistEntityStatus({id, status: "loading"}))
            const res = await todolistsAPI.deleteTodolist(id)
            if (res.data.resultCode === ResultCode.Success) {
                dispatch(appActions.setAppStatus({status: "succeeded"}));
                return {id};
            } else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null);
            }
        })
    });


const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, string>(
    `${slice.name}/addTodolist`,
    async (title, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI;
        return thunkTryCatch(thunkAPI, async () => {
            dispatch(appActions.setAppStatus({status: "loading"}));
            const res = await todolistsAPI.createTodolist(title);
            if (res.data.resultCode === ResultCode.Success) {
                dispatch(appActions.setAppStatus({status: "succeeded"}));
                return {todolist: res.data.data.item};
            } else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null);
            }
        })
    });



const changeTodolistTitle = createAppAsyncThunk<UpdateTodolistTitleArgType, UpdateTodolistTitleArgType>(
    `${slice.name}/changeTodolistTitle`,
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI;
        return thunkTryCatch(thunkAPI, async () => {
            dispatch(appActions.setAppStatus({status: "loading"}));
            const res = await todolistsAPI.updateTodolist(arg);
            if (res.data.resultCode === ResultCode.Success) {
                dispatch(appActions.setAppStatus({status: "succeeded"}));
                return arg
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        })
    });

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions
export const todolistsThunks = {removeTodolist, fetchTodolists, addTodolist, changeTodolistTitle}

// types
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
