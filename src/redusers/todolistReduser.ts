import {FilterValuesType, TodolistType} from "../App";
import {v1} from "uuid";
import {addTodolistAC} from "./taskReducer";

export const TodolistReduser = (state: TodolistType[], action: TodolistReducerActionType): TodolistType[] => {
    switch (action.type) {
        case "CHANGE-FILTER": {
            return state.map(el => el.id === action.payload.todolistId ? {...el, filter: action.payload.value} : el)
        }
        case "REMOVE-TODOLIST": {
            return state.filter(tl => tl.id !== action.payload.id)
        }
        case "ADD-TODOLIST": {
            const newTodo: TodolistType = {id: action.payload.todolistId, title: action.payload.title, filter: "all"};
            return [newTodo, ...state]
        }
        case "UPDATE-TODOLIST-TITLE":{
            const todolistId=action.payload.todolistId;
            const newTitle = action.payload.newTitle
            return (state.map(el => el.id === todolistId ? {...el, title: newTitle} : el))
        }
        default:
            return state
    }
}

//===== Cюда записываем все типизации actions в один тип
type TodolistReducerActionType = ChangeFilterACType
    | RemoveTodolistACType
    | AddTodoListACType
    | UpdateTodolistTitleACType

//===== Типизизируем каждый action по отдельности
type ChangeFilterACType = ReturnType<typeof changeFilterAC>
type RemoveTodolistACType = ReturnType<typeof removeTodolistAC>
type AddTodoListACType = ReturnType<typeof addTodoListAC>
type UpdateTodolistTitleACType = ReturnType<typeof updateTodolistTitleAC>

//===== Пишем action
export const changeFilterAC = (value: FilterValuesType, todolistId: string) => {
    return {
        type: "CHANGE-FILTER",
        payload: {
            value,
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
export const addTodoListAC = (title: string, todolistId: string) => {
    return {
        type: "ADD-TODOLIST",
        payload: {
            title,
            todolistId
        }
    } as const
}
export const updateTodolistTitleAC = (todolistId: string, newTitle: string) => {
    return {
        type: "UPDATE-TODOLIST-TITLE",
        payload: {
            todolistId,
            newTitle
        }
    }as const
}

