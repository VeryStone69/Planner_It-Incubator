import {AxiosResponse} from 'axios'
import {UpdateDomainTaskModelType} from "./tasks-reducer";
import {instance} from "../../common/api";
import {RemoveTaskArgType, ResponseType, UpdateTodolistTitleArgType} from "../../common/types/common-types";
import {TaskPriorities, TaskStatuses} from "../../common/enums/common-enums";

// api
export const todolistsAPI = {
    getTodolists() {
        return instance.get<TodolistType[]>('todo-lists');
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{ item: TodolistType }>, AxiosResponse<ResponseType<{
            item: TodolistType
        }>>, { title: string }>('todo-lists', {title});
    },
    deleteTodolist(id: string) {
        return instance.delete<ResponseType>(`todo-lists/${id}`);
    },
    updateTodolist(arg:UpdateTodolistTitleArgType) {
        return instance.put<ResponseType>(`todo-lists/${arg.id}`, {title:arg.title});
    },
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`);
    },
    deleteTask(arg:RemoveTaskArgType) {
        return instance.delete<ResponseType>(`todo-lists/${arg.todolistId}/tasks/${arg.taskId}`);
    },
    createTask(arg: AddTaskArgType) {
        return instance.post<ResponseType<{ item: TaskType }>, AxiosResponse<ResponseType<{ item: TaskType }>>, {
            title: string
        }>(`todo-lists/${arg.todolistId}/tasks`, {title: arg.title});
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<ResponseType<{ item: TaskType }>, AxiosResponse<ResponseType<{
            item: TaskType
        }>>, UpdateTaskModelType>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
    }
}

// types

export type UpdateTaskArgType = {
    taskId: string;
    domainModel: UpdateDomainTaskModelType;
    todolistId: string;
};
export type AddTaskArgType = {
    title: string;
    todolistId: string;
};
export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}

export type AuthResponseType = {
    id: number
    login: string
    email: string
}
export type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}
export type UpdateTaskModelType = {
    title: string
    description: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
}
type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]
}
