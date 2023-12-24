import {Task} from "./Task/Task";
import React from "react";
import {TaskType} from "../../../api/tasks/tasks-api.types";
import {RequestStatusType} from "../../../../../app/app-reducer";
import {TaskStatuses} from "../../../../../common/enums/common-enums";
import {FilterValuesType} from "../../../model/todolists-reducer";

type PropsType = {
    tasks: Array<TaskType>
    id: string
    entityStatus: RequestStatusType
    filter: FilterValuesType
}

export const Tasks = (props: PropsType) => {
    let tasksForTodolist = props.tasks

    if (props.filter === 'active') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (props.filter === 'completed') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed)
    }
    return <>
        {
            tasksForTodolist.map(t => <Task key={t.id} task={t} todolistId={props.id}
                                            entityStatus={props.entityStatus}

            />)
        }
    </>
}
