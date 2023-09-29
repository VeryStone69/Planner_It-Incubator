import {FilterValuesType, TodolistFromAppType} from "../App";
import {v1} from "uuid";
import {todolistsAPI, TodolistType} from "../api/todolists-api";
import {Dispatch} from "redux";

export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolistTitleAC>
export type ChangeTodolistFilterActionType = ReturnType<typeof changeTodolistFilterAC>


type ActionsType = RemoveTodolistActionType | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | SetTodolistType

const initialState: Array<TodolistFromAppType> = []

export const todolistsReducer = (state: Array<TodolistFromAppType> = initialState, action: ActionsType): Array<TodolistFromAppType> => {
    switch (action.type) {
        case "SET-TODOS":{
            return action.todos.map(el=>({...el, filter:"all"}))
        }
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.id)
        }
        case 'ADD-TODOLIST': {
            return [{
                id: action.todolistId,
                title: action.title,
                filter: 'all'
            }, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                // если нашёлся - изменим ему заголовок
                todolist.title = action.title;
            }
            return [...state]
        }
        case 'CHANGE-TODOLIST-FILTER': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                // если нашёлся - изменим ему заголовок
                todolist.filter = action.filter;
            }
            return [...state]
        }
        default:
            return state;
    }
}

export const removeTodolistAC = (todolistId: string) => {
    return {type: 'REMOVE-TODOLIST', id: todolistId} as const
}
export const addTodolistAC = (title: string) => {
    return {type: 'ADD-TODOLIST', title: title, todolistId: v1()} as const
}
export const changeTodolistTitleAC = (id: string, title: string) => {
    return {type: 'CHANGE-TODOLIST-TITLE', id: id, title: title} as const
}
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => {
    return {type: 'CHANGE-TODOLIST-FILTER', id: id, filter: filter} as const
}


export type SetTodolistType = ReturnType<typeof setTodolistsAC>
export const setTodolistsAC = (todos: TodolistType[]) => ({type: "SET-TODOS", todos}as const)

export const getTodosTC = ()=> (dispatch: Dispatch)=>{
    todolistsAPI.getTodolists()
        .then((res)=>{
            dispatch(setTodolistsAC(res.data))
        })
}

