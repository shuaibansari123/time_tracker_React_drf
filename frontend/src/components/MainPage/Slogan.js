import React from 'react';
import GoogleLoginBtn from '../../services/googleAuth';


function Slogan() {

    return(
        <div className="col-12 col-lg-6 info">
            <div className="container">
                <br /><br />
                <h1 className='position-relative'>Embrace Simplicity, Enhance Productivity</h1>
                <p>TrackerAI is a simple and efficient way to track your time and manage your tasks. 
                    It is designed to help you stay focused and productive. 
                    You can easily log your tasks, track your time, and view your records.
                </p>
                <div className="row info-btns">
                    <a href="signup/" className="primary-btn main-font-semibold">Start Now</a>
                    <GoogleLoginBtn />
                </div>
            </div>
        </div>
    );
}

export default Slogan;