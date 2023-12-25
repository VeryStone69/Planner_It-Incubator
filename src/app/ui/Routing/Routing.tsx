import {Navigate, Route, Routes} from "react-router-dom";
import {TodolistsList} from "../../../features/TodolistsList/ui/TodolistsList";
import {Login} from "../../../features/auth/ui/Login";
import React from "react";

export const Routing = () => {
    return <Routes>
        <Route path="/404" element={<h1>404: Page NOT FOUND</h1>}/>
        <Route path="/*" element={<Navigate to="/404"/>}/>
        <Route path="/TodoList" element={<TodolistsList/>}/>
        <Route path="/" element={<Navigate to="/TodoList"/>}/>
        <Route path="/login" element={<Login/>}/>
    </Routes>
}