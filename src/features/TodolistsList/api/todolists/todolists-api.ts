import {AxiosResponse} from 'axios'
import {instance} from "../../../../common/api";
import {BaseResponseType, UpdateTodolistTitleArgType} from "../../../../common/types";
import {TaskPriorities, TaskStatuses} from "../../../../common/enums/common-enums";
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
    // getTasks(todolistId: string) {
    //     return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`);
    // },
    // deleteTask(arg:RemoveTaskArgType) {
    //     return instance.delete<BaseResponseType>(`todo-lists/${arg.todolistId}/tasks/${arg.taskId}`);
    // },
    // createTask(arg: AddTaskArgType) {
    //     return instance.post<BaseResponseType<{ item: TaskType }>, AxiosResponse<BaseResponseType<{ item: TaskType }>>, {
    //         title: string
    //     }>(`todo-lists/${arg.todolistId}/tasks`, {title: arg.title});
    // },
    // updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
    //     return instance.put<BaseResponseType<{ item: TaskType }>, AxiosResponse<BaseResponseType<{
    //         item: TaskType
    //     }>>, UpdateTaskModelType>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
    // }
}

// types

// export type UpdateTaskArgType = {
//     taskId: string;
//     domainModel: UpdateDomainTaskModelType;
//     todolistId: string;
// };
// export type AddTaskArgType = {
//     title: string;
//     todolistId: string;
// };

// export type TaskType = {
//     description: string
//     title: string
//     status: TaskStatuses
//     priority: TaskPriorities
//     startDate: string
//     deadline: string
//     id: string
//     todoListId: string
//     order: number
//     addedDate: string
// }
// export type UpdateTaskModelType = {
//     title: string
//     description: string
//     status: TaskStatuses
//     priority: TaskPriorities
//     startDate: string
//     deadline: string
// }
// type GetTasksResponse = {
//     error: string | null
//     totalCount: number
//     items: TaskType[]
// }
