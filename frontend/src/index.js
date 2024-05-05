import React from 'react';
import ReactDOM from 'react-dom/client';
import {AuthProvider} from './services/authServices';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './routes';

import './styles/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';


// AOS for animation
import AOS from 'aos';
import 'aos/dist/aos.css';
AOS.init({
  duration: 1500,
  delay: 200,
  once: true,
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);


// ReactDOM.createRoot() is part of the new concurrent mode in React. 
// Concurrent mode allows React to interrupt a long-running render to handle a high-priority event. 
// If you're not using concurrent mode, you would use ReactDOM.render() instead.