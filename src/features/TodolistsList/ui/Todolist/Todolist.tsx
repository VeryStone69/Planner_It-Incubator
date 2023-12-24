import React, {useCallback, useEffect} from 'react'
import {AddItemForm} from '../../../../common/components'
import {EditableSpan} from '../../../../common/components'
import {Task} from './Tasks/Task/Task'
import {FilterValuesType, todolistsThunks} from '../../model/todolists-reducer'
import IconButton from '@mui/material/IconButton';
import {Delete} from '@mui/icons-material';
import {RequestStatusType} from "../../../../app/app-reducer";
import {tasksThunks} from "../../model/tasks-reducer";
import {TaskStatuses} from "../../../../common/enums/common-enums";
import {useActions} from "../../../../common/hooks/useActions";
import {TaskType} from "../../api/tasks/tasks-api.types";
import {FilterTasksButton} from "./FilterTasksButton/FilterTasksButton";
import {Tasks} from "./Tasks/Tasks";

type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

export const Todolist = React.memo(function (props: PropsType) {
    const {fetchTasks, addTask} = useActions(tasksThunks)
    const {changeTodolistTitle, removeTodolist} = useActions(todolistsThunks)

    useEffect(() => {
        fetchTasks(props.id)
    }, [])

    const addTaskCallback = useCallback((title: string) => {
        addTask({title, todolistId: props.id})
    }, [props.id])

    const removeTodolistHandler = () => {
        removeTodolist(props.id)
    }
    const changeTodolistTitleHandler = (title: string) => {
        changeTodolistTitle({id: props.id, title})
    }



    return <div>

        <h3><EditableSpan value={props.title} onChange={changeTodolistTitleHandler}/>
            <IconButton onClick={removeTodolistHandler} disabled={props.entityStatus === "loading"}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTaskCallback} entityStatus={props.entityStatus}/>
        <Tasks tasks={props.tasks} id = {props.id} entityStatus={props.entityStatus} filter={props.filter}/>
        <div style={{paddingTop: '10px'}}>
            <FilterTasksButton filter={props.filter} id={props.id}/>
        </div>
    </div>
})


