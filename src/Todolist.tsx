import React, {ChangeEvent} from 'react';
import {FilterValuesType} from './App';
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, Checkbox, IconButton, List, ListItem, Typography} from "@mui/material";
import {Delete} from "@mui/icons-material";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: string, todolistId: string) => void
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    changeTaskStatus: (id: string, isDone: boolean, todolistId: string) => void
    removeTodolist: (id: string) => void
    filter: FilterValuesType
    updateTask: (todolistId: string, taskId: string, newTitle: string) => void
    updateTodolistTitle: (todolistId: string, newTitle: string) => void
}

export function Todolist(props: PropsType) {
    const removeTodolist = () => props.removeTodolist(props.id)
    const onAllClickHandler = () => props.changeFilter("all", props.id);
    const onActiveClickHandler = () => props.changeFilter("active", props.id);
    const onCompletedClickHandler = () => props.changeFilter("completed", props.id);
    const addTaskHandler = (title: string) => {
        props.addTask(title, props.id)
    }


    const updateTaskTitleHandler = (newTitle: string) => {
        props.updateTodolistTitle(props.id, newTitle)
    }
    const updateTaskHandler = (taskID: string, newTitle: string) => {
        props.updateTask(props.id, taskID, newTitle)
    }

    return <div>
        <Typography align={"center"} variant={"h6"}>
            <EditableSpan oldTitle={props.title} callback={updateTaskTitleHandler}/>
            <IconButton onClick={removeTodolist} size={"small"}><Delete/></IconButton>
        </Typography>
        <AddItemForm callback={addTaskHandler}/>
        <List>
            {
                props.tasks.map(t => {
                    const onClickHandler = () => props.removeTask(t.id, props.id)
                    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        let newIsDoneValue = e.currentTarget.checked;
                        props.changeTaskStatus(t.id, newIsDoneValue, props.id);
                    }

                    return <ListItem
                        sx={{p: "0 30px"}}
                        key={t.id} className={t.isDone ? "is-done" : ""}>
                        <Checkbox size={"small"} onChange={onChangeHandler} checked={t.isDone}/>
                        <EditableSpan oldTitle={t.title} callback={(newTitle) => updateTaskHandler(t.id, newTitle)}/>
                        <IconButton onClick={onClickHandler}><Delete/></IconButton>
                    </ListItem>
                })
            }
        </List>
        <div>
                <Button sx={{ml: "22px"}}
                        color={props.filter === 'all' ? "secondary" : "primary"}
                        variant={"outlined"}
                        size={"small"}
                        disableElevation
                        onClick={onAllClickHandler}>All
                </Button>
                <Button color={props.filter === 'active' ? "secondary" : "primary"}
                        sx={{ml: "3px"}}
                        variant={"outlined"}
                        size={"small"}
                        disableElevation
                        onClick={onActiveClickHandler}>Active
                </Button>
                <Button color={props.filter === 'completed' ? "secondary" : "primary"}
                        sx={{ml: "3px"}}
                        variant={"outlined"}
                        size={"small"}
                        disableElevation
                        onClick={onCompletedClickHandler}>Completed
                </Button>
        </div>
    </div>
}


