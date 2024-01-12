import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {Navigate} from "react-router-dom";
import {useLogin} from "../lib/useLogin";
import s from "./Login.module.css"


export const Login = () => {
    const {formik, isLoggedIn,captcha} = useLogin()
    if (isLoggedIn) {
        return <Navigate to={"/"}/>
    }
    return <Grid container justifyContent={'center'}>
        <Grid item justifyContent={'center'}>
            <form onSubmit={formik.handleSubmit}>
                <FormControl>
                    <FormLabel>
                        <p>To log in get registered
                            <a href={'https://social-network.samuraijs.com/'}
                               className={s.createAccountLink}
                               target={'_blank'}> here
                            </a>
                        </p>
                        <p>or use common test account credentials:</p>
                        <p><b>Email:</b> free@samuraijs.com</p>
                        <p><b>Password:</b> free</p>
                    </FormLabel>
                    <FormGroup>
                        <TextField label="Email"
                                   margin="normal"
                                   {...formik.getFieldProps('email')}
                        />
                        {formik.touched.email && formik.errors.email ?
                            <div style={{color: "red"}}>{formik.errors.email}</div> : null}
                        <TextField type="password"
                                   label="Password"
                                   margin="normal"
                                   {...formik.getFieldProps('password')}
                        />
                        {formik.touched.password && formik.errors.password ?
                            <div style={{color: "red"}}>{formik.errors.password}</div> : null}
                        <FormControlLabel label={'Remember me'}
                                          control={<Checkbox
                                              checked={formik.values.rememberMe}
                                              {...formik.getFieldProps('rememberMe')}
                                          />}/>

                        {!!captcha&&<div className={s.containerCaptchaImg}><img src={`${captcha}`} alt={"Antibot symbols"}/></div>}
                        {!!captcha && <div className={s.containerInputForCaptcha}>
                            <TextField placeholder={"Symbols from image"} name={"captcha"}
                                   type="text" value={formik.values.captcha} onChange={formik.handleChange}
                                       sx={{ width: '100%' }}
                            />
                        </div>}

                        <Button type={'submit'}
                                variant={'contained'}
                                color={'primary'}
                                disabled={!(!formik.errors.password && !formik.errors.email)}>
                            Login
                        </Button>
                    </FormGroup>
                </FormControl>

            </form>
        </Grid>
    </Grid>
}