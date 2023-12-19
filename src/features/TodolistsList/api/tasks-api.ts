import {instance} from "../../../common/api";
import {BaseResponseType, RemoveTaskArgType} from "../../../common/types";
import {AxiosResponse} from "axios";
import {AddTaskArgType, GetTasksResponse, TaskType, UpdateTaskModelType} from "./tasks-api.types";


export const tasksApi = {
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`);
    },
    deleteTask(arg:RemoveTaskArgType) {
        return instance.delete<BaseResponseType>(`todo-lists/${arg.todolistId}/tasks/${arg.taskId}`);
    },
    createTask(arg: AddTaskArgType) {
        return instance.post<BaseResponseType<{ item: TaskType }>, AxiosResponse<BaseResponseType<{ item: TaskType }>>, {
            title: string
        }>(`todo-lists/${arg.todolistId}/tasks`, {title: arg.title});
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<BaseResponseType<{ item: TaskType }>, AxiosResponse<BaseResponseType<{
            item: TaskType
        }>>, UpdateTaskModelType>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
    }
}