import React, {useEffect} from 'react'
import './App.css'
import {TodolistsList} from '../../features/TodolistsList/ui/TodolistsList'
import Container from '@mui/material/Container';
import {ThemeProvider} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import CircularProgress from "@mui/material/CircularProgress";
import {useAppSelector} from "../store";
import {ErrorSnackbar} from "../../common/components";
import {Navigate, Route, Routes} from "react-router-dom";
import {Login} from "../../features/auth/ui/Login";
import {authThunks} from "../../features/auth/model/auth-reducer";
import {isInitializedSelector} from "../model/app.selector";
import {useActions} from "../../common/hooks/useActions";
import {useColorMode} from "../lib/useColorMode";
import {Header} from "./Header/Header";


function App() {
    const isInitialized = useAppSelector<boolean>(isInitializedSelector)

    const {initializeApp: initializeAppThunk, logout: logoutThunk} = useActions(authThunks)
    const {theme, colorMode} = useColorMode()
    useEffect(() => {
        initializeAppThunk()
    }, [])

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <div className="App">
                <ErrorSnackbar/>
                <Header colorMode={colorMode} theme={theme}/>
                <Container fixed>
                    <Routes>
                        <Route path="/404" element={<h1>404: Page NOT FOUND</h1>}/>
                        <Route path="/*" element={<Navigate to="/404"/>}/>
                        <Route path="/TodoList_It-Incubator" element={<TodolistsList/>}/>
                        <Route path="/" element={<TodolistsList/>}/>
                        <Route path="/login" element={<Login/>}/>
                    </Routes>
                </Container>
            </div>
        </ThemeProvider>
    )
}

export default App
