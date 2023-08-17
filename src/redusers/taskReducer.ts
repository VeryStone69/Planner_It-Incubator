import {TasksStateType} from "../App";
import {v1} from "uuid";
import {AddTodoListACType} from "./todolistReduser";

export const TaskReducer = (state: TasksStateType, action: TaskReducerActionType): TasksStateType => {
    switch (action.type) {
        case "REMOVE-TASK": {
            const todolistTasks = state[action.payload.todolistId];
            state[action.payload.todolistId] = todolistTasks.filter(t => t.id !== action.payload.id);
            return {...state};
        }
        case "ADD-TASK": {
            const task = {id: v1(), title: action.payload.title, isDone: false};
            return ({...state, [action.payload.todolistId]: [task, ...state[action.payload.todolistId]]});
        }
        case "CHANGE-STATUS": {
            return {
                ...state, [action.payload.todolistId]: state[action.payload.todolistId]
                    .map(t => t.id === action.payload.id ? {...t, isDone: action.payload.isDone} : t)
            }
        }
        case "REMOVE-TODOLIST": {
            delete state[action.payload.id]
            return {...state}
        }
        case "UPDATE-TASK": {
            const todoID = action.payload.todolistId;
            const taskId = action.payload.taskId;
            const newTitle = action.payload.newTitle;
            return {
                ...state,
                [todoID]: state[todoID].map(el => el.id === taskId ? {...el, title: newTitle} : el)
            }
        }
        case "ADD-TASK-TODOLIST": {
            return {...state, [action.payload.todolistId]: []}
        }
        default:
            return state
    }


}


//===== Cюда записываем все типизации actions в один тип
type TaskReducerActionType =
    RemoveTaskACType
    | AddTaskACType
    | ChangeStatusACType
    | RemoveTodolistACType
    | UpdateTaskACType
    | AddTaskForTodolistAC

//===== Типизизируем каждый action по отдельности
type RemoveTaskACType = ReturnType<typeof removeTaskAC>
type AddTaskACType = ReturnType<typeof addTaskAC>
type ChangeStatusACType = ReturnType<typeof changeStatusAC>
type RemoveTodolistACType = ReturnType<typeof removeTodolistAC>
type UpdateTaskACType = ReturnType<typeof updateTaskAC>
type AddTaskForTodolistAC = ReturnType<typeof addTaskForTodolistAC>

//===== Пишем action
export const removeTaskAC = (id: string, todolistId: string) => {
    return {
        type: "REMOVE-TASK",
        payload: {
            id,
            todolistId
        }
    } as const
}
export const addTaskAC = (title: string, todolistId: string) => {
    return {
        type: "ADD-TASK",
        payload: {
            title,
            todolistId
        }
    } as const
}
export const changeStatusAC = (id: string, isDone: boolean, todolistId: string) => {
    return {
        type: "CHANGE-STATUS",
        payload: {
            id,
            isDone,
            todolistId
        }
    } as const
}
export const removeTodolistAC = (id: string) => {
    return {
        type: "REMOVE-TODOLIST",
        payload: {
            id
        }

    } as const
}
export const updateTaskAC = (todolistId: string, taskId: string, newTitle: string) => {
    return {
        type: "UPDATE-TASK",
        payload: {
            todolistId,
            taskId,
            newTitle
        }
    } as const
}
export const addTaskForTodolistAC = (todolistId: string) => {
    return {
        type: "ADD-TASK-TODOLIST",
        payload: {
            todolistId
        }
    } as const
}