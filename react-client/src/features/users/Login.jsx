import { CacheProvider } from "@emotion/react";
import { Button, Grid2, Paper, TextField } from "@mui/material";
import rtlPlugin from '@mui/stylis-plugin-rtl';
import { prefixer } from 'stylis';
import createCache from '@emotion/cache';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import './Login.css'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addUser, login, setStatus } from "./userSlice";
import { getAllRecipes } from "../recipes/recipeSlice";


const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
});

const Login = () => {

    const [condition, setCondition] = useState('login')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const status = useSelector((state) => state.users.status);

    // סכימות ולידציה
    const loginSchema = yup.object({
        email: yup.string().email('כתובת דוא"ל לא חוקית').required('שדה חובה'),
        password: yup.string()
            .required('שדה חובה')
            .min(8, 'הסיסמא חייבת להיות לפחות 8 תווים')
            .matches(/[a-zA-Z]/, 'הסיסמא חייבת לכלול לפחות אות אחת גדולה או קטנה')
            .matches(/[0-9]/, 'הסיסמא חייבת לכלול לפחות מספר')
            .matches(/[\W_]/, 'הסיסמא חייבת לכלול לפחות תו מיוחד'),
        username: condition == 'register' && yup.string().required('שדה חובה')
    });

    // טופס כניסה
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginSchema),
        mode: 'onTouched'
    });

    useEffect(() => {
        if (status === 'fulfilled') {
            dispatch(setStatus())
            dispatch(getAllRecipes())
            navigate(-1)
        } else if (status === 'failed!!') {
            setCondition('register')
        }
    }, [status]);
    

    const onSubmitLogin = (user) => {
        dispatch(login(user))
    }

    const onSubmitRegister = (user) => {
        dispatch(addUser(user));
    }

    return (<>
        <form className="form-container" onSubmit={handleSubmit(condition == 'login' ? onSubmitLogin : onSubmitRegister)}>
            <div className="form-login">
                <img src="/favicon.svg" />
                <h2>{condition == 'login' ? 'כניסה' : 'הרשמה'}</h2>
                <Grid2 container spacing={2} sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    {condition == 'register' &&
                        <Grid2 >
                            <CacheProvider value={cacheRtl}>
                                <div dir="rtl">
                                    <TextField
                                        label="שם משתמש"
                                        {...register("username")}
                                        fullWidth
                                        error={!!errors.username}
                                        helperText={errors.username?.message}
                                    />
                                </div>
                            </CacheProvider>
                        </Grid2>
                    }
                    <Grid2 >
                        <CacheProvider value={cacheRtl}>
                            <div dir="rtl">
                                <TextField
                                    label='דוא"ל'
                                    {...register("email")}
                                    fullWidth
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                            </div>
                        </CacheProvider>
                    </Grid2>
                    <Grid2 >
                        <CacheProvider value={cacheRtl}>
                            <div dir="rtl">
                                <TextField
                                    label="סיסמא"
                                    type="password"
                                    {...register("password")}
                                    fullWidth
                                    error={!!errors.password}
                                    helperText={errors.password?.message}
                                />
                            </div>
                        </CacheProvider>
                    </Grid2>
                    <Grid2 >
                        <Button variant="contained" type="submit" fullWidth sx={{ backgroundColor: '#ff9b8ca6', fontSize: "larger" }}>
                            {condition == 'login' ? 'כניסה' : 'הרשמה'}
                        </Button>
                    </Grid2>
                </Grid2>
                {condition == 'login' ? <p>אין לך עדיין חשבון?<span style={{ color: "var(--primary-color)", cursor: "pointer" }} onClick={() => { setCondition('register') }}> להרשמה</span></p> :
                    <p>יש לך חשבון? <span style={{ color: "var(--primary-color)", cursor: "pointer" }} onClick={() => { setCondition('login') }}> לכניסה</span></p>}
            </div>
        </form>
    </>);
}

export default Login;