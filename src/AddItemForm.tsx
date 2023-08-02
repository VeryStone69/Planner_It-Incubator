import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {Button, TextField} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

type PropsType={
    callback:(title: string)=>void
}


export const AddItemForm = (props:PropsType) => {
    let [title, setTitle] = useState("")
    let [error, setError] = useState<string | null>(null)

    const addTask = () => {
        let newTitle = title.trim();
        if (newTitle !== "") {
            props.callback(newTitle);
            setTitle("");
        } else {
            setError("Title is required");
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        setError(null);
        if (e.charCode === 13) {
            addTask();
        }
    }

    return (
        <div>
            <TextField
                sx={{mr:"3px"}}
                variant={"outlined"}
                size={"small"}
                label = {"Enter task"}
                value={title}
                onChange={onChangeHandler}
                onKeyPress={onKeyPressHandler}
                error={!!error}
            />
            <Button
                variant={"outlined"}
                onClick={addTask}
                color = {"primary"}
                size={"large"}
            ><AddCircleOutlineIcon/></Button>
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

