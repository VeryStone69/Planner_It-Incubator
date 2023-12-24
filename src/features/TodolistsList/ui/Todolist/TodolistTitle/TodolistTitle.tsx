import {EditableSpan} from "../../../../../common/components";
import IconButton from "@mui/material/IconButton";
import {Delete} from "@mui/icons-material";
import React, {useCallback} from "react";
import {useActions} from "../../../../../common/hooks/useActions";
import {todolistsThunks} from "../../../model/todolists-reducer";
import {RequestStatusType} from "../../../../../app/app-reducer";

type PropsType = {
    title: string
    id: string
    entityStatus: RequestStatusType
}
export const TodolistTitle = (props: PropsType) => {
    const {changeTodolistTitle, removeTodolist} = useActions(todolistsThunks)

    const changeTodolistTitleHandler = useCallback((title: string) => {
        changeTodolistTitle({id: props.id, title})
    }, [props.id])
    const removeTodolistHandler = () => {
        removeTodolist(props.id)
    }

    return <h3><EditableSpan value={props.title} onChange={changeTodolistTitleHandler}/>
        <IconButton onClick={removeTodolistHandler} disabled={props.entityStatus === "loading"}>
            <Delete/>
        </IconButton>
    </h3>
}