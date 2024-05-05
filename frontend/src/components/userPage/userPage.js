import React, { useState, useContext } from 'react';
import '../../styles/userPage/userPage.css';

import Navbar from '../Navbar';
import Footer from '../footer';  
import LoginPage from '../auth/Login';
import EditTaskBlock from './editTask';
import UserProfile from './profile';

// Aythentication 
import { AuthContext } from '../../services/authServices'; 

const Profile = () => {
  const { authState } = useContext(AuthContext);
  const [profile] = useState({
    name: 'John Doe',
    email: 'johndoe@memberpress.com',
    billingAddress: '',
    // Any other profile fields
  });
  

  const [activeComponent, setActiveComponent] = useState('');
  const handleClick = (componentName) => {
    setActiveComponent(componentName);
  };

  return (
    <div className="userPage-main"> 
      <Navbar />
      {authState.isAuthenticated ? (
        <div className='container userPage-container'>
          {/* Side Bar Nav */}
          <nav id="sidebar">
            <ul className="list-group">
              <li className="list-group-item list-group-item-action sidebar" onClick={() => handleClick('UserProfile')}>Profile</li>
              <li className="list-group-item list-group-item-action sidebar" onClick={() => handleClick('EditTaskBlock')}>Edit tasks</li>
            </ul>
          </nav>
          


          {/* Profile Info */}
          {activeComponent === 'EditTaskBlock' && <EditTaskBlock />}
          {activeComponent === 'UserProfile' && <UserProfile />}
          {activeComponent === '' && <UserProfile />}
        </div>
      ) : (
        <LoginPage />
      )}
      <Footer />
    </div>
  )};

export default Profile;