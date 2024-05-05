import React, { useState } from 'react';
import { useAuth,  } from '../../services/authServices';
import GoogleLoginBtn from '../../services/googleAuth';
import { useNavigate } from 'react-router-dom';

// CSS
import '../../styles/auth.css';
import '../../styles/navbar.css';
import '../../styles/btn.css';
import trackerLogo from '../../img/trackerLogo.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const { signinUser, } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); 

  // remember Me
  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await signinUser({ email, password });
      console.log('Form submitted. Remember Me:', rememberMe);
      setErrorMessage(''); // Clear any previous error messages
      // Redirect to the dashboard
      navigate('/dashboard/');

    } catch (error) {
      // Set the error message state to the error thrown from signinUser
      setErrorMessage(error.message);
      // console.error('Login failed:', error);
    }
  };


  return (
    <div className="login-main">
        <nav className="navbar navbar-expand-lg ">
          <a className="navbar-brand" href="/">
              <img className="trackerLogo" src={trackerLogo} alt="Tracker Logo" />
          </a>
        </nav>
      <div className="container login-container">
            <div className="row">
              <div className="col-md-6 offset-md-0">
                {/* Title */}
                <h2 className='login-header'>Login</h2>
                <p>Welcome back to TrackerAI Time Tracker</p>
                {/* Display error message if any */}
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

                <form onSubmit={handleSubmit}>
                  {/* Email */}
                  <div className="mb-3">
                    <input className="form-control" id="email" type="email" placeholder="Email" value={email} 
                          onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  {/* Password */}
                  <div className="mb-3">
                    <input type="password" className="form-control" id="password" placeholder="Password" value={password} 
                            onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  {/* Remember Me */}
                  <div className="mb-3 form-check">
                      <input 
                        type="checkbox" 
                        className="form-check-input" 
                        id="rememberMe" 
                        checked={rememberMe} 
                        onChange={handleRememberMeChange}
                      />
                      <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                    </div>
                  {/* Submit Button */}
                  <div className="row">
                    <div className="col-12 col-lg-6">
                      <button type="submit" className="btn btn-primary w-100 mb-3">Log in</button>
                    </div>
                    <div className="col-12 col-lg-6">
                      <GoogleLoginBtn />
                    </div>
                  </div>
                </form>
                {/* Sign Up */}
                <div className="text-center mt-4">
                  Don’t have an account yet? <a href="/signup/">Sign Up</a>
                  {/* directing the browser to the root of the domain and then to /login/, instead of appending login/ to the current directory. */}
                </div>
              </div>
            </div>
          </div>
    </div>
  );
};

export default LoginPage;

