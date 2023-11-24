import {
    AddTaskArgType,
    TaskPriorities,
    TaskStatuses,
    TaskType,
    todolistsAPI,
    UpdateTaskModelType
} from '../../api/todolists-api'
import {AppRootStateType, AppThunk} from '../../app/store'
import {appActions} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {todolistsActions} from "./todolists-reducer";
import {clearTodolistsAndTasks} from "../../common/actions/common.actions";
import {createAppAsyncThunk} from "../../utils/create-app-async-thunk";


const slice = createSlice({
        name: "tasks",
        initialState: {} as TasksStateType,
        reducers: {
            removeTask: (state, action: PayloadAction<{ taskId: string, todolistId: string }>) => {
                const tasksForCurrentTodolist = state[action.payload.todolistId];
                const index = tasksForCurrentTodolist.findIndex((task) => task.id === action.payload.taskId);
                if (index !== -1) tasksForCurrentTodolist.splice(index, 1)
            },
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
                .addCase(addTask.fulfilled,(state,action)=>{
                    const tasksForCurrentTodolist = state[action.payload.task.todoListId];
                    tasksForCurrentTodolist.unshift(action.payload.task)
                })
                .addCase(fetchTasks.fulfilled, (state, action) => {
                    state[action.payload.todolistId] = action.payload.tasks
                })
                .addCase(todolistsActions.addTodolist, (state, action) => {
                    state[action.payload.todolist.id] = []
                })
                .addCase(todolistsActions.removeTodolist, (state, action) => {
                    delete state[action.payload.id]
                })
                .addCase(todolistsActions.setTodolists, (state, action) => {
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

export const removeTaskTC = (taskId: string, todolistId: string): AppThunk => (dispatch) => {
    todolistsAPI.deleteTask(todolistId, taskId)
        .then(res => {
            dispatch(tasksActions.removeTask({taskId, todolistId}))
        })
}

const addTask = createAppAsyncThunk<{ task: TaskType }, AddTaskArgType>(
    "tasks/addTask",
    async (arg, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI;
        try {
            dispatch(appActions.setAppStatus({ status: "loading" }));
            const res = await todolistsAPI.createTask(arg);
            if (res.data.resultCode === ResultCode.Success) {
                const task = res.data.data.item;
                dispatch(appActions.setAppStatus({ status: "succeeded" }));
                return { task };
            } else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null);
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch);
            return rejectWithValue(null);
        }
    });



export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string): AppThunk =>
    (dispatch, getState: () => AppRootStateType) => {
        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)
        if (!task) {
            //throw new Error("task not found in the state");
            console.warn("task not found in the state")
            return
        }

        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...domainModel
        }

        todolistsAPI.updateTask(todolistId, taskId, apiModel)
            .then(res => {
                if (res.data.resultCode === 0) {
                    const action = tasksActions.updateTask({taskId, model: domainModel, todolistId})
                    dispatch(action)
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch)
            })
    }

export const tasksReducer = slice.reducer
export const tasksActions = slice.actions
export const tasksThunks = {fetchTasks,addTask};

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

        export const ResultCode = {
            Success: 0,
            Error: 1,
            Captcha: 10,
        } as const;