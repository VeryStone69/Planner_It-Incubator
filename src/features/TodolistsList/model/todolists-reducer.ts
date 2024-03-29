import {RequestStatusType} from "../../../app/model/app-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTodolistsAndTasks} from "../../../common/actions/common.actions";
import {ResultCode} from "../../../common/enums/common-enums";
import {todolistsAPI} from "../api/todolists/todolists-api";
import {createAppAsyncThunk} from "../../../common/utils";
import {UpdateTodolistTitleArgType} from "../../../common/types";
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
    async () => {
        const res = await todolistsAPI.getTodolists();
        return {todolists: res.data};
    });

const removeTodolist = createAppAsyncThunk<{ id: string }, string>(
    `${slice.name}/removeTodolist`,
    async (id: string, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI;
        dispatch(todolistsActions.changeTodolistEntityStatus({id, status: "loading"}))
        const res = await todolistsAPI.deleteTodolist(id)
            .finally(
                () => {
                    dispatch(todolistsActions.changeTodolistEntityStatus({id, status: "idle"}))
                }
            )
        if (res.data.resultCode === ResultCode.Success) {
            return {id};
        } else {
            return rejectWithValue(res.data);
        }

    });

const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, string>(
    `${slice.name}/addTodolist`,
    async (title, {rejectWithValue}) => {
        const res = await todolistsAPI.createTodolist(title);
        if (res.data.resultCode === ResultCode.Success) {
            return {todolist: res.data.data.item};
        } else {
            return rejectWithValue(res.data);
        }
    },
);


const changeTodolistTitle = createAppAsyncThunk<UpdateTodolistTitleArgType, UpdateTodolistTitleArgType>(
    `${slice.name}/changeTodolistTitle`,
    async (arg, {rejectWithValue}) => {
        const res = await todolistsAPI.updateTodolist(arg);
        if (res.data.resultCode === ResultCode.Success) {
            return arg
        } else {
            return rejectWithValue(res.data)
        }
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
