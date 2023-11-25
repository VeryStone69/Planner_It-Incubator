
export type ResponseType<D = {}> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors: Array<string>
    data: D
}

export type RemoveTaskArgType = {
    todolistId: string;
    taskId: string;
};