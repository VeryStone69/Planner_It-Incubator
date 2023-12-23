import React, {useCallback, useEffect} from 'react'
import {useAppSelector} from '../../../app/store'
import {
    FilterValuesType,
    TodolistDomainType, todolistsActions, todolistsThunks
} from '../model/todolists-reducer'
import {TasksStateType, tasksThunks} from '../model/tasks-reducer'
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
import {TaskStatuses} from "../../../common/enums/common-enums";
import {useActions} from "../../../common/hooks/useActions";

export const TodolistsList: React.FC = () => {

    const isLoggedIn = useAppSelector<boolean>(isLoggedInTodolistsListSelector)
    const todolists = useAppSelector<Array<TodolistDomainType>>(todolistsSelector)
    const tasks = useAppSelector<TasksStateType>(tasksSelector)
    const {changeTodolistFilter} = useActions(todolistsActions)
    const {
        fetchTodolists: fetchTodolistsThunk,
        removeTodolist: removeTodolistThunk,
        changeTodolistTitle: changeTodolistTitleThunk,
        addTodolist: addTodolistThunk,
    } = useActions(todolistsThunks)

    const {
        addTask: addTaskThunk,
        updateTask: updateTaskThunk,
    } = useActions(tasksThunks)


    useEffect(() => {
        if (!isLoggedIn) {
            return;
        }
        fetchTodolistsThunk()
    }, [])

    // const removeTask = useCallback(function (taskId: string, todolistId: string) {
    //     removeTaskThunk({taskId, todolistId})
    // }, [])

    const addTask = useCallback(function (title: string, todolistId: string) {
        addTaskThunk({title, todolistId})
    }, [])

    const changeStatus = useCallback(function (taskId: string, status: TaskStatuses, todolistId: string) {
        updateTaskThunk({taskId, domainModel: {status}, todolistId})
    }, [])

    const changeTaskTitle = useCallback(function (taskId: string, title: string, todolistId: string) {
        updateTaskThunk({taskId, domainModel: {title}, todolistId})
    }, [])

    const changeFilter = useCallback(function (filter: FilterValuesType, id: string) {
        changeTodolistFilter({id, filter})
    }, [])

    const removeTodolist = useCallback(function (id: string) {
        removeTodolistThunk(id)
    }, [])

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        changeTodolistTitleThunk({id, title})
    }, [])

    const addTodolist = useCallback((title: string) => {
        addTodolistThunk(title)
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
