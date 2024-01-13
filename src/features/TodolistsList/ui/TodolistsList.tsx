import React, {useCallback, useEffect} from 'react'
import {useAppSelector} from '../../../app/store'
import {TodolistDomainType, todolistsThunks} from '../model/todolists-reducer'
import {TasksStateType} from '../model/tasks-reducer'
import {AddItemForm} from '../../../common/components'
import {Todolist} from './Todolist/Todolist'
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {Navigate} from "react-router-dom";
import {
    tasksSelector,
    todolistsSelector,
    isLoggedInTodolistsListSelector
} from "./Todolist/todolists.selector";
import {useActions} from "../../../common/hooks/useActions";

export const TodolistsList = () => {
    const isLoggedIn = useAppSelector<boolean>(isLoggedInTodolistsListSelector)
    const todolists = useAppSelector<Array<TodolistDomainType>>(todolistsSelector)
    const tasks = useAppSelector<TasksStateType>(tasksSelector)

    const {fetchTodolists, addTodolist} = useActions(todolistsThunks)

    useEffect(() => {
        if (!isLoggedIn) {
            return;
        }
        fetchTodolists()
    }, [])

    const addTodolistCallback = useCallback((title: string) => {
        return addTodolist(title).unwrap()
    }, [])

    if (!isLoggedIn) {
        return <Navigate to={"/login"}/>
    }
    return <>
        <Grid container style={{padding: '20px'}}
              direction="row"
              justifyContent="center"
              alignItems="center">
            <AddItemForm addItem={addTodolistCallback}/>
        </Grid>
        <Grid container spacing={3} direction="row"
              justifyContent="space-evenly"
              alignItems="center">
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]

                    return <Grid item key={tl.id}>
                        <Paper style={{padding: '10px'}}>
                            <Todolist
                                id={tl.id}
                                title={tl.title}
                                tasks={allTodolistTasks}
                                entityStatus={tl.entityStatus}
                                filter={tl.filter}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}
