import {AxiosResponse} from 'axios'
import {instance} from "../../../../common/api";
import {BaseResponseType, UpdateTodolistTitleArgType} from "../../../../common/types";
import {TodolistType} from "./todolists-api.types";

// api
export const todolistsAPI = {
    getTodolists() {
        return instance.get<TodolistType[]>('todo-lists');
    },
    createTodolist(title: string) {
        return instance.post<BaseResponseType<{ item: TodolistType }>, AxiosResponse<BaseResponseType<{
            item: TodolistType
        }>>, { title: string }>('todo-lists', {title});
    },
    deleteTodolist(id: string) {
        return instance.delete<BaseResponseType>(`todo-lists/${id}`);
    },
    updateTodolist(arg:UpdateTodolistTitleArgType) {
        return instance.put<BaseResponseType>(`todo-lists/${arg.id}`, {title:arg.title});
    },
}

