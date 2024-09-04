import React, { useState } from 'react';
import { TextField, Button, Box, Alert, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { authenticateUser, selectAuthError, selectAuthIsLoading } from '../app/auth/authSlice';
import Spinner from '../components/Spinner';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isLoading = useAppSelector(selectAuthIsLoading);
    const error = useAppSelector(selectAuthError);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(authenticateUser({ username, password }));
        navigate('/');
    };

    return (
        <>
            {isLoading && <Spinner />}

            <Box
                sx={{
                    height: '100%',
                    width: '100%',
                    position: 'fixed',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#f0f0f0',
                }}
            >
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        width: '300px',
                        padding: 3,
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
                        position: 'relative',
                    }}
                >
                    { error && <Alert severity="error">{error}</Alert> }

                    <Typography variant="h5">Login</Typography>

                    <TextField
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        fullWidth
                    />

                    <TextField
                        type="password"
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        fullWidth
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isLoading}
                        fullWidth
                    >
                        Login
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default LoginPage;