import React, {useCallback, useEffect} from 'react'
import {AddItemForm} from '../../../../common/components'
import {EditableSpan} from '../../../../common/components'
import {Task} from './Task/Task'
import {FilterValuesType, todolistsThunks} from '../../model/todolists-reducer'
import IconButton from '@mui/material/IconButton';
import {Delete} from '@mui/icons-material';
import {RequestStatusType} from "../../../../app/app-reducer";
import {tasksThunks} from "../../model/tasks-reducer";
import {TaskStatuses} from "../../../../common/enums/common-enums";
import {useActions} from "../../../../common/hooks/useActions";
import {TaskType} from "../../api/tasks/tasks-api.types";
import {FilterTasksButton} from "./FilterTasksButton/FilterTasksButton";

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

    let tasksForTodolist = props.tasks

    if (props.filter === 'active') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (props.filter === 'completed') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    return <div>

        <h3><EditableSpan value={props.title} onChange={changeTodolistTitleHandler}/>
            <IconButton onClick={removeTodolistHandler} disabled={props.entityStatus === "loading"}>
                <Delete/>
            </IconButton>
        </h3>

        <AddItemForm addItem={addTaskCallback} entityStatus={props.entityStatus}/>
        <div>
            {
                tasksForTodolist.map(t => <Task key={t.id} task={t} todolistId={props.id}
                                                entityStatus={props.entityStatus}

                />)
            }
        </div>
        <div style={{paddingTop: '10px'}}>
            <FilterTasksButton filter={props.filter} id={props.id}/>
        </div>
    </div>
})


