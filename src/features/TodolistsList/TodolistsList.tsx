import React, {useCallback, useEffect} from 'react'
import {useAppSelector} from '../../app/store'
import {
    FilterValuesType,
    TodolistDomainType, todolistsActions, todolistsThunks
} from './todolists-reducer'
import {TasksStateType, tasksThunks} from './tasks-reducer'
import {AddItemForm} from '../../common/components'
import {Todolist} from './Todolist/Todolist'
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {Navigate} from "react-router-dom";
import {
    tasksSelector,
    todolistsSelector,
    isLoggedInTodolistsListSelector
} from "./Todolist/todolists.selector";
import {useAppDispatch} from "../../common/hooks";
import {TaskStatuses} from "../../common/enums/common-enums";

export const TodolistsList: React.FC = () => {

    const isLoggedIn = useAppSelector<boolean>(isLoggedInTodolistsListSelector)
    const todolists = useAppSelector<Array<TodolistDomainType>>(todolistsSelector)
    const tasks = useAppSelector<TasksStateType>(tasksSelector)
    const dispatch = useAppDispatch()
    console.log("TodolistsList RENDER")
    useEffect(() => {
        if (!isLoggedIn) {
            return;
        }
        dispatch(todolistsThunks.fetchTodolists())
    }, [])

    const removeTask = useCallback(function (taskId: string, todolistId: string) {
        dispatch(tasksThunks.removeTask({taskId, todolistId}))
    }, [])

    const addTask = useCallback(function (title: string, todolistId: string) {
        dispatch(tasksThunks.addTask({title, todolistId}))
    }, [])

    const changeStatus = useCallback(function (taskId: string, status: TaskStatuses, todolistId: string) {
        dispatch(tasksThunks.updateTask({taskId, domainModel:{status}, todolistId}))
    }, [])

    const changeTaskTitle = useCallback(function (taskId: string, title: string, todolistId: string) {
        dispatch(tasksThunks.updateTask({ taskId, domainModel: { title }, todolistId }));
    }, [])

    const changeFilter = useCallback(function (filter: FilterValuesType, id: string) {
        const action = todolistsActions.changeTodolistFilter({id, filter})
        dispatch(action)
    }, [])

    const removeTodolist = useCallback(function (id: string) {
        dispatch(todolistsThunks.removeTodolist(id))
    }, [])

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        dispatch(todolistsThunks.changeTodolistTitle({id, title}))
    }, [])

    const addTodolist = useCallback((title: string) => {
        dispatch(todolistsThunks.addTodolist(title))
    }, [])

    if (!isLoggedIn) {
        return <Navigate to={"/login"}/>
    }
    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]

                    return <Grid item key={tl.id}>
                        <Paper style={{padding: '10px'}}>
                            <Todolist
                                id={tl.id}
                                title={tl.title}
                                tasks={allTodolistTasks}
                                removeTask={removeTask}
                                changeFilter={changeFilter}
                                addTask={addTask}
                                entityStatus={tl.entityStatus}
                                changeTaskStatus={changeStatus}
                                filter={tl.filter}
                                removeTodolist={removeTodolist}
                                changeTaskTitle={changeTaskTitle}
                                changeTodolistTitle={changeTodolistTitle}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}
