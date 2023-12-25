import React from "react";
import {createTheme} from "@mui/material";

export const useColorMode = () => {
    const savedTheme = localStorage.getItem('colorMode') as 'light' | 'dark' || 'light';

    const [mode, setMode] = React.useState<'light' | 'dark'>(savedTheme);

    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => {
                    const newMode = prevMode === 'light' ? 'dark' : 'light';
                    localStorage.setItem('colorMode', newMode);
                    return newMode;
                });
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
    return {theme, colorMode}
}