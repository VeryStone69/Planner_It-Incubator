import {Navigate, Route, Routes} from "react-router-dom";
import {TodolistsList} from "../../../features/TodolistsList/ui/TodolistsList";
import {Login} from "../../../features/auth/ui/Login";
import React from "react";

export const Routing = () => {
    const ROUTES = {
        HOME: '/',
        LOGIN: '/login',
        TODO_LIST: '/TodoList_It-Incubator',
        NOT_FOUND: '/404',
    };
    return (
        <Routes>
            {/*Delete later*/}
                {/*<Route path={ROUTES.NOT_FOUND} element={<h1>404: Page NOT FOUND</h1>}/>*/}
                {/*<Route path="/*" element={<Navigate to="/404"/>}/>*/}
                {/*<Route path={ROUTES.TODO_LIST} element={<TodolistsList/>}/>*/}
                {/*<Route path={ROUTES.HOME} element={<TodolistsList/>}/>*/}
                {/*<Route path={ROUTES.LOGIN} element={<Login/>}/>*/}
            <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.TODO_LIST} replace />} />
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.TODO_LIST} element={<TodolistsList />} />
            <Route path={ROUTES.NOT_FOUND} element={<Navigate to="/404"/>}/>
            <Route path="/*" element={<Navigate to={ROUTES.NOT_FOUND} />} />
        </Routes>
    )
}