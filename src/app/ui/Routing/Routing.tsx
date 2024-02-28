import {Navigate, Route, Routes} from "react-router-dom";
import {TodolistsList} from "../../../features/TodolistsList/ui/TodolistsList";
import {Login} from "../../../features/auth/ui/Login";
import React from "react";
import {NotFoundPage} from "../../../common/components";

export const Routing = () => {
    const ROUTES = {
        HOME: '/',
        LOGIN: '/login',
        TODO_LIST: '/Planner_It-Incubator',
        NOT_FOUND: '/404',
    };
    return (
        <Routes>
            <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.TODO_LIST} replace />} />
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.TODO_LIST} element={<TodolistsList />} />
            <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage/>}/>
            <Route path="/*" element={<Navigate to={ROUTES.NOT_FOUND} />} />
        </Routes>
    )
}