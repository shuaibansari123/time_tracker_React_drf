import React from 'react';
import homeImg from '../../img/home-900.webp';
import '../../styles/mainPage.css';

function DemoImg() {

    return(
        <div className="col-12 col-lg-6">
            <div className="container">
                <img className='demoImg' src={homeImg} alt="Image" data-aos="fade-up" data-aos-duration="500" data-aos-delay="100" />
            </div>
        </div>
    );
}

export default DemoImg;