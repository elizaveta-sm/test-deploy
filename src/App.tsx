import React from "react";
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import LoginPage from "./pages/LoginPage";
import DataPage from "./pages/DataPage";
import { logout, selectAuthToken } from "./app/auth/authSlice";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useEffect } from "react";

const ProtectedRoutes: React.FC = () => {
    const token = useAppSelector(selectAuthToken);

    return token ? <Outlet />: <Navigate to='/login'/>;
};

const App: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            navigate('/')
        }
    }, [token])

    const showNavbar = location.pathname === '/' && token;

    return (
        <>
            { showNavbar && ( 
                <Box sx={{ flexGrow: 1 }}>
                    <AppBar position="static">
                        <Toolbar>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                Test
                            </Typography>
                            <Button color="inherit" onClick={() => dispatch(logout())}>Logout</Button>
                        </Toolbar>
                    </AppBar>
                </Box>
            ) }

            <Routes>
                <Route path="/" element={<ProtectedRoutes />}>
                    <Route path="/" element={<DataPage />} />
                </Route>

                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </>
    );
};

export default App;