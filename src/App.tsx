import React, {useCallback, useEffect} from 'react';
import './App.css';
import {TaskTodolistComponentType, Todolist} from './Todolist';
import {AddItemForm} from "./AddItemForm";
import {AppBar, Container, createTheme, IconButton, ThemeProvider, Typography} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import CssBaseline from '@mui/material/CssBaseline';
import {addTodolistAC,getTodosTC} from "./redusers/todolistReduser";
import {useAppDispatch, useAppSelector} from "./state/store";

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistFromAppType = {
    id: string
    title: string
    filter: FilterValuesType
}
export type TasksStateType = {
    [key: string]: Array<TaskTodolistComponentType>
}


export const App = ()=> {

    useEffect(()=>{
        dispatch(getTodosTC())
    },[])

    const todolists = useAppSelector<Array<TodolistFromAppType>>(state => state.todolists)
    const dispatch = useAppDispatch();

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistAC(title));
    },[dispatch])


    const [mode, setMode] = React.useState<'light' | 'dark'>('light');
    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
        }),
        [],
    );

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                },
            }),
        [mode],
    );


    return (<ThemeProvider theme={theme}>
            <CssBaseline/>
            <div className="App">
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{mr: 2}}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                            Todolist
                        </Typography>
                        <IconButton sx={{ml: 1}} onClick={colorMode.toggleColorMode} color="inherit">
                            {theme.palette.mode === 'dark' ? <Brightness7Icon/> : <Brightness4Icon/>}
                        </IconButton>
                        <Button color="inherit">Login</Button>
                    </Toolbar>
                </AppBar>
                <Container fixed>
                    <Grid container sx={{p: "10px"}}>
                        <AddItemForm callback={addTodolist}/>
                    </Grid>

                    <Grid container spacing={2}>
                        {
                            todolists.map(tl => {
                                return <Grid item key={tl.id}>
                                    <Paper elevation={2} sx={{p: "10px"}}>
                                        <Todolist todolist={tl}/>
                                    </Paper>
                                </Grid>
                            })
                        }
                    </Grid>
                </Container>

            </div>
        </ThemeProvider>
    );
}


