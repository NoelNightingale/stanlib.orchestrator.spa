/* eslint-disable prettier/prettier */
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, fetchUserProfile, registerUser } from '../api/auth_api';
import { getScopesFromToken } from '../utils/jwt';

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {

    console.log("LOADING AUTH CONTEXT");

    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [scopes, setScopes] = useState(getScopesFromToken(token));
    const navigate = useNavigate();

    useEffect(() => {
        setScopes(getScopesFromToken(token));
        if (token) {
            const getUser = async () => {
                const user = await fetchUserProfile(token);
                setUser(user);
            };
            getUser();
        }
    }, [token]);

    const login = async (username, password) => {
        console.log("Logging In..")

        const response = await loginUser({ username, password });
        if (response?.access_token) {
            alert(response.access_token);
            setToken(response.access_token);
            localStorage.setItem('token', response.access_token);
            const userProfile = await fetchUserProfile(response.access_token);
            setUser(userProfile);
            navigate('/dashboard');

        }
    };

    const register = async (username, email, password) => {
        await registerUser({ username, email, password });
        navigate('/login');
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        navigate('/login');
    };

    const isTokenExpired = () => {
    if (!token) return true;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now(); // JWT exp is in seconds
    } catch (e) {
        return true;
    }
    };

    const isAuthenticated = () => {
        return true;
//        return token && !isTokenExpired(token);
    };



    return (
        <AuthContext.Provider value={{ token, user, login, register, logout, isAuthenticated, isTokenExpired, scopes }}>
            {children}
        </AuthContext.Provider>
    );
};

export {AuthProvider, AuthContext}