import React, { useState, useEffect } from 'react';
import { useAuth,  } from '../../services/authServices';
import GoogleLoginBtn from '../../services/googleAuth';
// CSS
import '../../styles/btn.css';
import '../../styles/auth.css';
import '../../styles/navbar.css';
import trackerLogo from '../../img/trackerLogo.png';

const SignUpPage = () => {
  // Input variables
  const [username, setUsername] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  // Update username whenever email changes
  useEffect(() => {
    const derivedUsername = email.split('@')[0];
    setUsername(derivedUsername);
  }, [email]); 

  const { signupUser } = useAuth();

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Before proceeding with signup, you might want to check if the passwords match
    if(password !== password2) {
      alert("Passwords do not match.");
      return; // Stop the submission if passwords don't match
    }

    signupUser({ username, first_name, last_name, email, password, password2 });
  };



  return (
    <div className="signup-main">
    <nav className="navbar navbar-expand-lg ">
       <a className="navbar-brand" href="/">
           <img className="trackerLogo" src={trackerLogo} alt="Tracker Logo" />
       </a>
   </nav>
   <div className="container signup-container">
       <div className="col-md-6 offset-md-7">
           <h2>Sign Up for Free</h2>
           <p>Start your journey. No Credit Card Required</p>
           
           <form onSubmit={handleSubmit}>
               <div className='row'>
                   <div className="col-6 mb-3">
                   <input
                       type="text"
                       className="form-control"
                       placeholder="First Name"
                       value={first_name}
                       onChange={(e) => setFirstName(e.target.value)}
                       required
                   />
                   </div>
                   <div className="col-6 mb-3">
                   <input
                       type="text"
                       className="form-control"
                       placeholder="Last Name"
                       value={last_name}
                       onChange={(e) => setLastName(e.target.value)}
                       required
                   />
                   </div>
               </div>
               <div className="mb-3">
               <input
                   type="email"
                   className="form-control"
                   placeholder="Email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   required
               />
               </div>
               <div className="mb-3">
                   <input
                       type="password"
                       className="form-control"
                       placeholder="Password"
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       required
                   />
               </div>
               <div className="mb-3">
                   <input
                       type="password"
                       className="form-control"
                       placeholder="Re-enter Password"
                       value={password2}
                       onChange={(e) => setPassword2(e.target.value)}
                       required
                   />
               </div>
               <div className="mb-4">
               By signing up, you agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
               </div>
               <div className="row">
               <div className="col-6">
                   <button type="submit" className="btn btn-primary w-100 mb-3">Sign up</button>
               </div>
               <div className="col-6">
                     <GoogleLoginBtn />
               </div>
               </div>
           </form>
           <div className="text-center mt-4">
               Already have an account? <a href="/login/">Login</a>
           </div>
       </div>
   </div>
</div>
);
};

export default SignUpPage;
