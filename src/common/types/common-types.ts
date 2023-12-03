
export type FieldErrorType = {
    error: string
    field: string
}

export type BaseResponseType<D = {}> = {
    resultCode: number
    messages: string[]
    data: D
    fieldsErrors: FieldErrorType[]
}

export type RemoveTaskArgType = {
    todolistId: string;
    taskId: string;
};

export type UpdateTodolistTitleArgType = {
    id: string;
    title: string;
};