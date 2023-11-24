import React, {useEffect} from 'react'
import './App.css'
import {TodolistsList} from '../features/TodolistsList/TodolistsList'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {Menu} from '@mui/icons-material';
import {createTheme, ThemeProvider} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import {useAppSelector} from "./store";
import {ErrorSnackbar} from "../common/components";
import Button from "@mui/material/Button";
import {Navigate, Route, Routes} from "react-router-dom";
import {Login} from "../features/auth/Login";
import {initializeAppTC, logoutTC} from "../features/auth/auth-reducer";
import {RequestStatusType} from "./app-reducer";
import {statusSelector, isInitializedSelector, isLoggedInAppSelector} from "./app.selector";
import {useAppDispatch} from "../common/hooks";


function App() {
    const status = useAppSelector<RequestStatusType>(statusSelector)
    const isLoggedIn = useAppSelector<boolean>(isLoggedInAppSelector)
    const isInitialized = useAppSelector<boolean>(isInitializedSelector)
    const dispatch = useAppDispatch();
    const [mode, setMode] = React.useState<'light' | 'dark'>('light');

    useEffect(() => {
        dispatch(initializeAppTC())
    }, [])

    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
        }),
        [],);

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                },
            }),
        [mode],
    );
    const logOutHandler = () => {
        dispatch(logoutTC())
    }

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
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu">
                            <Menu/>
                        </IconButton>
                        <Typography variant="h6">
                            Todolist
                        </Typography>
                        <IconButton sx={{ml: 1}} onClick={colorMode.toggleColorMode} color="inherit">
                            {theme.palette.mode === 'dark' ? <Brightness7Icon/> : <Brightness4Icon/>}
                        </IconButton>
                        {isLoggedIn && <Button onClick={logOutHandler} color="inherit">LogOut</Button>}
                    </Toolbar>
                    {status === 'loading' && <LinearProgress/>}
                </AppBar>
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
