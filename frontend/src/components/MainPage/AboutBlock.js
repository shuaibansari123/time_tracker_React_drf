import React from 'react';
import profile from '../../img/profile.png';
import '../../styles/mainPage.css';

function AboutBlock() {

    return(
        <div className='row'>
            <div className="col-12 col-lg-4 " data-aos="fade-up"  data-aos-delay="1200">
                <img className="about-img"  src={profile} alt="" title="" />
            </div>
            <div className="col-12 col-lg-8" data-aos="fade-up"  data-aos-delay="1500">
                <div className="container">
                <br /><br />
                <h4 className="about-text name">Jerry Yu</h4>
                <p className="about-text title">Product Owner</p>
                <p className="about-text ">
                    “This App is designed for time tracking, 
                    emphasizing ease of use while ensuring versatility and robust data protection. 
                    It provides users with a straightforward yet powerful tool for managing time efficiently, 
                    ensuring that flexibility and security are not sacrificed in pursuit of simplicity”.
                </p>
                </div>
            </div>
        </div>
    );
}

export default AboutBlock;