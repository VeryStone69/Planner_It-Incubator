import React from 'react';
import  {ChangeEvent} from 'react';

type InputPropsType = {
isDone:boolean
    callBack:(id:boolean)=>void
}
export const Input = (props:InputPropsType) => {
    const changeCheckBoxStatusHandler = (e:ChangeEvent<HTMLInputElement>)=>{
        props.callBack(e.currentTarget.checked)
    }
    return (
        <>
            <input type="checkbox" checked={props.isDone} onChange={(e)=>changeCheckBoxStatusHandler(e)}/>
        </>
    );
};

