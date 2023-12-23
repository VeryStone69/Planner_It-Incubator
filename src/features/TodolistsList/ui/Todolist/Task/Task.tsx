import React, {ChangeEvent, useCallback} from 'react'
import {EditableSpan} from '../../../../../common/components'

import {Delete} from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import {RequestStatusType} from "../../../../../app/app-reducer";
import {TaskStatuses} from "../../../../../common/enums/common-enums";
import {TaskType} from "../../../api/tasks/tasks-api.types";
import {tasksThunks} from "../../../model/tasks-reducer";
import {useActions} from "../../../../../common/hooks/useActions";

type TaskPropsType = {
    task: TaskType
    todolistId: string
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    entityStatus: RequestStatusType
}

// const changeStatus = useCallback(function (taskId: string, status: TaskStatuses, todolistId: string) {
//     updateTaskThunk({taskId, domainModel: {status}, todolistId})
// }, [])

export const Task = React.memo((props: TaskPropsType) => {
    const {removeTask,updateTask} = useActions(tasksThunks)
    const removeTaskHandler = () => removeTask({taskId: props.task.id, todolistId: props.todolistId});

    const changeTaskHandler = (e: ChangeEvent<HTMLInputElement>) =>{
        let newIsDoneValue = e.currentTarget.checked;
        let status = newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New
        updateTask({taskId:props.task.id, domainModel: {status}, todolistId:props.todolistId})
    }


    const onTitleChangeHandler = useCallback((newValue: string) => {
        props.changeTaskTitle(props.task.id, newValue, props.todolistId)
    }, [props.task.id, props.todolistId]);

    return <div key={props.task.id} className={props.task.status === TaskStatuses.Completed ? 'is-done' : ''}>
        <Checkbox
            checked={props.task.status === TaskStatuses.Completed}
            color="primary"
            onChange={changeTaskHandler}
        />

        <EditableSpan value={props.task.title} onChange={onTitleChangeHandler}/>
        <IconButton onClick={removeTaskHandler} disabled={props.entityStatus === "loading"}>
            <Delete/>
        </IconButton>
    </div>
})
