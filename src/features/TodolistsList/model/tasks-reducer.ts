import {appActions} from "../../../app/app-reducer";
import {handleServerAppError} from "../../../common/utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {todolistsThunks} from "./todolists-reducer";
import {clearTodolistsAndTasks} from "../../../common/actions/common.actions";
import {createAppAsyncThunk} from "../../../common/utils";
import {ResultCode, TaskPriorities, TaskStatuses} from "../../../common/enums/common-enums";
import {RemoveTaskArgType} from "../../../common/types";
import {thunkTryCatch} from "../../../common/utils";
import {AddTaskArgType, TaskType, UpdateTaskArgType, UpdateTaskModelType} from "../api/tasks/tasks-api.types";
import {tasksApi} from "../api/tasks/tasks-api";


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

                .addCase(updateTask.fulfilled, (state, action) => {
                    const tasksForCurrentTodolist = state[action.payload.todolistId];
                    const index = tasksForCurrentTodolist.findIndex((task) => task.id === action.payload.taskId);
                    if (index !== -1) {
                        tasksForCurrentTodolist[index] = {...tasksForCurrentTodolist[index], ...action.payload.domainModel}
                    }
                })
                .addCase(removeTask.fulfilled, (state, action) => {
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
    `${slice.name}/fetchTasks`,
    async (todolistId, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI;
        return thunkTryCatch(thunkAPI, async () => {
            const res = await tasksApi.getTasks(todolistId);
            const tasks = res.data.items;
            return {tasks, todolistId};
        })
    });


const removeTask = createAppAsyncThunk<RemoveTaskArgType, RemoveTaskArgType>(
    `${slice.name}/removeTask`,
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI;
        return thunkTryCatch(thunkAPI, async () => {
            const res = await tasksApi.deleteTask(arg)
            if (res.data.resultCode === ResultCode.Success) {
                return arg;
            } else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null);
            }
        })
    });


const addTask = createAppAsyncThunk<{ task: TaskType }, AddTaskArgType>(
    `${slice.name}/addTask`,
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI;
        return thunkTryCatch(thunkAPI, async () => {
            const res = await tasksApi.createTask(arg);
            if (res.data.resultCode === ResultCode.Success) {
                const task = res.data.data.item;
                return {task};
            } else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null);
            }
        })
    });


const updateTask = createAppAsyncThunk<UpdateTaskArgType, UpdateTaskArgType>(
    `${slice.name}/updateTask`,
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue, getState} = thunkAPI;
        return thunkTryCatch(thunkAPI, async () => {
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
            const res = await tasksApi.updateTask(arg.todolistId, arg.taskId, apiModel)
            if (res.data.resultCode === ResultCode.Success) {
                return arg;
            } else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null);
            }
        })
    });

export const tasksReducer = slice.reducer
export const tasksActions = slice.actions
export const tasksThunks = {fetchTasks, addTask, updateTask, removeTask};

// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksStateType = Record<string, TaskType[]>

