import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/routes.css';




const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const MainPage = lazy(() => import('./components/mainPage/MainPage'));
const LogInPage = lazy(() => import('./components/auth/Login'));
const SignUpPage = lazy(() => import('./components/auth/SignUp'));
const UserPage = lazy(() => import('./components/userPage/userPage'));
const HandleGoogleRedirect = lazy(() => import('./services/googleAuth'));



function App() {


  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<MainPage />} exact />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<LogInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/google-redirect" element={<HandleGoogleRedirect />} />
          <Route path="/Profile" element={<UserPage />} />

        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
