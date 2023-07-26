import React, {ChangeEvent, useState} from 'react';

type EditableSpanPropsType = {
    oldTitle: string
    callback: (newTitle:string)=>void
}
export const EditableSpan = (props:EditableSpanPropsType) => {
    console.log(props.callback)

    const [edit, setEdit]=useState<boolean>(false)
    const [newTitle,setNewTitle]=useState<string>(props.oldTitle)
    const editHandler = () =>{
        setEdit(!edit)
        if(edit) {
            updateItem()
        }
    }
    const onChangeHandler = (e:ChangeEvent<HTMLInputElement>)=>{
        setNewTitle(e.currentTarget.value)
    }
    const updateItem = () => {
        props.callback(newTitle)
    }
    return (

            edit
                ? <input onBlur={editHandler} value={newTitle} onChange={onChangeHandler} autoFocus/>
                : <span onDoubleClick={editHandler}>{props.oldTitle}</span>

    );
};
