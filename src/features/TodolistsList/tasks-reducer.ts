import {
    AddTaskArgType,
    TaskType,
    todolistsAPI, UpdateTaskArgType,
    UpdateTaskModelType
} from './todolists-api'
import {appActions} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../common/utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {todolistsThunks} from "./todolists-reducer";
import {clearTodolistsAndTasks} from "../../common/actions/common.actions";
import {createAppAsyncThunk} from "../../common/utils/create-app-async-thunk";
import {ResultCode, TaskPriorities, TaskStatuses} from "../../common/enums/common-enums";
import {RemoveTaskArgType} from "../../common/types/common-types";


const slice = createSlice({
        name: "tasks",
        initialState: {} as TasksStateType,
        reducers: {
            updateTask: (state, action: PayloadAction<{
                taskId: string,
                model: UpdateDomainTaskModelType,
                todolistId: string
            }>) => {
                const tasksForCurrentTodolist = state[action.payload.todolistId];
                const index = tasksForCurrentTodolist.findIndex((task) => task.id === action.payload.taskId);
                if (index !== -1) {
                    tasksForCurrentTodolist[index] = {...tasksForCurrentTodolist[index], ...action.payload.model}
                }
            },
            setTasks: (state, action: PayloadAction<{ tasks: Array<TaskType>, todolistId: string }>) => {
                state[action.payload.todolistId] = action.payload.tasks
            }
        },
        extraReducers: (builder) => {
            builder
                .addCase(addTask.fulfilled, (state, action) => {
                    const tasksForCurrentTodolist = state[action.payload.task.todoListId];
                    tasksForCurrentTodolist.unshift(action.payload.task)
                })
                .addCase(fetchTasks.fulfilled, (state, action) => {
                    state[action.payload.todolistId] = action.payload.tasks
                })

                .addCase(updateTask.fulfilled,(state, action)=>{
                    const tasksForCurrentTodolist = state[action.payload.todolistId];
                    const index = tasksForCurrentTodolist.findIndex((task) => task.id === action.payload.taskId);
                    if (index !== -1) {
                        tasksForCurrentTodolist[index] = {...tasksForCurrentTodolist[index], ...action.payload.domainModel}
                    }
                })
                .addCase(removeTask.fulfilled,(state, action)=>{
                    const tasksForCurrentTodolist = state[action.payload.todolistId];
                    const index = tasksForCurrentTodolist.findIndex((task) => task.id === action.payload.taskId);
                    if (index !== -1) tasksForCurrentTodolist.splice(index, 1)
                })

                .addCase(todolistsThunks.addTodolist.fulfilled, (state, action) => {
                    state[action.payload.todolist.id] = []
                })
                .addCase(todolistsThunks.removeTodolist.fulfilled, (state, action) => {
                    delete state[action.payload.id];
                })
                .addCase(todolistsThunks.fetchTodolists.fulfilled, (state, action) => {
                    action.payload.todolists.forEach((tl: any) => {
                        state[tl.id] = []
                    })
                })
                .addCase(clearTodolistsAndTasks, () => {
                    return {}
                })


        }
    }
)


// thunks
const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
    "tasks/fetchTasks",
    async (todolistId, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI;
        try {
            dispatch(appActions.setAppStatus({status: "loading"}));
            const res = await todolistsAPI.getTasks(todolistId);
            const tasks = res.data.items;
            dispatch(appActions.setAppStatus({status: "succeeded"}));
            return {tasks, todolistId};
        } catch (e) {
            handleServerNetworkError(e, dispatch);
            return rejectWithValue(null);
        }
    },
);

const removeTask = createAppAsyncThunk<RemoveTaskArgType,RemoveTaskArgType>(
    "tasks/removeTask",
    async (arg,thunkAPI)=>{
        const {dispatch,rejectWithValue} = thunkAPI;
        try {
            dispatch(appActions.setAppStatus({status: "loading"}));
            const res = await todolistsAPI.deleteTask(arg)
            if (res.data.resultCode === ResultCode.Success) {
                dispatch(appActions.setAppStatus({ status: "succeeded" }));
                return arg;
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

const addTask = createAppAsyncThunk<{ task: TaskType }, AddTaskArgType>(
    "tasks/addTask",
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI;
        try {
            dispatch(appActions.setAppStatus({status: "loading"}));
            const res = await todolistsAPI.createTask(arg);
            if (res.data.resultCode === ResultCode.Success) {
                const task = res.data.data.item;
                dispatch(appActions.setAppStatus({status: "succeeded"}));
                return {task};
            } else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null);
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch);
            return rejectWithValue(null);
        }
    });

const updateTask = createAppAsyncThunk<UpdateTaskArgType, UpdateTaskArgType>(
    "tasks/updateTask",
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue, getState} = thunkAPI;

        try {
            dispatch(appActions.setAppStatus({status: "loading"}));
            const state = getState();
            const task = state.tasks[arg.todolistId].find(t => t.id === arg.taskId)
            if (!task) {
                dispatch(appActions.setAppError({error: "Task not found in the state"}));
                return rejectWithValue(null);
            }
            const apiModel: UpdateTaskModelType = {
                deadline: task.deadline,
                description: task.description,
                priority: task.priority,
                startDate: task.startDate,
                title: task.title,
                status: task.status,
                ...arg.domainModel,
            };
            const res = await todolistsAPI.updateTask(arg.todolistId, arg.taskId, apiModel)
            if (res.data.resultCode === ResultCode.Success) {
                dispatch(appActions.setAppStatus({status: "succeeded"}));
                return arg;
            } else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null);
            }

        } catch (e) {
            handleServerNetworkError(e, dispatch);
            return rejectWithValue(null);
        }

    }
)

export const tasksReducer = slice.reducer
export const tasksActions = slice.actions
export const tasksThunks = {fetchTasks, addTask, updateTask,removeTask};

// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksStateType = {
    [key: string]: Array<TaskType>
}

