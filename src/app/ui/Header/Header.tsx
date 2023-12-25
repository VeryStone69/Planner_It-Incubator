import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import LinearProgress from "@mui/material/LinearProgress";
import AppBar from "@mui/material/AppBar";
import React from "react";
import {useAppSelector} from "../../store";
import {RequestStatusType} from "../../model/app-reducer";
import {isLoggedInAppSelector, statusSelector} from "../../model/app.selector";
import {useActions} from "../../../common/hooks/useActions";
import {authThunks} from "../../../features/auth/model/auth-reducer";
import {Theme} from "@mui/material";

type ColorMode = {
    toggleColorMode: () => void;
}

type PropsType = {
    colorMode: ColorMode
    theme: Theme
}
export const Header = (props: PropsType) => {
    const status = useAppSelector<RequestStatusType>(statusSelector)
    const isLoggedIn = useAppSelector<boolean>(isLoggedInAppSelector)
    const {logout: logoutThunk} = useActions(authThunks)

    const logOutHandler = () => {
        logoutThunk()
    }
    return <AppBar position="static">
        <Toolbar>
            <IconButton sx={{ml: 1}} onClick={props.colorMode.toggleColorMode} color="inherit">
                {props.theme.palette.mode === 'dark' ? <Brightness7Icon/> : <Brightness4Icon/>}
            </IconButton>
            <Typography variant="h6">Todolist</Typography>
            {isLoggedIn ?
                <Button onClick={logOutHandler} color="inherit"><LogoutIcon/></Button>
                : <div className="placeholder"></div>
            }
        </Toolbar>
        {status === 'loading' && <LinearProgress/>}
    </AppBar>
}
