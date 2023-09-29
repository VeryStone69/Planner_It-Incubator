import React, {ChangeEvent,useEffect} from 'react';
import {TodolistFromAppType} from './App';
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, Checkbox, IconButton, List, ListItem, Typography} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {useSelector} from "react-redux";
import {AppRootStateType, useAppDispatch} from "./state/store";
import {
    createTaskTC,
    changeTaskStatusAC,
    changeTaskTitleAC,
    getTasksTC,
    removeTaskTC
} from "./redusers/taskReducer";
import {changeTodolistFilterAC, changeTodolistTitleAC, removeTodolistAC} from "./redusers/todolistReduser";

export type TaskTodolistComponentType = {
    id: string
    title: string
    isDone?: boolean
}

type PropsType = {
    todolist: TodolistFromAppType
}

export const Todolist = (props: PropsType)=> {
    const tasks = useSelector<AppRootStateType, TaskTodolistComponentType[]>(state => state.tasks[props.todolist.id])
    const dispatch = useAppDispatch();


    useEffect(()=>{
        dispatch(getTasksTC(props.todolist.id))
    },[])




    const removeTodolist = () => {
        dispatch(removeTodolistAC(props.todolist.id));
    }

    const updateTaskTitleHandler = (newTitle: string) => {
        dispatch(changeTodolistTitleAC(props.todolist.id, newTitle));
    }


    const onAllClickHandler = () => dispatch(changeTodolistFilterAC(props.todolist.id, "all"));
    const onActiveClickHandler = () => dispatch(changeTodolistFilterAC(props.todolist.id, "active"));
    const onCompletedClickHandler = () => dispatch(changeTodolistFilterAC(props.todolist.id, "completed"));

    let allTodolistTasks = tasks;
    let tasksForTodolist = allTodolistTasks;

    if (props.todolist.filter === "active") {
        tasksForTodolist = allTodolistTasks.filter(t => !t.isDone);
    }
    if (props.todolist.filter === "completed") {
        tasksForTodolist = allTodolistTasks.filter(t => t.isDone);
    }

    return <div>
        <Typography align={"center"} variant={"h6"}>
            <EditableSpan oldTitle={props.todolist.title} callback={updateTaskTitleHandler}/>
            <IconButton onClick={removeTodolist} size={"small"}><Delete/></IconButton>
        </Typography>
        <AddItemForm callback={(title) => dispatch(createTaskTC(props.todolist.id, title))}/>
        <List>
            {
                tasksForTodolist.map(t => {
                    const onClickHandler = () => dispatch(removeTaskTC(t.id, props.todolist.id));
                    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        let newIsDoneValue = e.currentTarget.checked;
                        dispatch(changeTaskStatusAC(t.id, newIsDoneValue, props.todolist.id));
                    }

                    return <ListItem
                        sx={{p: "0 30px"}}
                        key={t.id} className={t.isDone ? "is-done" : ""}>
                        <Checkbox size={"small"} onChange={onChangeHandler} checked={t.isDone}/>
                        <EditableSpan oldTitle={t.title}
                                      callback={(newTitle) => dispatch(changeTaskTitleAC(t.id, newTitle, props.todolist.id))}/>
                        <IconButton onClick={onClickHandler}><Delete/></IconButton>
                    </ListItem>
                })
            }
        </List>
        <div>
            <Button sx={{ml: "22px"}}
                    color={props.todolist.filter === 'all' ? "secondary" : "primary"}
                    variant={"outlined"}
                    size={"small"}
                    disableElevation
                    onClick={onAllClickHandler}>All
            </Button>
            <Button color={props.todolist.filter === 'active' ? "secondary" : "primary"}
                    sx={{ml: "3px"}}
                    variant={"outlined"}
                    size={"small"}
                    disableElevation
                    onClick={onActiveClickHandler}>Active
            </Button>
            <Button color={props.todolist.filter === 'completed' ? "secondary" : "primary"}
                    sx={{ml: "3px"}}
                    variant={"outlined"}
                    size={"small"}
                    disableElevation
                    onClick={onCompletedClickHandler}>Completed
            </Button>
        </div>
    </div>
}


