import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
// import s from "./NotFoundPage.module.css"
// import error404 from "./svg/404.svg"

export const NotFoundPage = () => {
    return (<>
            <Container>
                {/*<div className={s.wrapper}>*/}
                {/*    <img src={error404} alt={'404'}/>*/}
                {/*</div>*/}
                <Box sx={{textAlign: 'center', marginTop: 8}}>
                    <Typography variant="h3" component="h1" gutterBottom>
                        404: Страница не найдена
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Извините, страница, которую вы ищете, не существует или была перемещена.
                    </Typography>
                    <Button variant="contained" color="primary" component={Link} to="/">
                        Вернуться на главную страницу
                    </Button>
                </Box>
            </Container>
    </>

    );
}

