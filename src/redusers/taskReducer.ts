import {TasksStateType} from "../App";
import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistType} from "./todolistReduser";
import {TaskType} from "../api/todolists-api";
import {Dispatch} from "redux";
import {todolistsAPI, TodolistType} from "../api/todolists-api";
import {TaskTodolistComponentType} from "../Todolist";

export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
export type AddTaskActionType = {
    type: 'ADD-TASK',
    task: TaskType
    todolistId: string

}
export type ChangeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>
export type ChangeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>
export type SetTasksActionType = {
    type: 'SET-TASKS'
    tasks: TaskTodolistComponentType[]
    todoId: string
}

type ActionsType = RemoveTaskActionType | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistType
    | SetTasksActionType


const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType):TasksStateType => {
    switch (action.type) {
        case 'SET-TASKS': {
            return {...state, [action.todoId]:action.tasks}
        }
        case "SET-TODOS": {
            const copyState = {...state};
            action.todos.forEach((td: TodolistType) => {
                copyState[td.id] = []
            })
            return copyState;

        }
        case 'REMOVE-TASK': {
            const stateCopy = {...state}
            const tasks = stateCopy[action.todolistId];
            const newTasks = tasks.filter(t => t.id !== action.taskId);
            stateCopy[action.todolistId] = newTasks;
            return stateCopy;
        }
        case 'ADD-TASK': {
            // const stateCopy = {...state}
            // const tasks = stateCopy[action.task.id];
            // const newTasks = [action.task, ...tasks];
            // stateCopy[action.task.id] = newTasks;
            // return stateCopy;
            return {...state,[action.todolistId]:[action.task, ...state[action.todolistId]]}
        }
        // case 'ADD-TASK': {
        //     const stateCopy = {...state}
        //     const newTask: TaskTodolistComponentType = {
        //         id: v1(),
        //         title: action.title,
        //         isDone: false
        //     }
        //     const tasks = stateCopy[action.todolistId];
        //     const newTasks = [newTask, ...tasks];
        //     stateCopy[action.todolistId] = newTasks;
        //     return stateCopy;
        // }
        case 'CHANGE-TASK-STATUS': {

            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, isDone: action.isDone} : t)
            }
        }
        case 'CHANGE-TASK-TITLE': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, title: action.title} : t)
            }
        }
        case 'ADD-TODOLIST': {
            return {
                ...state,
                [action.todolistId]: []
            }
        }
        case 'REMOVE-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.id];
            return copyState;
        }
        default:
            return state;
    }
}

export const removeTaskAC = (taskId: string, todolistId: string) => {
    return {type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId} as const
}
// export const addTaskAC = (title: string, todolistId: string) => {
//     return {type: 'ADD-TASK', title, todolistId} as const
// }
export const addTaskAC = (task: TaskType, todolistId:string): AddTaskActionType => {
    return {type: 'ADD-TASK', task,todolistId} as const
}
export const changeTaskStatusAC = (taskId: string, isDone: boolean, todolistId: string) => {
    return {type: 'CHANGE-TASK-STATUS', isDone, todolistId, taskId} as const
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string) => {
    return {type: 'CHANGE-TASK-TITLE', title, todolistId, taskId} as const
}
export const setTasksAC = (tasks: TaskType[], todoId: string) => {
    return {type: "SET-TASKS", tasks, todoId} as const
}



export const getTasksTC = (todoId: string) => (dispatch: Dispatch) => {
    todolistsAPI.getTasks(todoId)
        .then((res) => {
            dispatch(setTasksAC(res.data.items, todoId))
        })
}

export const removeTaskTC = (taskId: string, todolistId:string)=>(dispatch:Dispatch)=> {
    todolistsAPI.deleteTask(todolistId,taskId).then((res)=>{
        dispatch(removeTaskAC(taskId,todolistId))
    })
}

export const createTaskTC = (todolistId:string, title:string)=>(dispatch:Dispatch)=> {
    todolistsAPI.createTask(todolistId,title).then((res)=>{
        dispatch(addTaskAC(res.data.data.item,todolistId))
    })
}
