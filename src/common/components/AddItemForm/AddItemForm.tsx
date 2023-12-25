import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import {AddBox} from '@mui/icons-material';
import {RequestStatusType} from "../../../app/app-reducer";
import {BaseResponseType} from "../../types";

type PropsType = {
    addItem: (title: string) => Promise<unknown>
    entityStatus?: RequestStatusType
}

export const AddItemForm = React.memo(function (props: PropsType) {

    let [title, setTitle] = useState('')
    let [error, setError] = useState<string | null>(null)

    const addItemHandler = () => {
        if (title.trim() !== '') {
            props.addItem(title)
                .then((res) => {
                    setTitle('');
                })
                .catch((err: BaseResponseType) => {
                    if (err?.resultCode) {
                        setError(err.messages[0]);
                    }
                })
        } else {
            setError('Title is required');
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error !== null) {
            setError(null);
        }
        if (e.charCode === 13) {
            addItemHandler();
        }
    }

    return <div>
        <TextField variant="outlined"
                   error={!!error}
                   value={title}
                   onChange={onChangeHandler}
                   onKeyPress={onKeyPressHandler}
                   label="Title"
                   helperText={error}
        />
        <IconButton color="primary" onClick={addItemHandler} disabled={props.entityStatus === "loading"}>
            <AddBox/>
        </IconButton>
    </div>
})
