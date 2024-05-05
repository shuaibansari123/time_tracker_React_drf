import React, {useState} from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import '../styles/mainPage.css';
import { useAuth } from './authServices';

const HOST = process.env.REACT_APP_API_HOST || '127.0.0.1:8000'; 
const ROOT_URL = `http://${HOST}/api/v1`;

const GoogleLoginBtn = () => {
    const { googleLogin } = useAuth();
    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        user: null,
        token: null,
    });

    const updateAuthState = ({ isAuthenticated, user, token }) => {
        setAuthState({ isAuthenticated, user, token });
        if (isAuthenticated) {
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            googleLogin(user, token);
            window.location.href = '/dashboard/';
        }
    };

    const handleLoginSuccess = (tokenResponse) => {
        axios.post(`${ROOT_URL}/users/callback/`, { access_token: tokenResponse.access_token })
            .then(response => {
                updateAuthState({
                    isAuthenticated: true,
                    user: response.data.user_id,
                    token: response.data.access_token,
                });
            })
            .catch(error => {
                console.error('Error sending token to backend', error);
            });
    };

    const handleLogin = useGoogleLogin({
        onSuccess: handleLoginSuccess,
        onError: error => console.log(error),
    });

    return (
        <button onClick={() => handleLogin()} type="button" className="secondary-btn secondary-btn-google">
            <p className="main-font-semibold">Sign Up with Google</p>
        </button>
    );
};

export default GoogleLoginBtn;
