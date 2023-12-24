import React, {useCallback, useEffect} from 'react'
import {AddItemForm} from '../../../../common/components'
import {FilterValuesType} from '../../model/todolists-reducer'
import {RequestStatusType} from "../../../../app/app-reducer";
import {tasksThunks} from "../../model/tasks-reducer";
import {useActions} from "../../../../common/hooks/useActions";
import {TaskType} from "../../api/tasks/tasks-api.types";
import {FilterTasksButton} from "./FilterTasksButton/FilterTasksButton";
import {Tasks} from "./Tasks/Tasks";
import {TodolistTitle} from "./TodolistTitle/TodolistTitle";

type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

export const Todolist = React.memo(function (props: PropsType) {
    const {fetchTasks, addTask} = useActions(tasksThunks)

    useEffect(() => {
        fetchTasks(props.id)
    }, [])

    const addTaskCallback = useCallback((title: string) => {
        return addTask({title, todolistId: props.id}).unwrap()
    }, [props.id])

    return <div>
        <TodolistTitle title={props.title} id={props.id} entityStatus={props.entityStatus}/>
        <AddItemForm addItem={addTaskCallback} entityStatus={props.entityStatus}/>
        <Tasks tasks={props.tasks} id={props.id} entityStatus={props.entityStatus} filter={props.filter}/>
        <div style={{paddingTop: '10px'}}>
            <FilterTasksButton filter={props.filter} id={props.id}/>
        </div>
    </div>
})


