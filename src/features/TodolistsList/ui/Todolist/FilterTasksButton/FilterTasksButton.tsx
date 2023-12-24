import Button from "@mui/material/Button";
import React from "react";
import {FilterValuesType, todolistsActions} from "../../../model/todolists-reducer";
import {useActions} from "../../../../../common/hooks/useActions";

type PropsType = {
    filter: FilterValuesType
    id: string
}
export const FilterTasksButton = (props: PropsType) => {
    const {changeTodolistFilter} = useActions(todolistsActions)

    const changeTodolistFilterHandler = (filterName: FilterValuesType) => {
        changeTodolistFilter({id: props.id, filter: filterName})
    }

    return <>
        <Button variant={props.filter === 'all' ? 'outlined' : 'text'}
                onClick={() => changeTodolistFilterHandler('all')}
                color={'inherit'}
        >All</Button>
        <Button variant={props.filter === 'active' ? 'outlined' : 'text'}
                onClick={() => changeTodolistFilterHandler('active')}
                color={'primary'}
        >Active</Button>
        <Button variant={props.filter === 'completed' ? 'outlined' : 'text'}
                onClick={() => changeTodolistFilterHandler('completed')}
                color={'secondary'}
        >Completed</Button>
    </>
}
